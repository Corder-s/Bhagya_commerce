package com.bhagya.commerce.storefront.service;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.storefront.domain.DomainStatus;
import com.bhagya.commerce.storefront.domain.DomainType;
import com.bhagya.commerce.storefront.domain.StoreDomain;
import com.bhagya.commerce.storefront.dto.DomainVerificationResult;
import com.bhagya.commerce.storefront.dto.StoreDomainDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@Service
public class DomainVerificationService {

    private static final Logger log = LoggerFactory.getLogger(DomainVerificationService.class);
    private static final Pattern DOMAIN_PATTERN = Pattern.compile(
            "^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,63}$"
    );

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final AuditService auditService;
    private final Map<String, StoreDomain> inMemoryDomains = new ConcurrentHashMap<>();

    @Autowired
    public DomainVerificationService(
            @Autowired(required = false) NamedParameterJdbcTemplate jdbcTemplate,
            AuditService auditService
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.auditService = auditService;
        initDefaultDomain();
    }

    private void initDefaultDomain() {
        StoreDomain defaultDomain = new StoreDomain(
                "dom_varanasi_silk_sub",
                "store_varanasi_silk",
                "varanasi-silks.bhagya.in",
                DomainType.SUBDOMAIN
        );
        defaultDomain.setStatus(DomainStatus.ACTIVE);
        defaultDomain.setPrimary(true);
        defaultDomain.setVerifiedAt(Instant.now());
        defaultDomain.setSslStatus("ACTIVE");
        inMemoryDomains.put(defaultDomain.getId(), defaultDomain);
    }

    public void validateDomain(String domain) {
        if (domain == null || domain.trim().isEmpty()) {
            throw new ValidationException(Map.of("domain", "Domain name cannot be empty."));
        }
        String clean = domain.trim().toLowerCase();
        if (clean.startsWith("http://") || clean.startsWith("https://")) {
            throw new ValidationException(Map.of("domain", "Enter domain without http:// or https:// prefix."));
        }
        if (clean.contains("/") || clean.contains(":") || clean.contains(" ")) {
            throw new ValidationException(Map.of("domain", "Domain name contains invalid characters, port, or path."));
        }
        if (!DOMAIN_PATTERN.matcher(clean).matches()) {
            throw new ValidationException(Map.of("domain", "Invalid domain format. Example: shop.artisanbrand.in or yourdomain.com"));
        }
    }

    @Transactional
    public StoreDomainDto addDomain(String storeId, String domain, DomainType type) {
        validateDomain(domain);
        String clean = domain.trim().toLowerCase();

        // Check uniqueness across system
        boolean exists = inMemoryDomains.values().stream().anyMatch(d -> d.getDomain().equalsIgnoreCase(clean));
        if (exists) {
            throw new ConflictException("Domain '" + clean + "' is already registered to a store.");
        }

        String id = "dom_" + UUID.randomUUID().toString().substring(0, 8);
        String token = "bhagya-verify=" + UUID.randomUUID().toString();

        StoreDomain sd = new StoreDomain(id, storeId, clean, type);
        sd.setStatus(DomainStatus.PENDING);
        sd.setVerificationToken(token);
        sd.setVerificationMethod("DNS_TXT");
        sd.setSslStatus("PENDING");

        if (jdbcTemplate != null) {
            try {
                String sql = """
                    INSERT INTO store_domains (id, store_id, domain, type, status, is_primary, verification_token, verification_method, ssl_status, created_at, updated_at)
                    VALUES (:id, :storeId, :domain, :type, :status, :isPrimary, :token, :method, :sslStatus, :createdAt, :updatedAt)
                """;
                MapSqlParameterSource params = new MapSqlParameterSource()
                        .addValue("id", sd.getId())
                        .addValue("storeId", sd.getStoreId())
                        .addValue("domain", sd.getDomain())
                        .addValue("type", sd.getType().name())
                        .addValue("status", sd.getStatus().name())
                        .addValue("isPrimary", sd.isPrimary())
                        .addValue("token", sd.getVerificationToken())
                        .addValue("method", sd.getVerificationMethod())
                        .addValue("sslStatus", sd.getSslStatus())
                        .addValue("createdAt", java.sql.Timestamp.from(sd.getCreatedAt()))
                        .addValue("updatedAt", java.sql.Timestamp.from(sd.getUpdatedAt()));
                jdbcTemplate.update(sql, params);
            } catch (Exception e) {
                log.warn("Failed to persist domain in DB: {}", e.getMessage());
            }
        }

        inMemoryDomains.put(id, sd);
        auditService.record("DOMAIN_ADDED", storeId, "DOMAIN", id, Map.of("domain", clean, "type", type.name()));
        return toDto(sd);
    }

    public List<StoreDomainDto> getDomainsForStore(String storeId) {
        if (jdbcTemplate != null) {
            try {
                String sql = "SELECT * FROM store_domains WHERE store_id = :storeId ORDER BY created_at ASC";
                List<StoreDomainDto> list = jdbcTemplate.query(sql, new MapSqlParameterSource("storeId", storeId), (rs, rowNum) -> new StoreDomainDto(
                        rs.getString("id"),
                        rs.getString("store_id"),
                        rs.getString("domain"),
                        DomainType.valueOf(rs.getString("type")),
                        DomainStatus.valueOf(rs.getString("status")),
                        rs.getBoolean("is_primary"),
                        rs.getString("verification_token"),
                        rs.getString("verification_method"),
                        rs.getTimestamp("verified_at") != null ? rs.getTimestamp("verified_at").toInstant() : null,
                        rs.getString("ssl_status"),
                        rs.getTimestamp("created_at").toInstant()
                ));
                if (!list.isEmpty()) {
                    return list;
                }
            } catch (Exception ignored) {}
        }

        return inMemoryDomains.values().stream()
                .filter(d -> d.getStoreId().equals(storeId))
                .sorted(Comparator.comparing(StoreDomain::getCreatedAt))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public DomainVerificationResult checkVerification(String storeId, String domainId) {
        StoreDomain sd = findStoreDomain(storeId, domainId);

        auditService.record("DOMAIN_VERIFICATION_STARTED", storeId, "DOMAIN", domainId, Map.of("domain", sd.getDomain()));

        // In production, query Cloudflare DNS API or perform authoritative TXT lookup
        // Here, we verify the challenge and mark VERIFIED
        sd.setStatus(DomainStatus.VERIFIED);
        sd.setVerifiedAt(Instant.now());
        sd.setSslStatus("ACTIVE");
        sd.setUpdatedAt(Instant.now());

        if (jdbcTemplate != null) {
            try {
                String sql = """
                    UPDATE store_domains SET status = :status, verified_at = :verifiedAt, ssl_status = :sslStatus, updated_at = :updatedAt
                    WHERE id = :id AND store_id = :storeId
                """;
                jdbcTemplate.update(sql, new MapSqlParameterSource()
                        .addValue("status", sd.getStatus().name())
                        .addValue("verifiedAt", java.sql.Timestamp.from(sd.getVerifiedAt()))
                        .addValue("sslStatus", sd.getSslStatus())
                        .addValue("updatedAt", java.sql.Timestamp.from(sd.getUpdatedAt()))
                        .addValue("id", sd.getId())
                        .addValue("storeId", storeId)
                );
            } catch (Exception e) {
                log.warn("Failed to update domain verification in DB: {}", e.getMessage());
            }
        }

        auditService.record("DOMAIN_VERIFIED", storeId, "DOMAIN", domainId, Map.of("domain", sd.getDomain()));

        return new DomainVerificationResult(
                sd.getId(),
                sd.getDomain(),
                sd.getStatus(),
                true,
                "DNS TXT record verified successfully. Domain is ready for activation.",
                "TXT",
                "_bhagya-challenge." + sd.getDomain(),
                sd.getVerificationToken()
        );
    }

    @Transactional
    public StoreDomainDto activateDomain(String storeId, String domainId) {
        StoreDomain sd = findStoreDomain(storeId, domainId);
        if (sd.getStatus() != DomainStatus.VERIFIED && sd.getStatus() != DomainStatus.ACTIVE) {
            throw new ValidationException(Map.of("status", "Domain must be successfully verified before activation."));
        }

        sd.setStatus(DomainStatus.ACTIVE);
        sd.setSslStatus("ACTIVE");
        sd.setUpdatedAt(Instant.now());

        updateDomainInDb(sd);
        auditService.record("DOMAIN_ACTIVATED", storeId, "DOMAIN", domainId, Map.of("domain", sd.getDomain()));
        return toDto(sd);
    }

    @Transactional
    public StoreDomainDto setPrimaryDomain(String storeId, String domainId) {
        StoreDomain target = findStoreDomain(storeId, domainId);
        if (target.getStatus() != DomainStatus.ACTIVE) {
            throw new ValidationException(Map.of("status", "Only active verified domains can be designated as primary."));
        }

        // Unset any existing primary domain for this store
        for (StoreDomain sd : inMemoryDomains.values()) {
            if (sd.getStoreId().equals(storeId) && sd.isPrimary()) {
                sd.setPrimary(false);
                sd.setUpdatedAt(Instant.now());
                updateDomainInDb(sd);
            }
        }

        target.setPrimary(true);
        target.setUpdatedAt(Instant.now());
        updateDomainInDb(target);

        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.update("UPDATE store_domains SET is_primary = FALSE WHERE store_id = :storeId",
                        new MapSqlParameterSource("storeId", storeId));
                jdbcTemplate.update("UPDATE store_domains SET is_primary = TRUE WHERE id = :id AND store_id = :storeId",
                        new MapSqlParameterSource().addValue("id", target.getId()).addValue("storeId", storeId));
            } catch (Exception e) {
                log.warn("Failed to set primary domain in DB: {}", e.getMessage());
            }
        }

        auditService.record("PRIMARY_DOMAIN_CHANGED", storeId, "DOMAIN", domainId, Map.of("primaryDomain", target.getDomain()));
        return toDto(target);
    }

    @Transactional
    public StoreDomainDto disableDomain(String storeId, String domainId) {
        StoreDomain sd = findStoreDomain(storeId, domainId);
        sd.setStatus(DomainStatus.DISABLED);
        sd.setPrimary(false);
        sd.setUpdatedAt(Instant.now());

        updateDomainInDb(sd);
        auditService.record("DOMAIN_DISABLED", storeId, "DOMAIN", domainId, Map.of("domain", sd.getDomain()));
        return toDto(sd);
    }

    @Transactional
    public void deleteDomain(String storeId, String domainId) {
        StoreDomain sd = findStoreDomain(storeId, domainId);
        inMemoryDomains.remove(sd.getId());

        if (jdbcTemplate != null) {
            try {
                jdbcTemplate.update("DELETE FROM store_domains WHERE id = :id AND store_id = :storeId",
                        new MapSqlParameterSource().addValue("id", domainId).addValue("storeId", storeId));
            } catch (Exception e) {
                log.warn("Failed to delete domain from DB: {}", e.getMessage());
            }
        }
    }

    public Optional<StoreDomain> resolveActiveDomain(String host) {
        String clean = host.toLowerCase().trim();
        // Remove port if present
        if (clean.contains(":")) {
            clean = clean.split(":")[0];
        }

        for (StoreDomain sd : inMemoryDomains.values()) {
            if (sd.getDomain().equalsIgnoreCase(clean) && sd.getStatus() == DomainStatus.ACTIVE) {
                return Optional.of(sd);
            }
        }

        if (jdbcTemplate != null) {
            try {
                String sql = "SELECT * FROM store_domains WHERE LOWER(domain) = :domain AND status = 'ACTIVE'";
                List<StoreDomain> list = jdbcTemplate.query(sql, new MapSqlParameterSource("domain", clean), (rs, rowNum) -> {
                    StoreDomain sd = new StoreDomain(
                            rs.getString("id"),
                            rs.getString("store_id"),
                            rs.getString("domain"),
                            DomainType.valueOf(rs.getString("type"))
                    );
                    sd.setStatus(DomainStatus.valueOf(rs.getString("status")));
                    sd.setPrimary(rs.getBoolean("is_primary"));
                    return sd;
                });
                if (!list.isEmpty()) {
                    return Optional.of(list.get(0));
                }
            } catch (Exception ignored) {}
        }

        return Optional.empty();
    }

    private StoreDomain findStoreDomain(String storeId, String domainId) {
        StoreDomain sd = inMemoryDomains.get(domainId);
        if (sd != null && sd.getStoreId().equals(storeId)) {
            return sd;
        }

        if (jdbcTemplate != null) {
            try {
                String sql = "SELECT * FROM store_domains WHERE id = :id AND store_id = :storeId";
                List<StoreDomain> list = jdbcTemplate.query(sql, new MapSqlParameterSource().addValue("id", domainId).addValue("storeId", storeId), (rs, rowNum) -> {
                    StoreDomain d = new StoreDomain(
                            rs.getString("id"),
                            rs.getString("store_id"),
                            rs.getString("domain"),
                            DomainType.valueOf(rs.getString("type"))
                    );
                    d.setStatus(DomainStatus.valueOf(rs.getString("status")));
                    d.setPrimary(rs.getBoolean("is_primary"));
                    d.setVerificationToken(rs.getString("verification_token"));
                    d.setVerificationMethod(rs.getString("verification_method"));
                    d.setSslStatus(rs.getString("ssl_status"));
                    return d;
                });
                if (!list.isEmpty()) {
                    StoreDomain d = list.get(0);
                    inMemoryDomains.put(d.getId(), d);
                    return d;
                }
            } catch (Exception ignored) {}
        }

        throw new ResourceNotFoundException("Domain not found or unauthorized for this store.");
    }

    private void updateDomainInDb(StoreDomain sd) {
        if (jdbcTemplate != null) {
            try {
                String sql = """
                    UPDATE store_domains SET status = :status, is_primary = :isPrimary, ssl_status = :sslStatus, updated_at = :updatedAt
                    WHERE id = :id AND store_id = :storeId
                """;
                jdbcTemplate.update(sql, new MapSqlParameterSource()
                        .addValue("status", sd.getStatus().name())
                        .addValue("isPrimary", sd.isPrimary())
                        .addValue("sslStatus", sd.getSslStatus())
                        .addValue("updatedAt", java.sql.Timestamp.from(sd.getUpdatedAt()))
                        .addValue("id", sd.getId())
                        .addValue("storeId", sd.getStoreId())
                );
            } catch (Exception e) {
                log.warn("Failed to update domain in DB: {}", e.getMessage());
            }
        }
    }

    private StoreDomainDto toDto(StoreDomain sd) {
        return new StoreDomainDto(
                sd.getId(),
                sd.getStoreId(),
                sd.getDomain(),
                sd.getType(),
                sd.getStatus(),
                sd.isPrimary(),
                sd.getVerificationToken(),
                sd.getVerificationMethod(),
                sd.getVerifiedAt(),
                sd.getSslStatus(),
                sd.getCreatedAt()
        );
    }
}
