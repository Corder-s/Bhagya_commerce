package com.bhagya.commerce.ai.dto;

public record AIToolDefinitionDto(
    String name,
    String description,
    String category,
    boolean requiresConfirmation,
    String requiredPermission
) {}
