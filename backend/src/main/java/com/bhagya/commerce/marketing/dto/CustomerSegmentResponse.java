package com.bhagya.commerce.marketing.dto;

import java.time.Instant;
import java.util.Map;

public record CustomerSegmentResponse(
    String id,
    String storeId,
    String name,
    String description,
    Map<String, Object> criteria,
    int estimatedCount,
    String status,
    Instant createdAt
) {}
