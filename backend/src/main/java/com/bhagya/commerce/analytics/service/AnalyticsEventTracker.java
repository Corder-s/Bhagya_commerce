package com.bhagya.commerce.analytics.service;

import com.bhagya.commerce.analytics.domain.AnalyticsEvent;
import com.bhagya.commerce.analytics.domain.AnalyticsEventType;
import com.bhagya.commerce.analytics.domain.AnalyticsSource;
import com.bhagya.commerce.analytics.dto.AnalyticsEventIngestRequest;
import com.bhagya.commerce.analytics.repository.AnalyticsEventRepository;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.redis.IdempotencyService;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsEventTracker {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsEventTracker.class);

    private static final Set<String> SENSITIVE_KEYS = Set.of(
        "password", "token", "secret", "cvv", "pin", "auth", "authorization", "upi_pin", "card_number"
    );

    private final AnalyticsEventRepository eventRepository;
    private final IdempotencyService idempotencyService;

    public AnalyticsEventTracker(
        AnalyticsEventRepository eventRepository,
        IdempotencyService idempotencyService
    ) {
        this.eventRepository = eventRepository;
        this.idempotencyService = idempotencyService;
    }

    public AnalyticsEvent track(AnalyticsEvent event) {
        if (event.getEventType() == null) {
            throw new ValidationException("Analytics event type cannot be null.");
        }

        // Deduplication check if event has specific ID
        if (event.getId() != null && !event.getId().isBlank()) {
            if (idempotencyService != null && !idempotencyService.acquireLock("evt_dedup:" + event.getId(), 86400)) {
                log.info("Duplicate analytics event ignored: {}", event.getId());
                return eventRepository.findById(event.getId()).orElse(event);
            }
        }

        // Sanitize properties
        event.setProperties(sanitizeProperties(event.getProperties()));
        if (event.getOccurredAt() == null) {
            event.setOccurredAt(Instant.now());
        }
        if (event.getSource() == null) {
            event.setSource(AnalyticsSource.SYSTEM);
        }

        AnalyticsEvent saved = eventRepository.save(event);
        log.debug("Tracked analytics event: {} for store: {}", event.getEventType(), event.getStoreId());
        return saved;
    }

    public AnalyticsEvent ingestClientEvent(AnalyticsEventIngestRequest request, String authenticatedUserId, String storeId) {
        if (request.eventType() == null) {
            throw new ValidationException("Event type is required.");
        }

        // Validate payload limits
        if (request.properties() != null && request.properties().size() > 50) {
            throw new ValidationException("Event payload exceeds max property limit (50 keys).");
        }

        String eventId = request.eventId();
        if (eventId == null || eventId.isBlank()) {
            eventId = "evt_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 100000);
        }

        AnalyticsEvent event = new AnalyticsEvent(
            eventId,
            request.eventType(),
            authenticatedUserId,
            authenticatedUserId,
            null,
            storeId != null ? storeId : request.storeId(),
            request.sessionId(),
            request.entityType(),
            request.entityId(),
            request.properties(),
            request.occurredAt() != null ? request.occurredAt() : Instant.now(),
            request.source() != null ? request.source() : AnalyticsSource.WEB
        );

        return track(event);
    }

    public void trackBusinessEvent(AnalyticsEventType type, String storeId, String userId, String entityType, String entityId, Map<String, Object> props) {
        AnalyticsEvent event = new AnalyticsEvent(
            "evt_biz_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 1000),
            type,
            userId,
            userId,
            null,
            storeId,
            null,
            entityType,
            entityId,
            props,
            Instant.now(),
            AnalyticsSource.BACKEND
        );
        track(event);
    }

    private Map<String, Object> sanitizeProperties(Map<String, Object> raw) {
        if (raw == null) {
            return new HashMap<>();
        }
        Map<String, Object> clean = new HashMap<>();
        for (Map.Entry<String, Object> entry : raw.entrySet()) {
            String key = entry.getKey();
            if (key == null) continue;
            String lowerKey = key.toLowerCase();
            boolean isSensitive = SENSITIVE_KEYS.stream().anyMatch(lowerKey::contains);
            if (!isSensitive) {
                // Limit string values to 500 chars to avoid memory abuse
                Object val = entry.getValue();
                if (val instanceof String s && s.length() > 500) {
                    clean.put(key, s.substring(0, 500));
                } else {
                    clean.put(key, val);
                }
            }
        }
        return clean;
    }
}
