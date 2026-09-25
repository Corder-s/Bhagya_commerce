package com.bhagya.commerce.common.storage.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UploadUrlRequest(
    @NotBlank(message = "File name is required")
    String filename,

    @NotBlank(message = "Content type is required")
    String contentType,

    @Positive(message = "Size must be greater than 0")
    long sizeBytes,

    @NotBlank(message = "Entity type is required (e.g., PRODUCT, STORE_LOGO, STORE_BANNER)")
    String entityType,

    @NotBlank(message = "Entity ID is required")
    String entityId
) {}
