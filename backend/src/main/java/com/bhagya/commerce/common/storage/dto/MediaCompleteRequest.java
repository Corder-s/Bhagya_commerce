package com.bhagya.commerce.common.storage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record MediaCompleteRequest(
    @NotBlank(message = "Object key is required")
    String objectKey,

    @NotBlank(message = "Entity type is required")
    String entityType,

    @NotBlank(message = "Entity ID is required")
    String entityId,

    @Positive(message = "Size is required")
    long sizeBytes,

    @NotBlank(message = "MIME type is required")
    String mimeType,

    String altText,
    int sortOrder,
    boolean isPrimary
) {}
