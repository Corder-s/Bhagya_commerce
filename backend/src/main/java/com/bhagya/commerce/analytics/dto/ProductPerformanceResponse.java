package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;

public record ProductPerformanceResponse(
    String productId,
    String productName,
    String productImageUrl,
    long unitsSold,
    BigDecimal grossRevenue,
    long viewsCount,
    long addToCartCount,
    double conversionRate,
    int currentStock
) {}
