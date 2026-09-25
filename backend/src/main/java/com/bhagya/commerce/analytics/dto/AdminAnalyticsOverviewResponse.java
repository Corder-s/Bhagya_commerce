package com.bhagya.commerce.analytics.dto;

import java.math.BigDecimal;
import java.util.List;

public record AdminAnalyticsOverviewResponse(
    BigDecimal platformGmv,
    BigDecimal platformNetSales,
    long totalStores,
    long activeStores,
    long totalOrders,
    long totalCustomers,
    long totalProducts,
    AdminPaymentMetricsResponse payments,
    List<AdminStorePerformanceResponse> topStores,
    SalesTrendResponse salesTrend
) {}
