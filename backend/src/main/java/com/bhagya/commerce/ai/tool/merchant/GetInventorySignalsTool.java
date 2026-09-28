package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.analytics.service.InventoryIntelligenceService;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetInventorySignalsTool implements AITool {

    private final InventoryIntelligenceService inventoryIntelligenceService;

    public GetInventorySignalsTool(InventoryIntelligenceService inventoryIntelligenceService) {
        this.inventoryIntelligenceService = inventoryIntelligenceService;
    }

    @Override
    public String name() {
        return "getInventorySignals";
    }

    @Override
    public String description() {
        return "Retrieve authoritative inventory intelligence including stock velocity, days of stock remaining, and stockout risk products.";
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
        return "INVENTORY_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_varanasi_silk";

        try {
            Map<String, Object> signals = inventoryIntelligenceService.getInventorySignals(storeId);
            return AIToolResult.success(signals);
        } catch (Exception e) {
            return AIToolResult.failure("Failed to retrieve inventory signals: " + e.getMessage());
        }
    }
}
