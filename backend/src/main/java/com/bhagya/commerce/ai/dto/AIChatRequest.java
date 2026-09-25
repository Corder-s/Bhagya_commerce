package com.bhagya.commerce.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record AIChatRequest(
    String conversationId,
    @NotBlank(message = "Message cannot be empty")
    String message,
    String contextMode, // CUSTOMER, MERCHANT, DISCOVERY
    Map<String, Object> metadata
) {}
