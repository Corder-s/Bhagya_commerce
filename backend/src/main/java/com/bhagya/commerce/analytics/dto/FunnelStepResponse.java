package com.bhagya.commerce.analytics.dto;

public record FunnelStepResponse(
    String stepName,
    long count,
    double conversionRateFromPrevious,
    double dropoffRate
) {}
