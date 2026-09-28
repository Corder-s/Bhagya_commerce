package com.bhagya.commerce.loyalty.repository;

import com.bhagya.commerce.loyalty.domain.CustomerReferral;
import com.bhagya.commerce.loyalty.domain.ReferralStatus;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
public class CustomerReferralRepository {

    private final Map<String, CustomerReferral> referralStorage = new ConcurrentHashMap<>();
    // storeId + ":" + referralCode -> referralId
    private final Map<String, String> codeIndex = new ConcurrentHashMap<>();
    // storeId + ":" + referrerCustomerId -> referralId (customer's primary referral code per store)
    private final Map<String, String> referrerIndex = new ConcurrentHashMap<>();

    public CustomerReferralRepository() {
        seedInitialReferrals();
    }

    private void seedInitialReferrals() {
        Instant now = Instant.now();
        // Seed primary referral code for dev customer
        CustomerReferral ref1 = new CustomerReferral(
            "ref_01",
            "store_main",
            "usr_dev_customer_01",
            null,
            "BG-PRIYA25",
            ReferralStatus.CREATED,
            null,
            null,
            now.minusSeconds(86400 * 20),
            null,
            null
        );
        save(ref1);

        // Seed an attribution where friend qualified
        CustomerReferral ref2 = new CustomerReferral(
            "ref_02",
            "store_main",
            "usr_dev_customer_01",
            "usr_customer_friend_03",
            "BG-PRIYA25",
            ReferralStatus.REWARDED,
            "ord_friend_551",
            null,
            now.minusSeconds(86400 * 10),
            now.minusSeconds(86400 * 5),
            now.minusSeconds(86400 * 5)
        );
        save(ref2);
    }

    public CustomerReferral save(CustomerReferral referral) {
        if (referral.getId() == null) {
            referral.setId("ref_" + UUID.randomUUID().toString().substring(0, 10));
        }
        referralStorage.put(referral.getId(), referral);

        String codeKey = referral.getStoreId() + ":" + referral.getReferralCode().toUpperCase();
        codeIndex.put(codeKey, referral.getId());

        if (referral.getReferredCustomerId() == null) {
            String refKey = referral.getStoreId() + ":" + referral.getReferrerCustomerId();
            referrerIndex.put(refKey, referral.getId());
        }

        return referral;
    }

    public Optional<CustomerReferral> findPrimaryByReferrerAndStore(String referrerCustomerId, String storeId) {
        String refKey = storeId + ":" + referrerCustomerId;
        String id = referrerIndex.get(refKey);
        if (id == null) return Optional.empty();
        return Optional.ofNullable(referralStorage.get(id));
    }

    public Optional<CustomerReferral> findByCodeAndStore(String code, String storeId) {
        String codeKey = storeId + ":" + code.toUpperCase();
        String id = codeIndex.get(codeKey);
        if (id == null) return Optional.empty();
        return Optional.ofNullable(referralStorage.get(id));
    }

    public Optional<CustomerReferral> findAttributionForReferred(String referredCustomerId, String storeId) {
        return referralStorage.values().stream()
            .filter(r -> r.getStoreId().equals(storeId) &&
                         referredCustomerId.equals(r.getReferredCustomerId()))
            .findFirst();
    }

    public List<CustomerReferral> findAttributionsByReferrerAndStore(String referrerCustomerId, String storeId) {
        return referralStorage.values().stream()
            .filter(r -> r.getStoreId().equals(storeId) &&
                         r.getReferrerCustomerId().equals(referrerCustomerId) &&
                         r.getReferredCustomerId() != null)
            .sorted(Comparator.comparing(CustomerReferral::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public List<CustomerReferral> findByStoreId(String storeId) {
        return referralStorage.values().stream()
            .filter(r -> r.getStoreId().equals(storeId))
            .sorted(Comparator.comparing(CustomerReferral::getCreatedAt).reversed())
            .collect(Collectors.toList());
    }

    public boolean isCodeTaken(String code, String storeId) {
        String codeKey = storeId + ":" + code.toUpperCase();
        return codeIndex.containsKey(codeKey);
    }
}
