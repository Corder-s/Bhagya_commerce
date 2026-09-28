package com.bhagya.commerce.review.dto;

import java.util.List;

public record CreateReviewRequest(
    String productId,
    String orderId,
    String orderItemId,
    int rating,
    String title,
    String comment,
    List<String> mediaUrls
) {}
