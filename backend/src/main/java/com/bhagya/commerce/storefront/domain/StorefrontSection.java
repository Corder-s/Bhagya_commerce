package com.bhagya.commerce.storefront.domain;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class StorefrontSection {

    private String id;
    private String storeId;
    private SectionType sectionType;
    private String title;
    private String subtitle;
    private Map<String, Object> contentConfig = new HashMap<>();
    private int position = 0;
    private boolean enabled = true;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public StorefrontSection() {}

    public StorefrontSection(String id, String storeId, SectionType sectionType, String title, int position) {
        this.id = id;
        this.storeId = storeId;
        this.sectionType = sectionType;
        this.title = title;
        this.position = position;
        this.enabled = true;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public SectionType getSectionType() { return sectionType; }
    public void setSectionType(SectionType sectionType) { this.sectionType = sectionType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public Map<String, Object> getContentConfig() { return contentConfig; }
    public void setContentConfig(Map<String, Object> contentConfig) { this.contentConfig = contentConfig; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
