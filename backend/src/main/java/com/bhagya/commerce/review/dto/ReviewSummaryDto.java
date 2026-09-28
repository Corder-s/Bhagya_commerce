package com.bhagya.commerce.review.dto;

import java.util.Map;

public record ReviewSummaryDto(
    String productId,
    double averageRating,
    int totalReviews,
    Map<Integer, Integer> ratingDistribution,
    Map<Integer, Integer> ratingPercentages
) {}
