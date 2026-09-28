package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.domain.ComparisonPeriod;
import com.bhagya.commerce.analytics.dto.CanonicalMetricResult;
import com.bhagya.commerce.analytics.service.CommerceAlertService;
import com.bhagya.commerce.analytics.service.CommerceMetricService;
import com.bhagya.commerce.analytics.service.CommerceOpportunityService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetCommerceOverviewTool implements AITool {

    private final CommerceMetricService metricService;
    private final CommerceAlertService alertService;
    private final CommerceOpportunityService opportunityService;

    public GetCommerceOverviewTool(
        CommerceMetricService metricService,
        CommerceAlertService alertService,
        CommerceOpportunityService opportunityService
    ) {
        this.metricService = metricService;
        this.alertService = alertService;
        this.opportunityService = opportunityService;
    }

    @Override
    public String name() {
        return "getCommerceOverview";
    }

    @Override
    public String description() {
        return "Retrieve the comprehensive commerce intelligence overview including canonical KPIs, active merchant alerts, and opportunity signals.";
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
            List<CanonicalMetricResult> kpis = metricService.calculateCanonicalMetrics(storeId, period, null, null);
            var alerts = alertService.getActiveAlerts(storeId);
            var opps = opportunityService.detectOpportunities(storeId);

            return AIToolResult.success(Map.of(
                "storeId", storeId,
                "period", period.name(),
                "periodLabel", period.getLabel(),
                "canonicalKpis", kpis,
                "activeAlertsCount", alerts.size(),
                "activeAlerts", alerts.stream().map(a -> Map.of(
                    "id", a.getId(),
                    "type", a.getAlertType(),
                    "severity", a.getSeverity(),
                    "title", a.getTitle(),
                    "message", a.getMessage()
                )).toList(),
                "opportunityCount", opps.size(),
                "opportunities", opps
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to retrieve commerce overview: " + e.getMessage());
        }
    }
}
