package com.bhagya.commerce.storefront.dto;

import java.time.Instant;

public record StorefrontPublishResponse(
    String storeId,
    int publishedVersion,
    String revisionId,
    Instant publishedAt,
    String message
) {}
