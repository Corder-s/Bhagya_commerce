package com.bhagya.commerce.loyalty.repository;

import com.bhagya.commerce.loyalty.domain.LoyaltyReward;
import com.bhagya.commerce.loyalty.domain.RewardType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
public class LoyaltyRewardRepository {

    private final Map<String, LoyaltyReward> rewardStorage = new ConcurrentHashMap<>();

    public LoyaltyRewardRepository() {
        seedInitialRewards();
    }

    private void seedInitialRewards() {
        Instant now = Instant.now();
        String storeId = "store_main";

        LoyaltyReward r1 = new LoyaltyReward(
            "rew_fixed_100",
            storeId,
            "₹100 Guild Artisan Voucher",
            "Get flat ₹100 off on any craft or handloom order above ₹500.",
            RewardType.FIXED_AMOUNT_OFF,
            500,
            new BigDecimal("100.00"),
            new BigDecimal("500.00"),
            null,
            null,
            1,
            now.minusSeconds(86400 * 10),
            now.plusSeconds(86400 * 180),
            true,
            now,
            now
        );
        rewardStorage.put(r1.getId(), r1);

        LoyaltyReward r2 = new LoyaltyReward(
            "rew_free_shipping",
            storeId,
            "Free Express Delivery",
            "Complimentary fragile-handling insured courier shipping on any order.",
            RewardType.FREE_SHIPPING,
            300,
            new BigDecimal("150.00"),
            BigDecimal.ZERO,
            null,
            null,
            2,
            now.minusSeconds(86400 * 10),
            now.plusSeconds(86400 * 180),
            true,
            now,
            now
        );
        rewardStorage.put(r2.getId(), r2);

        LoyaltyReward r3 = new LoyaltyReward(
            "rew_percent_15",
            storeId,
            "15% Connoisseur Discount",
            "Enjoy 15% discount across curated handlooms and brass masterworks (up to ₹1,500).",
            RewardType.PERCENTAGE_OFF,
            750,
            new BigDecimal("15.00"),
            new BigDecimal("1500.00"),
            new BigDecimal("1500.00"),
            null,
            1,
            now.minusSeconds(86400 * 10),
            now.plusSeconds(86400 * 180),
            true,
            now,
            now
        );
        rewardStorage.put(r3.getId(), r3);

        LoyaltyReward r4 = new LoyaltyReward(
            "rew_master_500",
            storeId,
            "₹500 Master Craftsman Credit",
            "Exclusive ₹500 credit on heritage silk saris and bell metal sculptures.",
            RewardType.STORE_CREDIT,
            2000,
            new BigDecimal("500.00"),
            new BigDecimal("2500.00"),
            null,
            100,
            1,
            now.minusSeconds(86400 * 10),
            now.plusSeconds(86400 * 180),
            true,
            now,
            now
        );
        rewardStorage.put(r4.getId(), r4);
    }

    public List<LoyaltyReward> findByStoreId(String storeId) {
        return rewardStorage.values().stream()
            .filter(r -> r.getStoreId().equals(storeId))
            .sorted(Comparator.comparingInt(LoyaltyReward::getPointsCost))
            .collect(Collectors.toList());
    }

    public List<LoyaltyReward> findActiveByStoreId(String storeId) {
        return rewardStorage.values().stream()
            .filter(r -> r.getStoreId().equals(storeId) && r.isCurrentlyActive())
            .sorted(Comparator.comparingInt(LoyaltyReward::getPointsCost))
            .collect(Collectors.toList());
    }

    public Optional<LoyaltyReward> findById(String id) {
        return Optional.ofNullable(rewardStorage.get(id));
    }

    public LoyaltyReward save(LoyaltyReward reward) {
        if (reward.getId() == null) {
            reward.setId("rew_" + UUID.randomUUID().toString().substring(0, 10));
        }
        rewardStorage.put(reward.getId(), reward);
        return reward;
    }

    public boolean deleteById(String id) {
        return rewardStorage.remove(id) != null;
    }
}
