package com.bhagya.commerce.marketing.dto;

public record AICopyGenerateResponse(
    String subject,
    String headline,
    String body,
    String callToAction
) {}
