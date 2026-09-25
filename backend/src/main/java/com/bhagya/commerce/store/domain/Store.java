package com.bhagya.commerce.store.domain;

import java.time.Instant;

public class Store {
    private String id;
    private String organizationId;
    private String name;
    private String slug;
    private String craftCategory;
    private String story;
    private String logoUrl;
    private String bannerUrl;
    private StoreStatus status;
    private String contactEmail;
    private String contactPhone;
    private Instant createdAt;
    private Instant updatedAt;

    public Store() {}

    public Store(String id, String organizationId, String name, String slug, String craftCategory) {
        this.id = id;
        this.organizationId = organizationId;
        this.name = name;
        this.slug = slug;
        this.craftCategory = craftCategory;
        this.status = StoreStatus.ACTIVE;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCraftCategory() { return craftCategory; }
    public void setCraftCategory(String craftCategory) { this.craftCategory = craftCategory; }

    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public StoreStatus getStatus() { return status; }
    public void setStatus(StoreStatus status) { this.status = status; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
