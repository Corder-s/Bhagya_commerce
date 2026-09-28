package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.LoyaltyAccount;
import java.time.Instant;

public record LoyaltyAccountDto(
    String id,
    String storeId,
    String customerId,
    String status,
    int availablePoints,
    int lifetimeEarnedPoints,
    int lifetimeRedeemedPoints,
    int lifetimeExpiredPoints,
    String tier,
    String tierDisplayName,
    double tierMultiplier,
    int pointsToNextTier,
    Instant updatedAt
) {
    public static LoyaltyAccountDto fromDomain(LoyaltyAccount a) {
        int nextTierThreshold = 500;
        if (a.getLifetimeEarnedPoints() >= 1500) nextTierThreshold = 4000;
        else if (a.getLifetimeEarnedPoints() >= 500) nextTierThreshold = 1500;

        int toNext = Math.max(0, nextTierThreshold - a.getLifetimeEarnedPoints());

        return new LoyaltyAccountDto(
            a.getId(),
            a.getStoreId(),
            a.getCustomerId(),
            a.getStatus(),
            a.getAvailablePoints(),
            a.getLifetimeEarnedPoints(),
            a.getLifetimeRedeemedPoints(),
            a.getLifetimeExpiredPoints(),
            a.getTier().name(),
            a.getTier().getDisplayName(),
            a.getTier().getEarningMultiplier(),
            toNext,
            a.getUpdatedAt()
        );
    }
}
