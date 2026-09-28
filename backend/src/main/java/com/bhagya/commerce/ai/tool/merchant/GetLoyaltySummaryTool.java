package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.loyalty.dto.LoyaltyOverviewDto;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetLoyaltySummaryTool implements AITool {

    private final LoyaltyService loyaltyService;

    public GetLoyaltySummaryTool(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @Override
    public String name() {
        return "getLoyaltySummary";
    }

    @Override
    public String description() {
        return "Fetch active patron count, lifetime points issued, points redeemed, outstanding points liability, and referral conversions.";
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
        return "LOYALTY_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_main";

        try {
            LoyaltyOverviewDto overview = loyaltyService.getMerchantOverview(storeId);
            double redemptionRate = overview.totalPointsIssued() > 0
                ? Math.round(((double) overview.totalPointsRedeemed() / overview.totalPointsIssued()) * 1000.0) / 10.0
                : 0.0;
            return AIToolResult.success(Map.of(
                "totalMembers", overview.totalMembers(),
                "activeMembersCount", overview.activeMembers(),
                "totalPointsIssued", overview.totalPointsIssued(),
                "totalPointsRedeemed", overview.totalPointsRedeemed(),
                "outstandingLiabilityInr", overview.outstandingValueInr() != null ? overview.outstandingValueInr().toPlainString() : "0.00",
                "redemptionRate", redemptionRate,
                "referralConversions", overview.totalReferralsQualified()
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to fetch loyalty metrics: " + e.getMessage());
        }
    }
}
