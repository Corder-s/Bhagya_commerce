package com.bhagya.commerce.storefront.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StorefrontConfiguration {

    private String id;
    private String storeId;
    private String storeName;
    private String tagline;
    private String description;
    private String logoUrl;
    private String faviconUrl;
    private String contactEmail;
    private String contactPhone;
    private Map<String, String> socialLinks = new HashMap<>();

    // Branding Design System
    private String primaryColor = "#2D5A43";
    private String secondaryColor = "#4A7C59";
    private String accentColor = "#D97706";
    private String typography = "Outfit";
    private String buttonStyle = "rounded"; // rounded, pill, square
    private String cardStyle = "surface";   // surface, raised, flat, bordered
    private String borderRadius = "lg";     // none, sm, md, lg, full

    // SEO & Open Graph
    private String seoTitle;
    private String seoDescription;
    private String seoKeywords;
    private String ogTitle;
    private String ogDescription;
    private String ogImageUrl;

    // Navigation Structure
    private List<Map<String, Object>> navigationItems = new ArrayList<>();

    private int publishedVersion = 1;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public StorefrontConfiguration() {}

    public StorefrontConfiguration(String id, String storeId, String storeName) {
        this.id = id;
        this.storeId = storeId;
        this.storeName = storeName;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getFaviconUrl() { return faviconUrl; }
    public void setFaviconUrl(String faviconUrl) { this.faviconUrl = faviconUrl; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public Map<String, String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Map<String, String> socialLinks) { this.socialLinks = socialLinks; }

    public String getPrimaryColor() { return primaryColor; }
    public void setPrimaryColor(String primaryColor) { this.primaryColor = primaryColor; }

    public String getSecondaryColor() { return secondaryColor; }
    public void setSecondaryColor(String secondaryColor) { this.secondaryColor = secondaryColor; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public String getTypography() { return typography; }
    public void setTypography(String typography) { this.typography = typography; }

    public String getButtonStyle() { return buttonStyle; }
    public void setButtonStyle(String buttonStyle) { this.buttonStyle = buttonStyle; }

    public String getCardStyle() { return cardStyle; }
    public void setCardStyle(String cardStyle) { this.cardStyle = cardStyle; }

    public String getBorderRadius() { return borderRadius; }
    public void setBorderRadius(String borderRadius) { this.borderRadius = borderRadius; }

    public String getSeoTitle() { return seoTitle; }
    public void setSeoTitle(String seoTitle) { this.seoTitle = seoTitle; }

    public String getSeoDescription() { return seoDescription; }
    public void setSeoDescription(String seoDescription) { this.seoDescription = seoDescription; }

    public String getSeoKeywords() { return seoKeywords; }
    public void setSeoKeywords(String seoKeywords) { this.seoKeywords = seoKeywords; }

    public String getOgTitle() { return ogTitle; }
    public void setOgTitle(String ogTitle) { this.ogTitle = ogTitle; }

    public String getOgDescription() { return ogDescription; }
    public void setOgDescription(String ogDescription) { this.ogDescription = ogDescription; }

    public String getOgImageUrl() { return ogImageUrl; }
    public void setOgImageUrl(String ogImageUrl) { this.ogImageUrl = ogImageUrl; }

    public List<Map<String, Object>> getNavigationItems() { return navigationItems; }
    public void setNavigationItems(List<Map<String, Object>> navigationItems) { this.navigationItems = navigationItems; }

    public int getPublishedVersion() { return publishedVersion; }
    public void setPublishedVersion(int publishedVersion) { this.publishedVersion = publishedVersion; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
