package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.LoyaltyReward;
import java.math.BigDecimal;
import java.time.Instant;

public record LoyaltyRewardDto(
    String id,
    String storeId,
    String name,
    String description,
    String type,
    int pointsCost,
    BigDecimal value,
    BigDecimal minimumOrderValue,
    BigDecimal maximumDiscount,
    Integer usageLimit,
    int perCustomerLimit,
    Instant startsAt,
    Instant endsAt,
    boolean enabled,
    boolean isActive
) {
    public static LoyaltyRewardDto fromDomain(LoyaltyReward r) {
        return new LoyaltyRewardDto(
            r.getId(),
            r.getStoreId(),
            r.getName(),
            r.getDescription(),
            r.getType().name(),
            r.getPointsCost(),
            r.getValue(),
            r.getMinimumOrderValue(),
            r.getMaximumDiscount(),
            r.getUsageLimit(),
            r.getPerCustomerLimit(),
            r.getStartsAt(),
            r.getEndsAt(),
            r.isEnabled(),
            r.isCurrentlyActive()
        );
    }
}
