package com.bhagya.commerce.common.storage.dto;

import java.time.Instant;

public record UploadUrlResponse(
    String uploadUrl,
    String objectKey,
    String publicUrl,
    Instant expiresAt
) {}
