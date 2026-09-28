package com.bhagya.commerce.storefront.dto;

import java.util.List;

public record SectionReorderRequest(
    List<String> orderedSectionIds
) {}
