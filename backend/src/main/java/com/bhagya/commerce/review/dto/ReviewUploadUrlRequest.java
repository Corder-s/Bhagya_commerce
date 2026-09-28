package com.bhagya.commerce.review.dto;

public record ReviewUploadUrlRequest(
    String fileName,
    String contentType,
    long sizeBytes
) {}
