package com.bhagya.commerce.ai.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record AIConversationResponse(
    String id,
    String title,
    String mode,
    int messageCount,
    Instant lastMessageAt,
    List<Map<String, Object>> messages
) {}
