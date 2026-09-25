package com.bhagya.commerce.analytics.dto;

import java.util.List;

public record FunnelSummaryResponse(
    List<FunnelStepResponse> steps,
    double overallConversionRate
) {}
