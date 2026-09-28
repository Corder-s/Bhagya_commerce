package com.bhagya.commerce.storefront;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.storefront.domain.DomainStatus;
import com.bhagya.commerce.storefront.domain.DomainType;
import com.bhagya.commerce.storefront.domain.SectionType;
import com.bhagya.commerce.storefront.dto.*;
import com.bhagya.commerce.storefront.service.DomainVerificationService;
import com.bhagya.commerce.storefront.service.StorefrontService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class StorefrontServiceTest {

    private StorefrontService storefrontService;
    private DomainVerificationService domainService;
    private StoreRepository storeRepository;
    private AuditService auditService;

    @BeforeEach
    void setUp() {
        storeRepository = new StoreRepository();
        auditService = Mockito.mock(AuditService.class);
        NamedParameterJdbcTemplate jdbcTemplate = Mockito.mock(NamedParameterJdbcTemplate.class);
        RedisTemplate<String, Object> redisTemplate = Mockito.mock(RedisTemplate.class);

        domainService = new DomainVerificationService(jdbcTemplate, auditService);
        storefrontService = new StorefrontService(
                jdbcTemplate,
                storeRepository,
                domainService,
                auditService,
                redisTemplate
        );
    }

    @Test
    void testGetDefaultConfiguration() {
        StorefrontConfigurationDto cfg = storefrontService.getConfiguration("store_varanasi_silk");
        assertNotNull(cfg);
        assertEquals("Varanasi Heritage Silks", cfg.storeName());
        assertEquals("#2D5A43", cfg.primaryColor());
        assertEquals("Outfit", cfg.typography());
        assertFalse(cfg.navigationItems().isEmpty());
    }

    @Test
    void testBrandingValidation() {
        StorefrontConfigurationDto invalidColor = new StorefrontConfigurationDto(
                "cfg_1", "store_varanasi_silk", "Valid Store", "Tagline", "Desc",
                null, null, "test@store.in", "+919876543210", Map.of(),
                "invalid-hex", "#4A7C59", "#D97706",
                "Outfit", "rounded", "surface", "lg",
                "SEO Title", "SEO Desc", "keywords",
                "OG Title", "OG Desc", null, List.of(), 1
        );

        assertThrows(ValidationException.class, () ->
                storefrontService.updateConfiguration("store_varanasi_silk", invalidColor)
        );
    }

    @Test
    void testSectionLifecycleAndReordering() {
        String storeId = "store_varanasi_silk";

        // Add section
        StorefrontSectionDto newSec = new StorefrontSectionDto(
                null, storeId, SectionType.CTA, "Limited Festive Brocade Drop",
                "Reserve rare pit-loom yardage", Map.of("buttonText", "Explore Drop"), 0, true
        );
        StorefrontSectionDto created = storefrontService.addSection(storeId, newSec);
        assertNotNull(created.id());
        assertEquals(SectionType.CTA, created.sectionType());

        // Update section
        StorefrontSectionDto updated = storefrontService.updateSection(storeId, created.id(), new StorefrontSectionDto(
                created.id(), storeId, SectionType.CTA, "Updated Festive Title", "Subtitle", Map.of(), created.position(), true
        ));
        assertEquals("Updated Festive Title", updated.title());

        // Reorder
        List<StorefrontSectionDto> allSections = storefrontService.getSections(storeId, true);
        List<String> reversedIds = allSections.stream().map(StorefrontSectionDto::id).toList().reversed();
        List<StorefrontSectionDto> reordered = storefrontService.reorderSections(storeId, reversedIds);
        assertEquals(reversedIds.get(0), reordered.get(0).id());

        // Delete section
        storefrontService.deleteSection(storeId, created.id());
        List<StorefrontSectionDto> remaining = storefrontService.getSections(storeId, true);
        assertFalse(remaining.stream().anyMatch(s -> s.id().equals(created.id())));
    }

    @Test
    void testDraftPreviewAndPublish() {
        String storeId = "store_varanasi_silk";

        // Preview should have isPreview = true
        PublicStorefrontData preview = storefrontService.getDraftPreview(storeId);
        assertNotNull(preview);
        assertTrue(preview.isPreview());
        assertEquals("varanasi-heritage-silks", preview.storeSlug());

        // Publish should bump version and create revision
        StorefrontPublishResponse pub = storefrontService.publishStorefront(storeId, "usr_artisan_owner");
        assertNotNull(pub);
        assertEquals(2, pub.publishedVersion());

        // Live storefront resolution should reflect published version with isPreview = false
        PublicStorefrontData live = storefrontService.getPublishedStorefront("varanasi-heritage-silks", null);
        assertNotNull(live);
        assertFalse(live.isPreview());
        assertEquals(2, live.version());
    }

    @Test
    void testDomainLifecycleAndPrimaryEnforcement() {
        String storeId = "store_varanasi_silk";

        // Invalid domain format rejection
        assertThrows(ValidationException.class, () ->
                domainService.validateDomain("https://invalid-with-protocol.com")
        );
        assertThrows(ValidationException.class, () ->
                domainService.validateDomain("bad:port:domain.com")
        );

        // Add domain
        StoreDomainDto domain = domainService.addDomain(storeId, "silks.varanasiheritage.in", DomainType.CUSTOM_DOMAIN);
        assertNotNull(domain.id());
        assertEquals(DomainStatus.PENDING, domain.status());
        assertNotNull(domain.verificationToken());

        // Duplicate domain conflict
        assertThrows(ConflictException.class, () ->
                domainService.addDomain("other_store", "silks.varanasiheritage.in", DomainType.CUSTOM_DOMAIN)
        );

        // Verify domain
        DomainVerificationResult ver = domainService.checkVerification(storeId, domain.id());
        assertTrue(ver.verified());
        assertEquals(DomainStatus.VERIFIED, ver.status());

        // Activate domain
        StoreDomainDto active = domainService.activateDomain(storeId, domain.id());
        assertEquals(DomainStatus.ACTIVE, active.status());

        // Set primary domain
        StoreDomainDto primary = domainService.setPrimaryDomain(storeId, domain.id());
        assertTrue(primary.isPrimary());

        // Published storefront should use custom primary domain for canonical URL
        PublicStorefrontData live = storefrontService.getPublishedStorefront("varanasi-heritage-silks", "silks.varanasiheritage.in");
        assertEquals("https://silks.varanasiheritage.in", live.canonicalUrl());
    }
}
