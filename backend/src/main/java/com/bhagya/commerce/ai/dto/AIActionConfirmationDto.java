package com.bhagya.commerce.ai.dto;

import java.time.Instant;
import java.util.Map;

public record AIActionConfirmationDto(
    String id,
    String actionType,
    String status,
    String summary,
    Map<String, Object> actionPayload,
    Instant expiresAt
) {}
