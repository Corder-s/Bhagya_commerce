package com.bhagya.commerce.storefront.service;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.storefront.domain.*;
import com.bhagya.commerce.storefront.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class StorefrontService {

    private static final Logger log = LoggerFactory.getLogger(StorefrontService.class);
    private static final Pattern HEX_COLOR_PATTERN = Pattern.compile("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
    private static final Set<String> ALLOWED_TYPOGRAPHY = Set.of("Outfit", "Plus Jakarta Sans", "Cinzel Decorative", "Playfair Display", "Inter");
    private static final Set<String> ALLOWED_BUTTON_STYLES = Set.of("rounded", "pill", "square");
    private static final Set<String> ALLOWED_CARD_STYLES = Set.of("surface", "raised", "flat", "bordered");
    private static final Set<String> ALLOWED_BORDER_RADIUS = Set.of("none", "sm", "md", "lg", "full");

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final StoreRepository storeRepository;
    private final DomainVerificationService domainVerificationService;
    private final AuditService auditService;
    private final RedisTemplate<String, Object> redisTemplate;

    private final Map<String, StorefrontConfiguration> configs = new ConcurrentHashMap<>();
    private final Map<String, List<StorefrontSection>> sectionsByStore = new ConcurrentHashMap<>();
    private final Map<String, List<StorefrontRevision>> revisionsByStore = new ConcurrentHashMap<>();

    @Autowired
    public StorefrontService(
            @Autowired(required = false) NamedParameterJdbcTemplate jdbcTemplate,
            StoreRepository storeRepository,
            DomainVerificationService domainVerificationService,
            AuditService auditService,
            @Autowired(required = false) RedisTemplate<String, Object> redisTemplate
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.storeRepository = storeRepository;
        this.domainVerificationService = domainVerificationService;
        this.auditService = auditService;
        this.redisTemplate = redisTemplate;

        initDefaultStorefront();
    }

    private void initDefaultStorefront() {
        String storeId = "store_varanasi_silk";
        StorefrontConfiguration config = new StorefrontConfiguration(
                "cfg_varanasi_01",
                storeId,
                "Varanasi Heritage Silks"
        );
        config.setTagline("Pure Mulberry Handloom Silks Woven on Centuries-Old Pits");
        config.setDescription("Authentic Varanasi silk sarees, dupattas, and artisanal brocades woven directly by master generational weavers.");
        config.setLogoUrl("/images/stores/varanasi.jpg");
        config.setContactEmail("contact@varanasiheritage.in");
        config.setContactPhone("+91 98765 43211");
        config.setPrimaryColor("#2D5A43");
        config.setSecondaryColor("#4A7C59");
        config.setAccentColor("#D97706");
        config.setTypography("Outfit");
        config.setButtonStyle("rounded");
        config.setCardStyle("surface");
        config.setBorderRadius("lg");
        config.setSeoTitle("Varanasi Heritage Silks | Authentic Handloom Mulberry Silk");
        config.setSeoDescription("Shop handwoven pure Banarasi silk sarees and traditional weaves crafted by generational artisan families.");
        config.setSeoKeywords("Banarasi silk, Mulberry silk, handloom saree, Varanasi weavers, authentic craft");

        List<Map<String, Object>> nav = new ArrayList<>();
        nav.add(Map.of("label", "Home", "targetType", "HOME", "url", "/", "position", 0, "enabled", true));
        nav.add(Map.of("label", "Sarees & Weaves", "targetType", "COLLECTION", "targetId", "col_silk_sarees", "url", "/collections/silk-sarees", "position", 1, "enabled", true));
        nav.add(Map.of("label", "Brocades", "targetType", "CATEGORY", "targetId", "cat_brocades", "url", "/shop?cat=brocades", "position", 2, "enabled", true));
        nav.add(Map.of("label", "Our Heritage Story", "targetType", "STORY", "url", "/#story", "position", 3, "enabled", true));
        config.setNavigationItems(nav);
        configs.put(storeId, config);

        List<StorefrontSection> secList = new ArrayList<>();
        secList.add(new StorefrontSection("sec_hero_01", storeId, SectionType.HERO, "Generational Mulberry Silk, Direct from Varanasi Looms", 0));
        secList.add(new StorefrontSection("sec_feat_01", storeId, SectionType.FEATURED_PRODUCTS, "Curated Artisan Handlooms", 1));
        secList.add(new StorefrontSection("sec_story_01", storeId, SectionType.BRAND_STORY, "Four Generations of Heritage Silk Artistry", 2));
        secList.add(new StorefrontSection("sec_col_01", storeId, SectionType.COLLECTIONS, "Explore Authentic Collections", 3));
        secList.add(new StorefrontSection("sec_news_01", storeId, SectionType.NEWSLETTER, "Subscribe to Artisan Guild Dispatches", 4));
        sectionsByStore.put(storeId, secList);

        // Initial published revision
        StorefrontRevision rev = new StorefrontRevision("rev_varanasi_v1", storeId, 1, RevisionStatus.PUBLISHED);
        rev.setPublishedAt(Instant.now());
        List<StorefrontRevision> revList = new ArrayList<>();
        revList.add(rev);
        revisionsByStore.put(storeId, revList);
    }

    public StorefrontConfigurationDto getConfiguration(String storeId) {
        StorefrontConfiguration config = configs.computeIfAbsent(storeId, id -> {
            Store store = storeRepository.findById(id).orElse(null);
            String name = store != null ? store.getName() : "Artisan Store";
            return new StorefrontConfiguration("cfg_" + UUID.randomUUID().toString().substring(0, 8), id, name);
        });
        return toDto(config);
    }

    @Transactional
    public StorefrontConfigurationDto updateConfiguration(String storeId, StorefrontConfigurationDto dto) {
        // Validate branding values server-side to prevent arbitrary CSS / injection
        validateBranding(dto);

        StorefrontConfiguration config = configs.computeIfAbsent(storeId, id -> new StorefrontConfiguration(
                "cfg_" + UUID.randomUUID().toString().substring(0, 8), id, dto.storeName()
        ));

        config.setStoreName(sanitize(dto.storeName()));
        config.setTagline(sanitize(dto.tagline()));
        config.setDescription(sanitize(dto.description()));
        config.setLogoUrl(dto.logoUrl());
        config.setFaviconUrl(dto.faviconUrl());
        config.setContactEmail(dto.contactEmail());
        config.setContactPhone(dto.contactPhone());
        if (dto.socialLinks() != null) config.setSocialLinks(dto.socialLinks());

        config.setPrimaryColor(dto.primaryColor());
        config.setSecondaryColor(dto.secondaryColor());
        config.setAccentColor(dto.accentColor());
        config.setTypography(dto.typography());
        config.setButtonStyle(dto.buttonStyle());
        config.setCardStyle(dto.cardStyle());
        config.setBorderRadius(dto.borderRadius());

        config.setSeoTitle(sanitize(dto.seoTitle()));
        config.setSeoDescription(sanitize(dto.seoDescription()));
        config.setSeoKeywords(sanitize(dto.seoKeywords()));
        config.setOgTitle(sanitize(dto.ogTitle()));
        config.setOgDescription(sanitize(dto.ogDescription()));
        config.setOgImageUrl(dto.ogImageUrl());

        if (dto.navigationItems() != null) {
            config.setNavigationItems(dto.navigationItems());
        }
        config.setUpdatedAt(Instant.now());

        auditService.record("STOREFRONT_UPDATED", storeId, "STOREFRONT_CONFIG", config.getId(), Map.of("storeName", config.getStoreName()));
        return toDto(config);
    }

    public List<StorefrontSectionDto> getSections(String storeId, boolean includeDisabled) {
        List<StorefrontSection> list = sectionsByStore.getOrDefault(storeId, Collections.emptyList());
        return list.stream()
                .filter(s -> includeDisabled || s.isEnabled())
                .sorted(Comparator.comparingInt(StorefrontSection::getPosition))
                .map(this::toSectionDto)
                .toList();
    }

    @Transactional
    public StorefrontSectionDto addSection(String storeId, StorefrontSectionDto dto) {
        List<StorefrontSection> list = sectionsByStore.computeIfAbsent(storeId, k -> new ArrayList<>());
        int nextPos = list.stream().mapToInt(StorefrontSection::getPosition).max().orElse(-1) + 1;

        String id = "sec_" + UUID.randomUUID().toString().substring(0, 8);
        StorefrontSection sec = new StorefrontSection(id, storeId, dto.sectionType(), sanitize(dto.title()), nextPos);
        sec.setSubtitle(sanitize(dto.subtitle()));
        if (dto.contentConfig() != null) {
            sec.setContentConfig(dto.contentConfig());
        }
        sec.setEnabled(dto.enabled());
        list.add(sec);

        auditService.record("STOREFRONT_SECTION_CREATED", storeId, "STOREFRONT_SECTION", id, Map.of("type", sec.getSectionType().name()));
        return toSectionDto(sec);
    }

    @Transactional
    public StorefrontSectionDto updateSection(String storeId, String sectionId, StorefrontSectionDto dto) {
        List<StorefrontSection> list = sectionsByStore.getOrDefault(storeId, Collections.emptyList());
        StorefrontSection sec = list.stream().filter(s -> s.getId().equals(sectionId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Section not found: " + sectionId));

        sec.setTitle(sanitize(dto.title()));
        sec.setSubtitle(sanitize(dto.subtitle()));
        if (dto.contentConfig() != null) sec.setContentConfig(dto.contentConfig());
        sec.setEnabled(dto.enabled());
        sec.setUpdatedAt(Instant.now());

        auditService.record("STOREFRONT_SECTION_UPDATED", storeId, "STOREFRONT_SECTION", sectionId, Map.of("title", sec.getTitle()));
        return toSectionDto(sec);
    }

    @Transactional
    public void deleteSection(String storeId, String sectionId) {
        List<StorefrontSection> list = sectionsByStore.getOrDefault(storeId, Collections.emptyList());
        boolean removed = list.removeIf(s -> s.getId().equals(sectionId));
        if (!removed) {
            throw new ResourceNotFoundException("Section not found: " + sectionId);
        }

        // Re-index positions
        for (int i = 0; i < list.size(); i++) {
            list.get(i).setPosition(i);
        }

        auditService.record("STOREFRONT_SECTION_DELETED", storeId, "STOREFRONT_SECTION", sectionId, Map.of());
    }

    @Transactional
    public List<StorefrontSectionDto> reorderSections(String storeId, List<String> orderedSectionIds) {
        List<StorefrontSection> list = sectionsByStore.getOrDefault(storeId, Collections.emptyList());
        Map<String, StorefrontSection> byId = list.stream().collect(Collectors.toMap(StorefrontSection::getId, s -> s));

        List<StorefrontSection> reordered = new ArrayList<>();
        int pos = 0;
        for (String id : orderedSectionIds) {
            StorefrontSection s = byId.get(id);
            if (s != null) {
                s.setPosition(pos++);
                reordered.add(s);
            }
        }

        sectionsByStore.put(storeId, reordered);
        auditService.record("STOREFRONT_SECTIONS_REORDERED", storeId, "STOREFRONT_SECTION", storeId, Map.of("count", reordered.size()));
        return reordered.stream().sorted(Comparator.comparingInt(StorefrontSection::getPosition)).map(this::toSectionDto).toList();
    }

    public PublicStorefrontData getDraftPreview(String storeId) {
        Store store = storeRepository.findById(storeId).orElse(null);
        StorefrontConfigurationDto cfg = getConfiguration(storeId);
        List<StorefrontSectionDto> sections = getSections(storeId, false);

        String slug = store != null ? store.getSlug() : "artisan-preview";
        return new PublicStorefrontData(
                storeId,
                slug,
                cfg.storeName(),
                store != null ? store.getCraftCategory() : "Artisanal Heritage",
                store != null ? store.getStory() : "",
                cfg,
                sections,
                cfg.navigationItems(),
                "https://bhagya.in/store/" + slug,
                true,
                cfg.publishedVersion()
        );
    }

    @Transactional
    public StorefrontPublishResponse publishStorefront(String storeId, String userId) {
        StorefrontConfiguration config = configs.get(storeId);
        if (config == null) {
            throw new ResourceNotFoundException("Storefront configuration not found for store: " + storeId);
        }

        int newVersion = config.getPublishedVersion() + 1;
        config.setPublishedVersion(newVersion);
        config.setUpdatedAt(Instant.now());

        // Archive previous published revision
        List<StorefrontRevision> revList = revisionsByStore.computeIfAbsent(storeId, k -> new ArrayList<>());
        for (StorefrontRevision r : revList) {
            if (r.getStatus() == RevisionStatus.PUBLISHED) {
                r.setStatus(RevisionStatus.ARCHIVED);
            }
        }

        String revId = "rev_" + UUID.randomUUID().toString().substring(0, 8);
        StorefrontRevision newRev = new StorefrontRevision(revId, storeId, newVersion, RevisionStatus.PUBLISHED);
        newRev.setCreatedBy(userId);
        newRev.setPublishedAt(Instant.now());

        Map<String, Object> snapshot = new HashMap<>();
        snapshot.put("configuration", toDto(config));
        snapshot.put("sections", getSections(storeId, false));
        newRev.setConfiguration(snapshot);
        revList.add(newRev);

        // Invalidate specific store cache key
        if (redisTemplate != null) {
            try {
                redisTemplate.delete("storefront:" + storeId + ":" + (newVersion - 1));
                redisTemplate.delete("storefront:" + storeId + ":latest");
            } catch (Exception e) {
                log.warn("Redis storefront cache eviction warning: {}", e.getMessage());
            }
        }

        auditService.record("STOREFRONT_PUBLISHED", storeId, "STOREFRONT_REVISION", revId, Map.of("version", newVersion));

        return new StorefrontPublishResponse(
                storeId,
                newVersion,
                revId,
                Instant.now(),
                "Storefront published successfully to live version " + newVersion + "."
        );
    }

    public PublicStorefrontData getPublishedStorefront(String storeSlugOrId, String host) {
        Store store = null;
        if (host != null && !host.isEmpty()) {
            Optional<StoreDomain> activeDomain = domainVerificationService.resolveActiveDomain(host);
            if (activeDomain.isPresent()) {
                store = storeRepository.findById(activeDomain.get().getStoreId()).orElse(null);
            }
        }

        if (store == null && storeSlugOrId != null) {
            store = storeRepository.findBySlug(storeSlugOrId)
                    .or(() -> storeRepository.findById(storeSlugOrId))
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found: " + storeSlugOrId));
        }

        if (store == null) {
            throw new ResourceNotFoundException("Storefront could not be resolved.");
        }

        String storeId = store.getId();
        StorefrontConfigurationDto cfg = getConfiguration(storeId);
        List<StorefrontSectionDto> sections = getSections(storeId, false);

        // Determine canonical URL: check if store has a primary custom domain
        String canonical = "https://bhagya.in/store/" + store.getSlug();
        List<StoreDomainDto> domains = domainVerificationService.getDomainsForStore(storeId);
        for (StoreDomainDto d : domains) {
            if (d.isPrimary() && d.status() == DomainStatus.ACTIVE) {
                canonical = "https://" + d.domain();
                break;
            }
        }

        return new PublicStorefrontData(
                store.getId(),
                store.getSlug(),
                cfg.storeName(),
                store.getCraftCategory(),
                store.getStory(),
                cfg,
                sections,
                cfg.navigationItems(),
                canonical,
                false,
                cfg.publishedVersion()
        );
    }

    private void validateBranding(StorefrontConfigurationDto dto) {
        if (dto.primaryColor() != null && !HEX_COLOR_PATTERN.matcher(dto.primaryColor()).matches()) {
            throw new ValidationException(Map.of("primaryColor", "Primary color must be a valid hex color code (e.g. #2D5A43)"));
        }
        if (dto.secondaryColor() != null && !HEX_COLOR_PATTERN.matcher(dto.secondaryColor()).matches()) {
            throw new ValidationException(Map.of("secondaryColor", "Secondary color must be a valid hex color code"));
        }
        if (dto.accentColor() != null && !HEX_COLOR_PATTERN.matcher(dto.accentColor()).matches()) {
            throw new ValidationException(Map.of("accentColor", "Accent color must be a valid hex color code"));
        }
        if (dto.typography() != null && !ALLOWED_TYPOGRAPHY.contains(dto.typography())) {
            throw new ValidationException(Map.of("typography", "Unsupported typography. Choose from: " + ALLOWED_TYPOGRAPHY));
        }
        if (dto.buttonStyle() != null && !ALLOWED_BUTTON_STYLES.contains(dto.buttonStyle())) {
            throw new ValidationException(Map.of("buttonStyle", "Unsupported button style. Choose from: " + ALLOWED_BUTTON_STYLES));
        }
        if (dto.cardStyle() != null && !ALLOWED_CARD_STYLES.contains(dto.cardStyle())) {
            throw new ValidationException(Map.of("cardStyle", "Unsupported card style. Choose from: " + ALLOWED_CARD_STYLES));
        }
        if (dto.borderRadius() != null && !ALLOWED_BORDER_RADIUS.contains(dto.borderRadius())) {
            throw new ValidationException(Map.of("borderRadius", "Unsupported border radius. Choose from: " + ALLOWED_BORDER_RADIUS));
        }
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.replace("<", "&lt;").replace(">", "&gt;").trim();
    }

    private StorefrontConfigurationDto toDto(StorefrontConfiguration c) {
        return new StorefrontConfigurationDto(
                c.getId(),
                c.getStoreId(),
                c.getStoreName(),
                c.getTagline(),
                c.getDescription(),
                c.getLogoUrl(),
                c.getFaviconUrl(),
                c.getContactEmail(),
                c.getContactPhone(),
                c.getSocialLinks(),
                c.getPrimaryColor(),
                c.getSecondaryColor(),
                c.getAccentColor(),
                c.getTypography(),
                c.getButtonStyle(),
                c.getCardStyle(),
                c.getBorderRadius(),
                c.getSeoTitle(),
                c.getSeoDescription(),
                c.getSeoKeywords(),
                c.getOgTitle(),
                c.getOgDescription(),
                c.getOgImageUrl(),
                c.getNavigationItems(),
                c.getPublishedVersion()
        );
    }

    private StorefrontSectionDto toSectionDto(StorefrontSection s) {
        return new StorefrontSectionDto(
                s.getId(),
                s.getStoreId(),
                s.getSectionType(),
                s.getTitle(),
                s.getSubtitle(),
                s.getContentConfig(),
                s.getPosition(),
                s.isEnabled()
        );
    }
}
