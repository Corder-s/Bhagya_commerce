package com.bhagya.commerce.analytics.domain;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class AnalyticsEvent {
    private String id;
    private AnalyticsEventType eventType;
    private String userId;
    private String customerId;
    private String organizationId;
    private String storeId;
    private String sessionId;
    private String entityType;
    private String entityId;
    private Map<String, Object> properties = new HashMap<>();
    private Instant occurredAt;
    private AnalyticsSource source;

    public AnalyticsEvent() {
        this.occurredAt = Instant.now();
        this.source = AnalyticsSource.WEB;
    }

    public AnalyticsEvent(
        String id,
        AnalyticsEventType eventType,
        String userId,
        String customerId,
        String organizationId,
        String storeId,
        String sessionId,
        String entityType,
        String entityId,
        Map<String, Object> properties,
        Instant occurredAt,
        AnalyticsSource source
    ) {
        this.id = id;
        this.eventType = eventType;
        this.userId = userId;
        this.customerId = customerId;
        this.organizationId = organizationId;
        this.storeId = storeId;
        this.sessionId = sessionId;
        this.entityType = entityType;
        this.entityId = entityId;
        this.properties = properties != null ? new HashMap<>(properties) : new HashMap<>();
        this.occurredAt = occurredAt != null ? occurredAt : Instant.now();
        this.source = source != null ? source : AnalyticsSource.WEB;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public AnalyticsEventType getEventType() { return eventType; }
    public void setEventType(AnalyticsEventType eventType) { this.eventType = eventType; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> properties) {
        this.properties = properties != null ? new HashMap<>(properties) : new HashMap<>();
    }

    public Instant getOccurredAt() { return occurredAt; }
    public void setOccurredAt(Instant occurredAt) { this.occurredAt = occurredAt; }

    public AnalyticsSource getSource() { return source; }
    public void setSource(AnalyticsSource source) { this.source = source; }
}
