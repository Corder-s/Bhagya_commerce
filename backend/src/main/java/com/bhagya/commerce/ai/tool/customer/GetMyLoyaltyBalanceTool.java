package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.loyalty.domain.LoyaltyAccount;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetMyLoyaltyBalanceTool implements AITool {

    private final LoyaltyService loyaltyService;

    public GetMyLoyaltyBalanceTool(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @Override
    public String name() {
        return "getMyLoyaltyBalance";
    }

    @Override
    public String description() {
        return "Get the current patron loyalty points balance, patron tier, and points progress for the customer.";
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
        return null;
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        if (context.userId() == null || context.userId().startsWith("usr_anon")) {
            return AIToolResult.failure("Please log in to your patron account to view your reward points.");
        }

        String storeId = context.storeId() != null ? context.storeId() : "store_main";
        try {
            com.bhagya.commerce.loyalty.dto.LoyaltyAccountDto account = loyaltyService.getCustomerAccount(context.userId(), storeId);
            return AIToolResult.success(Map.of(
                "availablePoints", account.availablePoints(),
                "tier", account.tier(),
                "tierDisplayName", account.tierDisplayName(),
                "multiplier", account.tierMultiplier(),
                "lifetimeEarned", account.lifetimeEarnedPoints(),
                "lifetimeRedeemed", account.lifetimeRedeemedPoints()
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Could not retrieve loyalty points: " + e.getMessage());
        }
    }
}
