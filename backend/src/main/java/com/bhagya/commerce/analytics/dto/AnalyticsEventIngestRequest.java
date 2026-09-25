package com.bhagya.commerce.analytics.dto;

import com.bhagya.commerce.analytics.domain.AnalyticsEventType;
import com.bhagya.commerce.analytics.domain.AnalyticsSource;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.Map;

public record AnalyticsEventIngestRequest(
    String eventId,
    @NotNull(message = "eventType is required")
    AnalyticsEventType eventType,
    String storeId,
    String sessionId,
    String entityType,
    String entityId,
    Map<String, Object> properties,
    Instant occurredAt,
    AnalyticsSource source
) {}
