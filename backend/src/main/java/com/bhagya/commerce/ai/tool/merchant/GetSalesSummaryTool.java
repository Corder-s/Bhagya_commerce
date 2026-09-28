package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.dto.SalesSummaryResponse;
import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetSalesSummaryTool implements AITool {

    private final AnalyticsAggregationService analyticsService;

    public GetSalesSummaryTool(AnalyticsAggregationService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Override
    public String name() {
        return "getSalesSummary";
    }

    @Override
    public String description() {
        return "Retrieve verified merchant gross sales, net sales, order volume, and average order value for the store.";
    }

    @Override
    public AIToolCategory category() {
        return AIToolCategory.READ_ONLY;
    }

    @Override
    public boolean requiresConfirmation() {
        return false;
    }

    @Override
    public String requiredPermission() {
        return "ANALYTICS_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_main";
        String period = (String) parameters.getOrDefault("period", "30d");

        try {
            SalesSummaryResponse summary = analyticsService.calculateSalesSummary(storeId, period, null, null);
            return AIToolResult.success(Map.of(
                "storeId", storeId,
                "period", period,
                "grossSales", summary.grossSales().toPlainString(),
                "netSales", summary.netSales().toPlainString(),
                "totalOrders", summary.totalOrders(),
                "averageOrderValue", summary.averageOrderValue().toPlainString(),
                "currency", "INR"
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to calculate sales summary: " + e.getMessage());
        }
    }
}
