package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;

public record AdminStorePerformanceResponse(
    String storeId,
    String storeName,
    long totalOrders,
    BigDecimal gmv,
    long totalProducts,
    String status
) {}
