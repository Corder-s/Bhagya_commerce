package com.bhagya.commerce.storefront.dto;

import java.util.List;
import java.util.Map;

public record StorefrontConfigurationDto(
    String id,
    String storeId,
    String storeName,
    String tagline,
    String description,
    String logoUrl,
    String faviconUrl,
    String contactEmail,
    String contactPhone,
    Map<String, String> socialLinks,
    String primaryColor,
    String secondaryColor,
    String accentColor,
    String typography,
    String buttonStyle,
    String cardStyle,
    String borderRadius,
    String seoTitle,
    String seoDescription,
    String seoKeywords,
    String ogTitle,
    String ogDescription,
    String ogImageUrl,
    List<Map<String, Object>> navigationItems,
    int publishedVersion
) {}
