package com.bhagya.commerce.storefront.dto;

import com.bhagya.commerce.storefront.domain.SectionType;
import java.util.Map;

public record StorefrontSectionDto(
    String id,
    String storeId,
    SectionType sectionType,
    String title,
    String subtitle,
    Map<String, Object> contentConfig,
    int position,
    boolean enabled
) {}
