package com.bhagya.commerce.storefront.domain;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class StorefrontRevision {

    private String id;
    private String storeId;
    private int version;
    private RevisionStatus status = RevisionStatus.DRAFT;
    private Map<String, Object> configuration = new HashMap<>();
    private String createdBy;
    private Instant createdAt = Instant.now();
    private Instant publishedAt;

    public StorefrontRevision() {}

    public StorefrontRevision(String id, String storeId, int version, RevisionStatus status) {
        this.id = id;
        this.storeId = storeId;
        this.version = version;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public RevisionStatus getStatus() { return status; }
    public void setStatus(RevisionStatus status) { this.status = status; }

    public Map<String, Object> getConfiguration() { return configuration; }
    public void setConfiguration(Map<String, Object> configuration) { this.configuration = configuration; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(Instant publishedAt) { this.publishedAt = publishedAt; }
}
