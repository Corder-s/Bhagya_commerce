package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.domain.ComparisonPeriod;
import com.bhagya.commerce.analytics.dto.CanonicalMetricResult;
import com.bhagya.commerce.analytics.service.CommerceMetricService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetRevenueComparisonTool implements AITool {

    private final CommerceMetricService metricService;

    public GetRevenueComparisonTool(CommerceMetricService metricService) {
        this.metricService = metricService;
    }

    @Override
    public String name() {
        return "getRevenueComparison";
    }

    @Override
    public String description() {
        return "Compare canonical revenue metrics (gross revenue, net revenue, discounts, refunds, AOV) across comparison periods with safe delta calculations.";
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
        String storeId = context.storeId() != null ? context.storeId() : "store_varanasi_silk";
        String periodStr = (String) parameters.getOrDefault("period", "DAYS_30");

        try {
            ComparisonPeriod period = ComparisonPeriod.fromString(periodStr);
            List<CanonicalMetricResult> metrics = metricService.calculateCanonicalMetrics(storeId, period, null, null);

            var revenueMetrics = metrics.stream()
                .filter(m -> m.metricKey().contains("REVENUE") || m.metricKey().contains("SALES") || m.metricKey().contains("AOV") || m.metricKey().contains("REFUND"))
                .toList();

            return AIToolResult.success(Map.of(
                "storeId", storeId,
                "period", period.name(),
                "periodLabel", period.getLabel(),
                "metrics", revenueMetrics
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to compute revenue comparison: " + e.getMessage());
        }
    }
}
