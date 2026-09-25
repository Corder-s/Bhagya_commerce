package com.bhagya.commerce.marketing.domain;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class CustomerSegment {
    private String id;
    private String storeId;
    private String name;
    private String description;
    private Map<String, Object> criteria = new HashMap<>();
    private int estimatedCount;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public CustomerSegment() {
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public CustomerSegment(
        String id,
        String storeId,
        String name,
        String description,
        Map<String, Object> criteria,
        int estimatedCount
    ) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.description = description;
        this.criteria = criteria != null ? new HashMap<>(criteria) : new HashMap<>();
        this.estimatedCount = estimatedCount;
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Map<String, Object> getCriteria() { return criteria; }
    public void setCriteria(Map<String, Object> criteria) {
        this.criteria = criteria != null ? new HashMap<>(criteria) : new HashMap<>();
    }

    public int getEstimatedCount() { return estimatedCount; }
    public void setEstimatedCount(int estimatedCount) { this.estimatedCount = estimatedCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
