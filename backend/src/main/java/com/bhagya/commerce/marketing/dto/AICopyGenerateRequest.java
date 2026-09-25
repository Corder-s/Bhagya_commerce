package com.bhagya.commerce.marketing.dto;

public record AICopyGenerateRequest(
    String purpose,
    String channel,
    String productName,
    String discountDetails,
    String tone
) {}
