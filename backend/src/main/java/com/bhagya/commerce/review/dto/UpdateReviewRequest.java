package com.bhagya.commerce.review.dto;

import java.util.List;

public record UpdateReviewRequest(
    int rating,
    String title,
    String comment,
    List<String> mediaUrls
) {}
