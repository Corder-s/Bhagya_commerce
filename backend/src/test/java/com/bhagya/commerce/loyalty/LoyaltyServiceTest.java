package com.bhagya.commerce.loyalty;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.bhagya.commerce.analytics.service.AnalyticsEventTracker;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.loyalty.domain.*;
import com.bhagya.commerce.loyalty.dto.*;
import com.bhagya.commerce.loyalty.repository.*;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import com.bhagya.commerce.notification.service.NotificationService;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import java.math.BigDecimal;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class LoyaltyServiceTest {

    private LoyaltyService loyaltyService;
    private LoyaltyProgramRepository programRepo;
    private LoyaltyAccountRepository accountRepo;
    private LoyaltyLedgerRepository ledgerRepo;
    private LoyaltyRewardRepository rewardRepo;
    private RewardRedemptionRepository redemptionRepo;
    private CustomerReferralRepository referralRepo;
    private NotificationService notificationService;
    private AnalyticsEventTracker analyticsTracker;

    @BeforeEach
    void setUp() {
        programRepo = new LoyaltyProgramRepository();
        accountRepo = new LoyaltyAccountRepository();
        ledgerRepo = new LoyaltyLedgerRepository();
        rewardRepo = new LoyaltyRewardRepository();
        redemptionRepo = new RewardRedemptionRepository();
        referralRepo = new CustomerReferralRepository();
        PromotionRepository promotionRepo = mock(PromotionRepository.class);
        CouponRepository couponRepo = mock(CouponRepository.class);
        notificationService = mock(NotificationService.class);
        analyticsTracker = mock(AnalyticsEventTracker.class);

        loyaltyService = new LoyaltyService(
            programRepo,
            accountRepo,
            ledgerRepo,
            rewardRepo,
            redemptionRepo,
            referralRepo,
            promotionRepo,
            couponRepo,
            notificationService,
            analyticsTracker
        );
    }

    @Test
    void testAwardPointsOnOrder_CalculatesCorrectlyAndIsIdempotent() {
        String storeId = "store_test_01";
        String customerId = "usr_new_artisan_buyer";

        Order order = new Order();
        order.setId("ord_test_881");
        order.setOrderNumber("ORD-2026-TEST");
        order.setStoreId(storeId);
        order.setUserId(customerId);
        order.setTotalAmount(new BigDecimal("2000.00"));
        order.setStatus(OrderStatus.CONFIRMED);

        // First award: 2000 * 0.05 = 100 base + 150 first-order bonus = 250 points
        loyaltyService.awardOrderPoints(order);

        LoyaltyAccountDto acc = loyaltyService.getCustomerAccount(customerId, storeId);
        assertEquals(250, acc.availablePoints());
        assertEquals(250, acc.lifetimeEarnedPoints());

        // Second award attempt (Idempotency): Must not award again
        loyaltyService.awardOrderPoints(order);
        LoyaltyAccountDto accAfterDuplicate = loyaltyService.getCustomerAccount(customerId, storeId);
        assertEquals(250, accAfterDuplicate.availablePoints(), "Duplicate order event must not award points again");
    }

    @Test
    void testRewardRedemption_PreventsInsufficientBalance() {
        String storeId = "store_main";
        String customerId = "usr_broke_buyer";

        // Account with 0 points
        LoyaltyAccount account = accountRepo.getOrCreate(storeId, customerId);
        account.setAvailablePoints(50);
        accountRepo.save(account);

        // Attempt to redeem 500-point voucher
        assertThrows(ValidationException.class, () -> {
            loyaltyService.redeemReward(customerId, storeId, "rew_fixed_100");
        }, "Should throw ValidationException when available points are insufficient");
    }

    @Test
    void testRewardRedemption_SuccessDeductsPointsAndIssuesVoucher() {
        String storeId = "store_main";
        String customerId = "usr_wealthy_buyer";

        LoyaltyAccount account = accountRepo.getOrCreate(storeId, customerId);
        account.setAvailablePoints(1000);
        accountRepo.save(account);

        RewardRedemptionDto redemption = loyaltyService.redeemReward(customerId, storeId, "rew_fixed_100");
        assertNotNull(redemption);
        assertNotNull(redemption.referenceCode());
        assertTrue(redemption.referenceCode().startsWith("BG-FIX-"));

        LoyaltyAccountDto accAfter = loyaltyService.getCustomerAccount(customerId, storeId);
        assertEquals(500, accAfter.availablePoints());
    }

    @Test
    void testAntiFraud_SelfReferralIsRejected() {
        String storeId = "store_main";
        String customerId = "usr_dev_customer_01";

        // Try to attribute customer's own referral code to themselves
        assertThrows(ValidationException.class, () -> {
            loyaltyService.recordAttribution("BG-PRIYA25", storeId, customerId);
        }, "Customer must not be allowed to refer themselves");
    }

    @Test
    void testReferralQualification_AwardsBothReferrerAndReferee() {
        String storeId = "store_main";
        String referrerId = "usr_dev_customer_01";
        String refereeId = "usr_friend_buyer_99";

        // Refer friend
        CustomerReferralDto ref = loyaltyService.recordAttribution("BG-PRIYA25", storeId, refereeId);
        assertEquals("REGISTERED", ref.status());

        int initialReferrerPoints = loyaltyService.getCustomerAccount(referrerId, storeId).availablePoints();

        // Friend completes qualifying order >= ₹500
        Order qualifyingOrder = new Order();
        qualifyingOrder.setId("ord_friend_qualify_99");
        qualifyingOrder.setOrderNumber("ORD-FRIEND-99");
        qualifyingOrder.setStoreId(storeId);
        qualifyingOrder.setUserId(refereeId);
        qualifyingOrder.setTotalAmount(new BigDecimal("1500.00"));
        qualifyingOrder.setStatus(OrderStatus.CONFIRMED);

        loyaltyService.awardOrderPoints(qualifyingOrder);

        // Verify referrer received 300 referral bonus points
        int finalReferrerPoints = loyaltyService.getCustomerAccount(referrerId, storeId).availablePoints();
        assertEquals(initialReferrerPoints + 300, finalReferrerPoints);

        // Verify referee received 150 referral bonus points + their order points
        LoyaltyAccountDto refereeAcc = loyaltyService.getCustomerAccount(refereeId, storeId);
        assertTrue(refereeAcc.availablePoints() >= 150);
    }

    @Test
    void testOrderCancellation_ReversesPoints() {
        String storeId = "store_cancel_test";
        String customerId = "usr_cancel_buyer";

        Order order = new Order();
        order.setId("ord_to_cancel_1");
        order.setOrderNumber("ORD-CANCEL-1");
        order.setStoreId(storeId);
        order.setUserId(customerId);
        order.setTotalAmount(new BigDecimal("1000.00"));
        order.setStatus(OrderStatus.CONFIRMED);

        loyaltyService.awardOrderPoints(order);
        int earned = loyaltyService.getCustomerAccount(customerId, storeId).availablePoints();
        assertTrue(earned > 0);

        loyaltyService.handleOrderCancellation(order, "Customer requested return");
        int afterCancel = loyaltyService.getCustomerAccount(customerId, storeId).availablePoints();
        assertEquals(0, afterCancel, "Points should be reversed upon cancellation");
    }

    @Test
    void testManualAdjustment_RequiresReasonAndAudits() {
        String storeId = "store_main";
        String customerId = "usr_audit_buyer";

        // Blank reason rejected
        assertThrows(ValidationException.class, () -> {
            loyaltyService.manualAdjustPoints("staff_admin", storeId, new PointAdjustmentRequest(customerId, 100, ""));
        });

        // Valid adjustment
        LoyaltyLedgerDto ledger = loyaltyService.manualAdjustPoints("staff_admin", storeId, new PointAdjustmentRequest(customerId, 200, "Artisan festival compensation"));
        assertEquals(200, ledger.points());
        assertEquals("MANUAL_ADJUSTMENT", ledger.referenceType());
    }
}
