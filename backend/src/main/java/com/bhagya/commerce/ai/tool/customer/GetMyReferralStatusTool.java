package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.loyalty.domain.CustomerReferral;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetMyReferralStatusTool implements AITool {

    private final LoyaltyService loyaltyService;

    public GetMyReferralStatusTool(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @Override
    public String name() {
        return "getMyReferralStatus";
    }

    @Override
    public String description() {
        return "Get the customer's unique referral code, share URL, and qualified referral reward statistics.";
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
            return AIToolResult.failure("Customer authentication required.");
        }

        String storeId = context.storeId() != null ? context.storeId() : "store_main";
        try {
            com.bhagya.commerce.loyalty.dto.CustomerReferralDto ref = loyaltyService.getOrCreateCustomerReferral(context.userId(), storeId, "https://bhagya.commerce");
            List<com.bhagya.commerce.loyalty.dto.CustomerReferralDto> history = loyaltyService.getCustomerReferralHistory(context.userId(), storeId);
            long qualifiedCount = history.stream().filter(h -> "REWARDED".equalsIgnoreCase(h.status()) || "QUALIFIED".equalsIgnoreCase(h.status())).count();

            return AIToolResult.success(Map.of(
                "referralCode", ref.referralCode(),
                "referralUrl", ref.referralUrl(),
                "totalReferred", history.size(),
                "successfulConversions", qualifiedCount,
                "rewardPerReferral", 500
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Could not load referral status: " + e.getMessage());
        }
    }
}
