package com.bhagya.commerce.storefront.dto;

import java.util.List;
import java.util.Map;

public record PublicStorefrontData(
    String storeId,
    String storeSlug,
    String storeName,
    String craftCategory,
    String story,
    StorefrontConfigurationDto configuration,
    List<StorefrontSectionDto> sections,
    List<Map<String, Object>> navigationItems,
    String canonicalUrl,
    boolean isPreview,
    int version
) {}
