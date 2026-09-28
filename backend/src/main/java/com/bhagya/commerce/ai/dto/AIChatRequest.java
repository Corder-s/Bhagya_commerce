package com.bhagya.commerce.ai.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record AIChatRequest(
    String conversationId,
    @NotBlank(message = "Message cannot be empty")
    String message,
    String contextMode, // CUSTOMER, MERCHANT
    String storeId,
    Map<String, Object> metadata
) {
    public AIChatRequest(String conversationId, String message, String contextMode, Map<String, Object> metadata) {
        this(conversationId, message, contextMode, null, metadata);
    }
}
