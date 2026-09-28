package com.bhagya.commerce.performance;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.loyalty.domain.LoyaltyAccount;
import com.bhagya.commerce.loyalty.repository.*;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import com.bhagya.commerce.notification.service.NotificationService;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class LoyaltyConcurrencyTest {

    private LoyaltyService loyaltyService;
    private LoyaltyAccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        LoyaltyProgramRepository programRepo = new LoyaltyProgramRepository();
        accountRepository = new LoyaltyAccountRepository();
        LoyaltyLedgerRepository ledgerRepo = new LoyaltyLedgerRepository();
        LoyaltyRewardRepository rewardRepo = new LoyaltyRewardRepository();
        RewardRedemptionRepository redemptionRepo = new RewardRedemptionRepository();
        CustomerReferralRepository referralRepo = new CustomerReferralRepository();
        PromotionRepository promotionRepo = new PromotionRepository();
        CouponRepository couponRepo = new CouponRepository();

        loyaltyService = new LoyaltyService(
            programRepo,
            accountRepository,
            ledgerRepo,
            rewardRepo,
            redemptionRepo,
            referralRepo,
            promotionRepo,
            couponRepo,
            new NotificationService(new com.bhagya.commerce.notification.repository.InMemoryNotificationRepository()),
            null
        );

        // Pre-seeded program and rewards in default repositories (e.g. store_main with rew_fixed_100 costing 500 pts)
        LoyaltyAccount account = accountRepository.getOrCreate("store_main", "usr_conc_buyer");
        account.setAvailablePoints(600); // 600 points available, reward costs 500
        accountRepository.save(account);
    }

    @Test
    @DisplayName("[LOYALTY CONCURRENCY] Concurrent redemptions prevent double-spending and negative balances")
    void testConcurrentPointsRedemption() throws InterruptedException {
        int threads = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    loyaltyService.redeemReward("usr_conc_buyer", "store_main", "rew_fixed_100");
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failCount.incrementAndGet();
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        finishLatch.await();
        executor.shutdown();

        // With 600 points and cost=500, exactly 1 redemption should succeed (600 - 500 = 100 remaining points)
        // The remaining 9 threads must be rejected with insufficient balance
        assertEquals(1, successCount.get(), "Only 1 redemption should succeed with 600 points balance and cost=500");
        assertEquals(9, failCount.get(), "9 redemptions should fail due to insufficient points");

        LoyaltyAccount updated = accountRepository.findByStoreAndCustomer("store_main", "usr_conc_buyer").orElseThrow();
        assertEquals(100, updated.getAvailablePoints(), "Remaining balance must be exactly 100 points");
        assertTrue(updated.getAvailablePoints() >= 0, "Points balance must never be negative");
    }
}
