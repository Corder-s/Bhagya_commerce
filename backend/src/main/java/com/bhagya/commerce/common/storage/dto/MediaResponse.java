package com.bhagya.commerce.common.storage.dto;

import java.time.Instant;

public record MediaResponse(
    String id,
    String entityType,
    String entityId,
    String objectKey,
    String publicUrl,
    String mimeType,
    long sizeBytes,
    String altText,
    int sortOrder,
    boolean isPrimary,
    Instant createdAt
) {}
