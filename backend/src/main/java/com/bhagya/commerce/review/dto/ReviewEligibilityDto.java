package com.bhagya.commerce.review.dto;

public record ReviewEligibilityDto(
    String productId,
    boolean eligible,
    String reason,
    String eligibleOrderId,
    String eligibleOrderItemId,
    String existingReviewId
) {}
