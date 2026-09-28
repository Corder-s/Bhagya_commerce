package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.domain.IntelligenceInsight;
import com.bhagya.commerce.analytics.service.CommerceInsightService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetCommerceInsightsTool implements AITool {

    private final CommerceInsightService insightService;

    public GetCommerceInsightsTool(CommerceInsightService insightService) {
        this.insightService = insightService;
    }

    @Override
    public String name() {
        return "getCommerceInsights";
    }

    @Override
    public String description() {
        return "Retrieve structured decision-support merchant insights answering WHAT HAPPENED, WHY DID IT HAPPEN, and WHAT COULD BE CONSIDERED.";
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

        try {
            List<IntelligenceInsight> insights = insightService.getTopInsights(storeId);
            return AIToolResult.success(Map.of(
                "storeId", storeId,
                "insightsCount", insights.size(),
                "insights", insights.stream().map(i -> Map.of(
                    "id", i.getId(),
                    "insightType", i.getInsightType() != null ? i.getInsightType() : "GENERAL",
                    "severity", i.getSeverity() != null ? i.getSeverity() : "INFO",
                    "whatHappened", i.getTitle() + " - " + (i.getSummary() != null ? i.getSummary() : ""),
                    "whyItHappened", i.getEvidence() != null ? i.getEvidence() : "",
                    "whatRequiresAttention", i.getMetricName() != null ? i.getMetricName() : "",
                    "whatCouldBeConsidered", i.getSuggestedAction() != null ? i.getSuggestedAction() : ""
                )).toList()
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to retrieve commerce insights: " + e.getMessage());
        }
    }
}
