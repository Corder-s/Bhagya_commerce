package com.bhagya.commerce.review.dto;

public record ReviewUploadUrlResponse(
    String uploadUrl,
    String finalUrl,
    String thumbnailUrl,
    String objectKey,
    String storageProvider
) {}
