package com.bhagya.commerce.loyalty.repository;

import com.bhagya.commerce.loyalty.domain.LedgerEntryType;
import com.bhagya.commerce.loyalty.domain.LoyaltyLedgerEntry;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
public class LoyaltyLedgerRepository {

    private final Map<String, LoyaltyLedgerEntry> ledgerStorage = new ConcurrentHashMap<>();

    public LoyaltyLedgerRepository() {
        seedInitialLedger();
    }

    private void seedInitialLedger() {
        Instant now = Instant.now();
        // Seed initial transactions for usr_dev_customer_01 in store_main
        save(new LoyaltyLedgerEntry(
            "led_01", "store_main", "usr_dev_customer_01", "loy_acc_01",
            LedgerEntryType.BONUS, 100, 100,
            "SIGNUP", "usr_dev_customer_01",
            "Welcome Artisan Guild signup bonus",
            now.plusSeconds(86400 * 365), "system", now.minusSeconds(86400 * 30)
        ));

        save(new LoyaltyLedgerEntry(
            "led_02", "store_main", "usr_dev_customer_01", "loy_acc_01",
            LedgerEntryType.EARNED, 740, 840,
            "ORDER", "ord_9812",
            "Earned on Order #ORD-2026-9812 (Banarasi handloom)",
            now.plusSeconds(86400 * 350), "system", now.minusSeconds(86400 * 15)
        ));

        save(new LoyaltyLedgerEntry(
            "led_03", "store_main", "usr_dev_customer_01", "loy_acc_01",
            LedgerEntryType.REFERRAL_REWARDED, 500, 1340,
            "REFERRAL", "ref_kavitasharma",
            "Referral reward: Friend completed first qualifying order",
            now.plusSeconds(86400 * 360), "system", now.minusSeconds(86400 * 5)
        ));

        save(new LoyaltyLedgerEntry(
            "led_04", "store_main", "usr_dev_customer_01", "loy_acc_01",
            LedgerEntryType.REDEEMED, -100, 1240,
            "REWARD_REDEMPTION", "rew_voucher_100",
            "Redeemed ₹100 Guild voucher coupon",
            null, "usr_dev_customer_01", now.minusSeconds(86400 * 2)
        ));
    }

    public LoyaltyLedgerEntry save(LoyaltyLedgerEntry entry) {
        if (entry.getId() == null) {
            entry.setId("led_" + UUID.randomUUID().toString().substring(0, 12));
        }
        ledgerStorage.put(entry.getId(), entry);
        return entry;
    }

    public List<LoyaltyLedgerEntry> findByCustomerIdAndStoreId(String customerId, String storeId) {
        return ledgerStorage.values().stream()
            .filter(e -> e.getCustomerId().equals(customerId) && e.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(LoyaltyLedgerEntry::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public List<LoyaltyLedgerEntry> findByStoreId(String storeId) {
        return ledgerStorage.values().stream()
            .filter(e -> e.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(LoyaltyLedgerEntry::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public boolean hasReference(String referenceType, String referenceId) {
        return ledgerStorage.values().stream()
            .anyMatch(e -> referenceType.equals(e.getReferenceType()) && referenceId.equals(e.getReferenceId()));
    }

    public Optional<LoyaltyLedgerEntry> findByReference(String referenceType, String referenceId) {
        return ledgerStorage.values().stream()
            .filter(e -> referenceType.equals(e.getReferenceType()) && referenceId.equals(e.getReferenceId()))
            .findFirst();
    }
}
