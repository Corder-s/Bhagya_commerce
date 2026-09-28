package com.bhagya.commerce.ai.dto;

import java.util.Map;

public record AIToolCallDto(
    String id,
    String name,
    String category,
    String status,
    Map<String, Object> input,
    Map<String, Object> output,
    Long durationMs
) {}
