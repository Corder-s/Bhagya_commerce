package com.bhagya.commerce.review.dto;

public record ReviewMediaDto(
    String id,
    String url,
    String thumbnailUrl,
    String mimeType,
    Integer width,
    Integer height
) {}
