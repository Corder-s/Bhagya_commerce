package com.bhagya.commerce.analytics.dto;

import com.bhagya.commerce.analytics.domain.IntelligenceAlert;
import com.bhagya.commerce.analytics.domain.IntelligenceInsight;
import java.util.List;

public record CommerceOverviewResponse(
    String storeId,
    String storeName,
    String period,
    String dateRangeLabel,
    List<CanonicalMetricResult> kpiMetrics,
    List<IntelligenceAlert> activeAlerts,
    List<IntelligenceInsight> topInsights,
    List<OpportunitySignalResponse> opportunitySignals,
    ForecastResponse primaryRevenueForecast,
    SalesSummaryResponse salesSummary,
    OrderSummaryResponse orderSummary,
    CustomerSummaryResponse customerSummary,
    List<ProductPerformanceResponse> topProducts,
    SalesTrendResponse salesTrend,
    String dataFreshnessLabel
) {}
