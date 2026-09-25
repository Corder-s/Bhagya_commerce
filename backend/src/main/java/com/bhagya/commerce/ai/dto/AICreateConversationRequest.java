package com.bhagya.commerce.ai.dto;

public record AICreateConversationRequest(
    String title,
    String mode // CUSTOMER, MERCHANT, DISCOVERY
) {}
