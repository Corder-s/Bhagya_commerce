package com.bhagya.commerce.loyalty.repository;

import com.bhagya.commerce.loyalty.domain.LoyaltyAccount;
import com.bhagya.commerce.loyalty.domain.LoyaltyTier;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class LoyaltyAccountRepository {

    // key: storeId + ":" + customerId
    private final Map<String, LoyaltyAccount> accountStorage = new ConcurrentHashMap<>();

    public LoyaltyAccountRepository() {
        seedInitialAccounts();
    }

    private void seedInitialAccounts() {
        Instant now = Instant.now();
        // Seed demo customer account for store_main and store_varanasi_silk
        LoyaltyAccount a1 = new LoyaltyAccount(
            "loy_acc_01",
            "store_main",
            "usr_dev_customer_01",
            "ACTIVE",
            1240,
            1840,
            600,
            0,
            LoyaltyTier.SILVER,
            1,
            now.minusSeconds(86400 * 30),
            now
        );
        accountStorage.put("store_main:usr_dev_customer_01", a1);

        LoyaltyAccount a2 = new LoyaltyAccount(
            "loy_acc_02",
            "store_varanasi_silk",
            "usr_dev_customer_01",
            "ACTIVE",
            750,
            900,
            150,
            0,
            LoyaltyTier.SILVER,
            1,
            now.minusSeconds(86400 * 20),
            now
        );
        accountStorage.put("store_varanasi_silk:usr_dev_customer_01", a2);

        // Seed a second customer
        LoyaltyAccount a3 = new LoyaltyAccount(
            "loy_acc_03",
            "store_main",
            "usr_customer_02",
            "ACTIVE",
            2500,
            2500,
            0,
            0,
            LoyaltyTier.GOLD,
            1,
            now.minusSeconds(86400 * 45),
            now
        );
        accountStorage.put("store_main:usr_customer_02", a3);
    }

    public Optional<LoyaltyAccount> findByStoreAndCustomer(String storeId, String customerId) {
        String key = storeId + ":" + customerId;
        return Optional.ofNullable(accountStorage.get(key));
    }

    public LoyaltyAccount getOrCreate(String storeId, String customerId) {
        String key = storeId + ":" + customerId;
        return accountStorage.computeIfAbsent(key, k -> {
            Instant now = Instant.now();
            return new LoyaltyAccount(
                "loy_acc_" + UUID.randomUUID().toString().substring(0, 8),
                storeId,
                customerId,
                "ACTIVE",
                0,
                0,
                0,
                0,
                LoyaltyTier.BRONZE,
                0,
                now,
                now
            );
        });
    }

    public List<LoyaltyAccount> findByStoreId(String storeId) {
        return accountStorage.values().stream()
            .filter(a -> a.getStoreId().equals(storeId))
            .sorted(Comparator.comparingInt(LoyaltyAccount::getAvailablePoints).reversed())
            .toList();
    }

    public LoyaltyAccount save(LoyaltyAccount account) {
        String key = account.getStoreId() + ":" + account.getCustomerId();
        accountStorage.put(key, account);
        return account;
    }
}
