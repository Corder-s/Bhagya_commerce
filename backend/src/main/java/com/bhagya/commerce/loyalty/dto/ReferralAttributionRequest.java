package com.bhagya.commerce.loyalty.dto;

public record ReferralAttributionRequest(
    String referralCode,
    String storeId
) {}
