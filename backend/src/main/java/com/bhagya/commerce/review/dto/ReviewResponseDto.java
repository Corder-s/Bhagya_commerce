package com.bhagya.commerce.review.dto;

import java.time.Instant;

public record ReviewResponseDto(
    String id,
    String storeId,
    String authorName,
    String body,
    Instant createdAt
) {}
