package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.RewardRedemption;
import java.time.Instant;

public record RewardRedemptionDto(
    String id,
    String storeId,
    String customerId,
    String rewardId,
    String rewardName,
    int pointsSpent,
    String status,
    String referenceCode,
    String couponId,
    String orderId,
    Instant expiresAt,
    Instant redeemedAt,
    Instant createdAt
) {
    public static RewardRedemptionDto fromDomain(RewardRedemption r, String rewardName) {
        return new RewardRedemptionDto(
            r.getId(),
            r.getStoreId(),
            r.getCustomerId(),
            r.getRewardId(),
            rewardName != null ? rewardName : "Loyalty Reward",
            r.getPointsSpent(),
            r.getStatus().name(),
            r.getReferenceCode(),
            r.getCouponId(),
            r.getOrderId(),
            r.getExpiresAt(),
            r.getRedeemedAt(),
            r.getCreatedAt()
        );
    }
}
