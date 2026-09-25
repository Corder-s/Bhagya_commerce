package com.bhagya.commerce.audit.service;

import java.time.Instant;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    public void record(String action, String actorId, String resourceType, String resourceId, Map<String, Object> details) {
        log.info("[AUDIT] Action={} Actor={} ResourceType={} ResourceId={} Details={} Timestamp={}",
            action, actorId, resourceType, resourceId, details, Instant.now());
    }
}
