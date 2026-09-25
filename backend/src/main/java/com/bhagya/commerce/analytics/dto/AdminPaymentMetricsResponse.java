package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;
import java.util.Map;

public record AdminPaymentMetricsResponse(
    BigDecimal totalVolumeProcessed,
    BigDecimal totalRefunded,
    long successfulPayments,
    long failedPayments,
    Map<String, Long> methodDistribution
) {}
