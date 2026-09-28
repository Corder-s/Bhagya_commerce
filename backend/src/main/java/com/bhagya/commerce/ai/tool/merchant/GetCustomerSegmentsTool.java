package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.service.CustomerIntelligenceService;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetCustomerSegmentsTool implements AITool {

    private final CustomerIntelligenceService customerIntelligenceService;

    public GetCustomerSegmentsTool(CustomerIntelligenceService customerIntelligenceService) {
        this.customerIntelligenceService = customerIntelligenceService;
    }

    @Override
    public String name() {
        return "getCustomerSegments";
    }

    @Override
    public String description() {
        return "Retrieve aggregated customer behavioral RFM segments (Champions, Loyal, Promising, At Risk, Dormant) and repeat purchase metrics.";
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
        return "CUSTOMER_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_varanasi_silk";

        try {
            Map<String, Object> segments = customerIntelligenceService.getCustomerSegmentation(storeId);
            return AIToolResult.success(segments);
        } catch (Exception e) {
            return AIToolResult.failure("Failed to retrieve customer segments: " + e.getMessage());
        }
    }
}
