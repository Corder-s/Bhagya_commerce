package com.bhagya.commerce.analytics.dto;

import java.util.List;
import java.util.Map;

public record RetentionSummaryResponse(
    double repeatPurchaseRate,
    long totalUniqueCustomers,
    long repeatCustomers,
    List<Map<String, Object>> cohorts
) {}
