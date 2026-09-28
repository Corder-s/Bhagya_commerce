package com.bhagya.commerce.audit.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Authoritative Security & Compliance Audit Log Service.
 *
 * Enforces automatic credential & secret redaction on all recorded audit entries.
 */
@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private static final Set<String> SENSITIVE_KEY_SUBSTRINGS = Set.of(
        "password",
        "token",
        "secret",
        "key",
        "authorization",
        "creditcard",
        "cvv",
        "pan",
        "aadhaar",
        "cookie",
        "jwt",
        "apikey",
        "signature"
    );

    public void record(String action, String actorId, String resourceType, String resourceId, Map<String, Object> details) {
        Map<String, Object> sanitizedDetails = sanitizeDetails(details);
        log.info("[AUDIT] Action={} Actor={} ResourceType={} ResourceId={} Details={} Timestamp={}",
            action,
            actorId != null ? actorId : "SYSTEM",
            resourceType,
            resourceId,
            sanitizedDetails,
            Instant.now());
    }

    private Map<String, Object> sanitizeDetails(Map<String, Object> details) {
        if (details == null || details.isEmpty()) {
            return Map.of();
        }

        Map<String, Object> clean = new HashMap<>();
        for (Map.Entry<String, Object> entry : details.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (isSensitiveKey(key)) {
                clean.put(key, "[REDACTED]");
            } else if (value instanceof String strVal && isLikelySecret(strVal)) {
                clean.put(key, "[REDACTED]");
            } else {
                clean.put(key, value);
            }
        }
        return clean;
    }

    private boolean isSensitiveKey(String key) {
        if (key == null) return false;
        String lower = key.toLowerCase(Locale.ROOT);
        return SENSITIVE_KEY_SUBSTRINGS.stream().anyMatch(lower::contains);
    }

    private boolean isLikelySecret(String value) {
        if (value == null) return false;
        // Check for Bearer tokens or JWT structure
        return value.startsWith("Bearer ") || value.startsWith("eyJh") || value.startsWith("inv_tok_") || value.startsWith("bhagya_sec_");
    }
}
