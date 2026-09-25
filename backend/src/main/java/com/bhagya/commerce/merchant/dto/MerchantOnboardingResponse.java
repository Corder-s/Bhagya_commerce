package com.bhagya.commerce.merchant.dto;

import java.time.Instant;

public record MerchantOnboardingResponse(
    String onboardingId,
    String userId,
    String businessName,
    String status, // IN_PROGRESS, SUBMITTED, APPROVED, REJECTED
    int completedStep,
    Instant updatedAt
) {}
