package com.bhagya.commerce.ai.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record AIChatResponse(
    String id,
    String conversationId,
    String reply,
    String intent,
    List<Map<String, Object>> suggestedActions,
    List<Map<String, Object>> referencedItems,
    Instant timestamp
) {}
