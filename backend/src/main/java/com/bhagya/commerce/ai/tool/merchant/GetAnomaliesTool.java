package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.domain.IntelligenceAlert;
import com.bhagya.commerce.analytics.service.AnomalyDetectionService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetAnomaliesTool implements AITool {

    private final AnomalyDetectionService anomalyDetectionService;

    public GetAnomaliesTool(AnomalyDetectionService anomalyDetectionService) {
        this.anomalyDetectionService = anomalyDetectionService;
    }

    @Override
    public String name() {
        return "getAnomalies";
    }

    @Override
    public String description() {
        return "Detect statistical metric anomalies (sales drop/spike, refund spike, cancellation spike) relative to rolling baseline averages.";
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
            List<IntelligenceAlert> anomalies = anomalyDetectionService.detectAnomalies(storeId);
            return AIToolResult.success(Map.of(
                "storeId", storeId,
                "anomaliesCount", anomalies.size(),
                "anomalies", anomalies.stream().map(a -> Map.of(
                    "type", a.getAlertType(),
                    "severity", a.getSeverity(),
                    "title", a.getTitle(),
                    "message", a.getMessage(),
                    "currentValue", a.getCurrentValue() != null ? a.getCurrentValue().toPlainString() : "0",
                    "baselineValue", a.getBaselineValue() != null ? a.getBaselineValue().toPlainString() : "0"
                )).toList()
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to detect anomalies: " + e.getMessage());
        }
    }
}
