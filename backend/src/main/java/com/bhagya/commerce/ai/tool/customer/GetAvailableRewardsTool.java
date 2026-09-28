package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.loyalty.domain.LoyaltyReward;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetAvailableRewardsTool implements AITool {

    private final LoyaltyService loyaltyService;

    public GetAvailableRewardsTool(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @Override
    public String name() {
        return "getAvailableRewards";
    }

    @Override
    public String description() {
        return "List available reward discount vouchers and coupons that patrons can unlock with loyalty points.";
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
        String storeId = context.storeId() != null ? context.storeId() : "store_main";
        try {
            List<com.bhagya.commerce.loyalty.dto.LoyaltyRewardDto> rewards = loyaltyService.getStoreRewards(storeId);
            List<Map<String, Object>> sanitized = rewards.stream()
                .filter(com.bhagya.commerce.loyalty.dto.LoyaltyRewardDto::isActive)
                .map(r -> Map.<String, Object>of(
                    "rewardId", r.id(),
                    "name", r.name(),
                    "description", r.description() != null ? r.description() : "",
                    "pointsCost", r.pointsCost(),
                    "type", r.type(),
                    "discountValue", r.value() != null ? r.value().toPlainString() : "0.00",
                    "minimumOrderValue", r.minimumOrderValue() != null ? r.minimumOrderValue().toPlainString() : "0.00"
                ))
                .toList();

            return AIToolResult.success(Map.of(
                "rewardsCount", sanitized.size(),
                "rewards", sanitized
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Could not list rewards: " + e.getMessage());
        }
    }
}
