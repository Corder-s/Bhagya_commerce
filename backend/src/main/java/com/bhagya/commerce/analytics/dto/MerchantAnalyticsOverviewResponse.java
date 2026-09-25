package com.bhagya.commerce.analytics.dto;

import java.util.List;

public record MerchantAnalyticsOverviewResponse(
    String storeId,
    String storeName,
    String period,
    SalesSummaryResponse sales,
    OrderSummaryResponse orders,
    CustomerSummaryResponse customers,
    FunnelSummaryResponse funnel,
    List<ProductPerformanceResponse> topProducts,
    SalesTrendResponse salesTrend,
    TrafficAttributionResponse trafficSources
) {}
