package com.bhagya.commerce.loyalty.repository;

import com.bhagya.commerce.loyalty.domain.RedemptionStatus;
import com.bhagya.commerce.loyalty.domain.RewardRedemption;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
public class RewardRedemptionRepository {

    private final Map<String, RewardRedemption> redemptionStorage = new ConcurrentHashMap<>();
    private final Map<String, String> codeIndex = new ConcurrentHashMap<>();

    public RewardRedemptionRepository() {
        seedInitialRedemptions();
    }

    private void seedInitialRedemptions() {
        Instant now = Instant.now();
        RewardRedemption red1 = new RewardRedemption(
            "rdm_01",
            "store_main",
            "usr_dev_customer_01",
            "rew_fixed_100",
            500,
            RedemptionStatus.ISSUED,
            "BG-REW-8421",
            null,
            null,
            now.plusSeconds(86400 * 30),
            null,
            now.minusSeconds(86400 * 2)
        );
        save(red1);
    }

    public RewardRedemption save(RewardRedemption redemption) {
        if (redemption.getId() == null) {
            redemption.setId("rdm_" + UUID.randomUUID().toString().substring(0, 10));
        }
        redemptionStorage.put(redemption.getId(), redemption);
        if (redemption.getReferenceCode() != null) {
            codeIndex.put(redemption.getReferenceCode().toUpperCase(), redemption.getId());
        }
        return redemption;
    }

    public Optional<RewardRedemption> findById(String id) {
        return Optional.ofNullable(redemptionStorage.get(id));
    }

    public Optional<RewardRedemption> findByCode(String code) {
        String id = codeIndex.get(code.toUpperCase());
        if (id == null) return Optional.empty();
        return Optional.ofNullable(redemptionStorage.get(id));
    }

    public List<RewardRedemption> findByCustomerAndStore(String customerId, String storeId) {
        return redemptionStorage.values().stream()
            .filter(r -> r.getCustomerId().equals(customerId) && r.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(RewardRedemption::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public List<RewardRedemption> findByStoreId(String storeId) {
        return redemptionStorage.values().stream()
            .filter(r -> r.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(RewardRedemption::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public long countActiveByCustomerAndReward(String customerId, String rewardId) {
        return redemptionStorage.values().stream()
            .filter(r -> r.getCustomerId().equals(customerId) &&
                         r.getRewardId().equals(rewardId) &&
                         r.getStatus() == RedemptionStatus.ISSUED &&
                         !r.isExpired())
            .count();
    }
}
