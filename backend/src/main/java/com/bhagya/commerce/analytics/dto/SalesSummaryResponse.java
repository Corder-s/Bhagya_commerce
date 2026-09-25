package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record SalesSummaryResponse(
    String period,
    String currency,
    BigDecimal grossSales,
    BigDecimal discounts,
    BigDecimal refunds,
    BigDecimal netSales,
    long totalOrders,
    long paidOrders,
    BigDecimal averageOrderValue,
    Instant startTime,
    Instant endTime
) {}
