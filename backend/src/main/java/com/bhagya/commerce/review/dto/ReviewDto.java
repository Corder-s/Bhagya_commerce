package com.bhagya.commerce.review.dto;

import java.time.Instant;
import java.util.List;

public record ReviewDto(
    String id,
    String productId,
    String authorDisplayName,
    int rating,
    String title,
    String comment,
    boolean verifiedPurchase,
    String status,
    int helpfulCount,
    boolean hasVotedHelpful,
    List<ReviewMediaDto> photos,
    ReviewResponseDto merchantResponse,
    Instant createdAt
) {}
