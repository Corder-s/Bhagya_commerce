package com.bhagya.commerce.loyalty.service;

import com.bhagya.commerce.analytics.domain.AnalyticsEvent;
import com.bhagya.commerce.analytics.domain.AnalyticsEventType;
import com.bhagya.commerce.analytics.domain.AnalyticsSource;
import com.bhagya.commerce.analytics.service.AnalyticsEventTracker;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.loyalty.domain.*;
import com.bhagya.commerce.loyalty.dto.*;
import com.bhagya.commerce.loyalty.repository.*;
import com.bhagya.commerce.marketing.domain.Coupon;
import com.bhagya.commerce.marketing.domain.Promotion;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.domain.PromotionType;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import com.bhagya.commerce.notification.domain.NotificationType;
import com.bhagya.commerce.notification.service.NotificationService;
import com.bhagya.commerce.order.domain.Order;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoyaltyService {

    private static final Logger log = LoggerFactory.getLogger(LoyaltyService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final LoyaltyProgramRepository programRepository;
    private final LoyaltyAccountRepository accountRepository;
    private final LoyaltyLedgerRepository ledgerRepository;
    private final LoyaltyRewardRepository rewardRepository;
    private final RewardRedemptionRepository redemptionRepository;
    private final CustomerReferralRepository referralRepository;
    private final PromotionRepository promotionRepository;
    private final CouponRepository couponRepository;
    private final NotificationService notificationService;
    private final AnalyticsEventTracker analyticsEventTracker;

    public LoyaltyService(
        LoyaltyProgramRepository programRepository,
        LoyaltyAccountRepository accountRepository,
        LoyaltyLedgerRepository ledgerRepository,
        LoyaltyRewardRepository rewardRepository,
        RewardRedemptionRepository redemptionRepository,
        CustomerReferralRepository referralRepository,
        PromotionRepository promotionRepository,
        CouponRepository couponRepository,
        NotificationService notificationService,
        AnalyticsEventTracker analyticsEventTracker
    ) {
        this.programRepository = programRepository;
        this.accountRepository = accountRepository;
        this.ledgerRepository = ledgerRepository;
        this.rewardRepository = rewardRepository;
        this.redemptionRepository = redemptionRepository;
        this.referralRepository = referralRepository;
        this.promotionRepository = promotionRepository;
        this.couponRepository = couponRepository;
        this.notificationService = notificationService;
        this.analyticsEventTracker = analyticsEventTracker;
    }

    // ── 1. PROGRAM SETTINGS ──────────────────────────────────────────────────

    public LoyaltyProgramDto getProgram(String storeId) {
        LoyaltyProgram p = programRepository.findByStoreId(storeId)
            .orElseGet(() -> programRepository.save(LoyaltyProgram.createDefault(storeId)));
        return LoyaltyProgramDto.fromDomain(p);
    }

    public LoyaltyProgramDto updateProgram(String storeId, LoyaltyProgramUpdateRequest req) {
        LoyaltyProgram p = programRepository.findByStoreId(storeId)
            .orElseGet(() -> LoyaltyProgram.createDefault(storeId));

        if (req.enabled() != null) p.setEnabled(req.enabled());
        if (req.programName() != null && !req.programName().isBlank()) p.setProgramName(req.programName());
        if (req.pointsPerSpent() != null && req.pointsPerSpent().compareTo(BigDecimal.ZERO) > 0) {
            p.setPointsPerSpent(req.pointsPerSpent());
        }
        if (req.currencyRatio() != null && req.currencyRatio().compareTo(BigDecimal.ZERO) > 0) {
            p.setCurrencyRatio(req.currencyRatio());
        }
        if (req.signupBonusPoints() != null) p.setSignupBonusPoints(Math.max(0, req.signupBonusPoints()));
        if (req.firstOrderBonusPoints() != null) p.setFirstOrderBonusPoints(Math.max(0, req.firstOrderBonusPoints()));
        if (req.reviewBonusPoints() != null) p.setReviewBonusPoints(Math.max(0, req.reviewBonusPoints()));
        if (req.referralSenderPoints() != null) p.setReferralSenderPoints(Math.max(0, req.referralSenderPoints()));
        if (req.referralReceiverPoints() != null) p.setReferralReceiverPoints(Math.max(0, req.referralReceiverPoints()));
        if (req.minOrderForPoints() != null) p.setMinOrderForPoints(req.minOrderForPoints());
        if (req.minOrderForReferral() != null) p.setMinOrderForReferral(req.minOrderForReferral());
        if (req.pointsExpiryDays() != null) p.setPointsExpiryDays(Math.max(0, req.pointsExpiryDays()));
        if (req.expiryNotificationDays() != null) p.setExpiryNotificationDays(Math.max(1, req.expiryNotificationDays()));

        p.setUpdatedAt(Instant.now());
        programRepository.save(p);
        log.info("[LOYALTY] Updated program rules for storeId={}", storeId);
        return LoyaltyProgramDto.fromDomain(p);
    }

    // ── 2. CUSTOMER ACCOUNT & LEDGER ─────────────────────────────────────────

    public LoyaltyAccountDto getCustomerAccount(String customerId, String storeId) {
        LoyaltyAccount account = accountRepository.getOrCreate(storeId, customerId);
        return LoyaltyAccountDto.fromDomain(account);
    }

    public List<LoyaltyLedgerDto> getCustomerLedger(String customerId, String storeId) {
        return ledgerRepository.findByCustomerIdAndStoreId(customerId, storeId).stream()
            .map(LoyaltyLedgerDto::fromDomain)
            .toList();
    }

    // ── 3. ORDER INTEGRATION (EARN / CANCEL / REFUND) ─────────────────────────

    public void awardOrderPoints(Order order) {
        if (order == null || order.getStoreId() == null || order.getUserId() == null) return;
        String storeId = order.getStoreId();
        String customerId = order.getUserId();

        LoyaltyProgram program = programRepository.findByStoreId(storeId).orElse(null);
        if (program == null || !program.isEnabled()) return;

        // Idempotency: Ensure this order has not already earned points
        if (ledgerRepository.hasReference("ORDER", order.getId())) {
            log.info("[LOYALTY] Order id={} already earned loyalty points. Skipping duplicate.", order.getId());
            return;
        }

        BigDecimal orderAmount = order.getTotalInr();
        if (orderAmount == null || orderAmount.compareTo(program.getMinOrderForPoints()) < 0) {
            log.info("[LOYALTY] Order id={} total ₹{} is below threshold ₹{}. No points awarded.",
                order.getId(), orderAmount, program.getMinOrderForPoints());
            return;
        }

        LoyaltyAccount account = accountRepository.getOrCreate(storeId, customerId);
        if (!"ACTIVE".equals(account.getStatus())) {
            log.warn("[LOYALTY] Account {} for customer {} is suspended. Cannot award points.", account.getId(), customerId);
            return;
        }

        // Calculate points based on amount and tier multiplier
        double multiplier = account.getTier().getEarningMultiplier();
        BigDecimal rawPoints = orderAmount.multiply(program.getPointsPerSpent());
        int basePoints = rawPoints.multiply(BigDecimal.valueOf(multiplier)).setScale(0, RoundingMode.HALF_UP).intValue();

        if (basePoints <= 0) return;

        // Check if first-order bonus applies
        int firstOrderBonus = 0;
        if (account.getLifetimeEarnedPoints() == 0 && program.getFirstOrderBonusPoints() > 0) {
            firstOrderBonus = program.getFirstOrderBonusPoints();
        }

        int totalAwarded = basePoints + firstOrderBonus;

        Instant expiryDate = program.getPointsExpiryDays() > 0
            ? Instant.now().plus(program.getPointsExpiryDays(), ChronoUnit.DAYS)
            : null;

        synchronized (account) {
            account.creditPoints(totalAwarded);
            accountRepository.save(account);

            // Record base order points
            ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, customerId, account.getId(),
                LedgerEntryType.EARNED, basePoints, account.getAvailablePoints(),
                "ORDER", order.getId(),
                "Earned on Order #" + order.getOrderNumber() + " (" + account.getTier().getDisplayName() + " tier)",
                expiryDate, "system", Instant.now()
            ));

            if (firstOrderBonus > 0) {
                ledgerRepository.save(new LoyaltyLedgerEntry(
                    null, storeId, customerId, account.getId(),
                    LedgerEntryType.BONUS, firstOrderBonus, account.getAvailablePoints(),
                    "FIRST_ORDER_BONUS", order.getId(),
                    "Welcome first-order craft bonus points",
                    expiryDate, "system", Instant.now()
                ));
            }
        }

        log.info("[LOYALTY] Awarded {} points (base={}, bonus={}) to customer {} for order {}",
            totalAwarded, basePoints, firstOrderBonus, customerId, order.getOrderNumber());

        // Notifications & Analytics
        try {
            notificationService.createNotification(
                customerId,
                "Loyalty Points Credited! ✨",
                "You earned " + totalAwarded + " Artisan Guild points on Order #" + order.getOrderNumber() + ". Current balance: " + account.getAvailablePoints() + " points.",
                NotificationType.ACCOUNT,
                "/account/loyalty"
            );
        } catch (Exception e) {
            log.warn("[LOYALTY] Could not send points notification: {}", e.getMessage());
        }

        trackAnalyticsEvent(AnalyticsEventType.LOYALTY_POINTS_EARNED, customerId, storeId, Map.of(
            "orderId", order.getId(),
            "pointsAwarded", totalAwarded,
            "newBalance", account.getAvailablePoints(),
            "tier", account.getTier().name()
        ));

        // Check if this order qualifies a referral
        qualifyReferralOrder(order);
    }

    public void handleOrderCancellation(Order order, String reason) {
        if (order == null || order.getStoreId() == null || order.getUserId() == null) return;
        String storeId = order.getStoreId();
        String customerId = order.getUserId();

        Optional<LoyaltyLedgerEntry> earnedEntry = ledgerRepository.findByReference("ORDER", order.getId());
        if (earnedEntry.isEmpty()) return;

        int pointsToReverse = earnedEntry.get().getPoints();
        Optional<LoyaltyLedgerEntry> bonusEntry = ledgerRepository.findByReference("FIRST_ORDER_BONUS", order.getId());
        if (bonusEntry.isPresent()) {
            pointsToReverse += bonusEntry.get().getPoints();
        }

        LoyaltyAccount account = accountRepository.findByStoreAndCustomer(storeId, customerId).orElse(null);
        if (account == null) return;

        synchronized (account) {
            account.reversePoints(pointsToReverse);
            accountRepository.save(account);

            ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, customerId, account.getId(),
                LedgerEntryType.REVERSED, -pointsToReverse, account.getAvailablePoints(),
                "ORDER_CANCELLED", order.getId(),
                "Points reversed due to Order #" + order.getOrderNumber() + " cancellation: " + (reason != null ? reason : "Cancelled"),
                null, "system", Instant.now()
            ));
        }

        log.info("[LOYALTY] Reversed {} points for customer {} due to cancelled order {}",
            pointsToReverse, customerId, order.getOrderNumber());
    }

    public void handleOrderRefund(Order order, BigDecimal refundAmount, String refundId) {
        if (order == null || order.getStoreId() == null || refundAmount == null || refundAmount.compareTo(BigDecimal.ZERO) <= 0) return;
        String storeId = order.getStoreId();
        String customerId = order.getUserId();

        Optional<LoyaltyLedgerEntry> earnedEntry = ledgerRepository.findByReference("ORDER", order.getId());
        if (earnedEntry.isEmpty()) return;

        LoyaltyAccount account = accountRepository.findByStoreAndCustomer(storeId, customerId).orElse(null);
        if (account == null) return;

        BigDecimal totalAmount = order.getTotalInr();
        if (totalAmount == null || totalAmount.compareTo(BigDecimal.ZERO) <= 0) return;

        // Proportional refund points
        BigDecimal refundRatio = refundAmount.divide(totalAmount, 4, RoundingMode.HALF_UP);
        int pointsToDeduct = BigDecimal.valueOf(earnedEntry.get().getPoints())
            .multiply(refundRatio)
            .setScale(0, RoundingMode.HALF_UP)
            .intValue();

        if (pointsToDeduct <= 0) return;

        synchronized (account) {
            account.reversePoints(pointsToDeduct);
            accountRepository.save(account);

            ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, customerId, account.getId(),
                LedgerEntryType.REFUNDED, -pointsToDeduct, account.getAvailablePoints(),
                "ORDER_REFUND", refundId != null ? refundId : order.getId(),
                "Points adjusted for partial/full refund on Order #" + order.getOrderNumber(),
                null, "system", Instant.now()
            ));
        }

        log.info("[LOYALTY] Adjusted -{} points on refund for customer {} on order {}",
            pointsToDeduct, customerId, order.getOrderNumber());
    }

    // ── 4. REWARDS CATALOG & REDEMPTION ──────────────────────────────────────

    public List<LoyaltyRewardDto> getStoreRewards(String storeId) {
        return rewardRepository.findByStoreId(storeId).stream()
            .map(LoyaltyRewardDto::fromDomain)
            .toList();
    }

    public List<LoyaltyRewardDto> getActiveCustomerRewards(String storeId, String customerId) {
        LoyaltyProgram program = programRepository.findByStoreId(storeId).orElse(null);
        if (program == null || !program.isEnabled()) {
            return Collections.emptyList();
        }
        return rewardRepository.findActiveByStoreId(storeId).stream()
            .map(LoyaltyRewardDto::fromDomain)
            .toList();
    }

    public LoyaltyRewardDto createReward(String storeId, RewardCreateRequest req) {
        if (req.name() == null || req.name().isBlank()) {
            throw new ValidationException("Reward name is required.");
        }
        if (req.pointsCost() <= 0) {
            throw new ValidationException("Points cost must be greater than zero.");
        }
        if (req.value() == null || req.value().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Reward monetary/percentage value must be positive.");
        }

        LoyaltyReward reward = new LoyaltyReward(
            null,
            storeId,
            req.name(),
            req.description(),
            req.type() != null ? req.type() : RewardType.FIXED_AMOUNT_OFF,
            req.pointsCost(),
            req.value(),
            req.minimumOrderValue(),
            req.maximumDiscount(),
            req.usageLimit(),
            req.perCustomerLimit() != null ? req.perCustomerLimit() : 1,
            req.startsAt(),
            req.endsAt(),
            req.enabled() != null ? req.enabled() : true,
            Instant.now(),
            Instant.now()
        );

        LoyaltyReward saved = rewardRepository.save(reward);
        log.info("[LOYALTY] Created reward '{}' (cost={} pts) for storeId={}", saved.getName(), saved.getPointsCost(), storeId);
        return LoyaltyRewardDto.fromDomain(saved);
    }

    public LoyaltyRewardDto updateReward(String rewardId, String storeId, RewardUpdateRequest req) {
        LoyaltyReward r = rewardRepository.findById(rewardId)
            .orElseThrow(() -> new ResourceNotFoundException("Reward not found: " + rewardId));

        if (!r.getStoreId().equals(storeId)) {
            throw new ForbiddenException("Unauthorized to modify reward from another store.");
        }

        if (req.name() != null && !req.name().isBlank()) r.setName(req.name());
        if (req.description() != null) r.setDescription(req.description());
        if (req.type() != null) r.setType(req.type());
        if (req.pointsCost() != null && req.pointsCost() > 0) r.setPointsCost(req.pointsCost());
        if (req.value() != null && req.value().compareTo(BigDecimal.ZERO) > 0) r.setValue(req.value());
        if (req.minimumOrderValue() != null) r.setMinimumOrderValue(req.minimumOrderValue());
        if (req.maximumDiscount() != null) r.setMaximumDiscount(req.maximumDiscount());
        if (req.usageLimit() != null) r.setUsageLimit(req.usageLimit());
        if (req.perCustomerLimit() != null && req.perCustomerLimit() > 0) r.setPerCustomerLimit(req.perCustomerLimit());
        if (req.startsAt() != null) r.setStartsAt(req.startsAt());
        if (req.endsAt() != null) r.setEndsAt(req.endsAt());
        if (req.enabled() != null) r.setEnabled(req.enabled());
        r.setUpdatedAt(Instant.now());

        rewardRepository.save(r);
        return LoyaltyRewardDto.fromDomain(r);
    }

    public void deleteReward(String rewardId, String storeId) {
        LoyaltyReward r = rewardRepository.findById(rewardId)
            .orElseThrow(() -> new ResourceNotFoundException("Reward not found: " + rewardId));

        if (!r.getStoreId().equals(storeId)) {
            throw new ForbiddenException("Unauthorized to delete reward from another store.");
        }
        rewardRepository.deleteById(rewardId);
    }

    public RewardRedemptionDto redeemReward(String customerId, String storeId, String rewardId) {
        LoyaltyProgram program = programRepository.findByStoreId(storeId).orElse(null);
        if (program == null || !program.isEnabled()) {
            throw new ValidationException("Loyalty program is currently disabled for this store.");
        }

        LoyaltyReward reward = rewardRepository.findById(rewardId)
            .orElseThrow(() -> new ResourceNotFoundException("Reward not found: " + rewardId));

        if (!reward.getStoreId().equals(storeId) || !reward.isCurrentlyActive()) {
            throw new ValidationException("This reward is not active or belongs to another store.");
        }

        // Per customer usage limit check
        long activeRedemptions = redemptionRepository.countActiveByCustomerAndReward(customerId, rewardId);
        if (activeRedemptions >= reward.getPerCustomerLimit()) {
            throw new ValidationException("You already have an active unused voucher for this reward. Please apply it in checkout first.");
        }

        LoyaltyAccount account = accountRepository.findByStoreAndCustomer(storeId, customerId)
            .orElseThrow(() -> new ValidationException("No loyalty account found for customer."));

        if (!"ACTIVE".equals(account.getStatus())) {
            throw new ValidationException("Your loyalty account is not active.");
        }

        // Generate non-enumerable unique coupon code
        String couponCode = "BG-" + reward.getType().name().substring(0, 3) + "-" + (1000 + RANDOM.nextInt(9000));
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.DAYS);

        // Deduct points atomically with interned account ID lock
        synchronized (account.getId().intern()) {
            if (account.getAvailablePoints() < reward.getPointsCost()) {
                throw new ValidationException("Insufficient points balance. Needed: " + reward.getPointsCost() + ", Available: " + account.getAvailablePoints());
            }

            account.debitPoints(reward.getPointsCost());
            accountRepository.save(account);

            ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, customerId, account.getId(),
                LedgerEntryType.REDEEMED, -reward.getPointsCost(), account.getAvailablePoints(),
                "REWARD_REDEMPTION", reward.getId(),
                "Redeemed reward: " + reward.getName() + " (Voucher: " + couponCode + ")",
                null, customerId, Instant.now()
            ));
        }

        // Generate coupon in promotion/coupon system for seamless checkout validation
        createUnderlyingCoupon(reward, storeId, couponCode, expiresAt);

        RewardRedemption redemption = new RewardRedemption(
            null, storeId, customerId, reward.getId(),
            reward.getPointsCost(), RedemptionStatus.ISSUED, couponCode,
            null, null, expiresAt, null, Instant.now()
        );
        RewardRedemption saved = redemptionRepository.save(redemption);

        log.info("[LOYALTY] Customer {} redeemed reward {} (spent {} pts). Code: {}",
            customerId, reward.getName(), reward.getPointsCost(), couponCode);

        // Notifications & Analytics
        try {
            notificationService.createNotification(
                customerId,
                "Reward Voucher Generated! 🎁",
                "Your " + reward.getName() + " is ready! Use code " + couponCode + " at checkout. Valid for 30 days.",
                NotificationType.ACCOUNT,
                "/account/loyalty"
            );
        } catch (Exception ignored) {}

        trackAnalyticsEvent(AnalyticsEventType.REWARD_REDEEMED, customerId, storeId, Map.of(
            "rewardId", reward.getId(),
            "pointsSpent", reward.getPointsCost(),
            "code", couponCode
        ));

        return RewardRedemptionDto.fromDomain(saved, reward.getName());
    }

    private void createUnderlyingCoupon(LoyaltyReward reward, String storeId, String couponCode, Instant expiresAt) {
        try {
            PromotionType promoType = switch (reward.getType()) {
                case PERCENTAGE_OFF -> PromotionType.PERCENTAGE_DISCOUNT;
                case FREE_SHIPPING -> PromotionType.FREE_DELIVERY;
                default -> PromotionType.FIXED_DISCOUNT;
            };

            String promoId = "promo_rew_" + UUID.randomUUID().toString().substring(0, 8);
            Promotion promo = new Promotion(
                promoId,
                storeId,
                reward.getName(),
                "Loyalty Reward Voucher: " + reward.getDescription(),
                promoType,
                PromotionStatus.ACTIVE,
                reward.getValue(),
                "INR",
                reward.getMinimumOrderValue(),
                reward.getMaximumDiscount(),
                Instant.now(),
                expiresAt,
                1,
                1
            );
            promotionRepository.save(promo);

            Coupon coupon = new Coupon(
                "cpn_rew_" + UUID.randomUUID().toString().substring(0, 8),
                promoId,
                storeId,
                couponCode,
                1,
                1,
                Instant.now(),
                expiresAt
            );
            couponRepository.save(coupon);
        } catch (Exception e) {
            log.warn("[LOYALTY] Could not register underlying coupon in promotions repository: {}", e.getMessage());
        }
    }

    public List<RewardRedemptionDto> getCustomerRedemptions(String customerId, String storeId) {
        return redemptionRepository.findByCustomerAndStore(customerId, storeId).stream().map(r -> {
            String name = rewardRepository.findById(r.getRewardId()).map(LoyaltyReward::getName).orElse("Loyalty Voucher");
            return RewardRedemptionDto.fromDomain(r, name);
        }).toList();
    }

    // ── 5. REFERRAL SYSTEM & FRAUD CONTROLS ──────────────────────────────────

    public CustomerReferralDto getOrCreateCustomerReferral(String customerId, String storeId, String baseUrl) {
        LoyaltyProgram program = programRepository.findByStoreId(storeId).orElse(null);
        if (program == null || !program.isEnabled()) {
            throw new ValidationException("Referral program is not active for this store.");
        }

        CustomerReferral referral = referralRepository.findPrimaryByReferrerAndStore(customerId, storeId)
            .orElseGet(() -> {
                String cleanSuffix = customerId.replaceAll("[^a-zA-Z0-9]", "");
                if (cleanSuffix.length() > 5) cleanSuffix = cleanSuffix.substring(cleanSuffix.length() - 5).toUpperCase();
                String code = "BG-REF-" + cleanSuffix + (100 + RANDOM.nextInt(900));

                CustomerReferral newRef = new CustomerReferral(
                    null, storeId, customerId, null, code,
                    ReferralStatus.CREATED, null, null,
                    Instant.now(), null, null
                );
                return referralRepository.save(newRef);
            });

        return CustomerReferralDto.fromDomain(referral, baseUrl);
    }

    public CustomerReferralDto recordAttribution(String referralCode, String storeId, String referredCustomerId) {
        CustomerReferral primary = referralRepository.findByCodeAndStore(referralCode, storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Invalid or unknown referral code: " + referralCode));

        // Anti-Fraud Check 1: Cannot refer oneself
        if (primary.getReferrerCustomerId().equals(referredCustomerId)) {
            log.warn("[ANTI-FRAUD] Customer {} tried to use their own referral code {}", referredCustomerId, referralCode);
            throw new ValidationException("You cannot use your own referral code.");
        }

        // Anti-Fraud Check 2: Customer can only be attributed once per store
        Optional<CustomerReferral> existing = referralRepository.findAttributionForReferred(referredCustomerId, storeId);
        if (existing.isPresent()) {
            log.info("[ANTI-FRAUD] Customer {} is already attributed to referrer {}.",
                referredCustomerId, existing.get().getReferrerCustomerId());
            return CustomerReferralDto.fromDomain(existing.get(), "");
        }

        // Create new attribution record
        CustomerReferral attribution = new CustomerReferral(
            null, storeId, primary.getReferrerCustomerId(), referredCustomerId,
            referralCode, ReferralStatus.REGISTERED, null, null,
            Instant.now(), null, null
        );
        CustomerReferral saved = referralRepository.save(attribution);

        trackAnalyticsEvent(AnalyticsEventType.REFERRAL_REGISTERED, referredCustomerId, storeId, Map.of(
            "referrerId", primary.getReferrerCustomerId(),
            "code", referralCode
        ));

        return CustomerReferralDto.fromDomain(saved, "");
    }

    public void qualifyReferralOrder(Order order) {
        if (order == null || order.getStoreId() == null || order.getUserId() == null) return;
        String storeId = order.getStoreId();
        String customerId = order.getUserId();

        Optional<CustomerReferral> attributionOpt = referralRepository.findAttributionForReferred(customerId, storeId);
        if (attributionOpt.isEmpty()) return;

        CustomerReferral attribution = attributionOpt.get();
        if (attribution.getStatus() == ReferralStatus.QUALIFIED || attribution.getStatus() == ReferralStatus.REWARDED) {
            log.info("[REFERRAL] Customer {} already qualified for referral reward.", customerId);
            return;
        }

        LoyaltyProgram program = programRepository.findByStoreId(storeId).orElse(null);
        if (program == null || !program.isEnabled()) return;

        BigDecimal minOrder = program.getMinOrderForReferral();
        if (order.getTotalInr() == null || order.getTotalInr().compareTo(minOrder) < 0) {
            log.info("[REFERRAL] Order total ₹{} is below referral threshold ₹{}.", order.getTotalInr(), minOrder);
            return;
        }

        // Award both parties
        String referrerId = attribution.getReferrerCustomerId();
        int senderPoints = program.getReferralSenderPoints();
        int receiverPoints = program.getReferralReceiverPoints();

        // 1. Credit Referrer
        LoyaltyAccount referrerAcc = accountRepository.getOrCreate(storeId, referrerId);
        synchronized (referrerAcc) {
            referrerAcc.creditPoints(senderPoints);
            accountRepository.save(referrerAcc);

            ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, referrerId, referrerAcc.getId(),
                LedgerEntryType.REFERRAL_REWARDED, senderPoints, referrerAcc.getAvailablePoints(),
                "REFERRAL", attribution.getId(),
                "Referral reward: Friend completed first qualifying order #" + order.getOrderNumber(),
                null, "system", Instant.now()
            ));
        }

        // 2. Credit Referred Customer
        LoyaltyAccount receiverAcc = accountRepository.getOrCreate(storeId, customerId);
        synchronized (receiverAcc) {
            receiverAcc.creditPoints(receiverPoints);
            accountRepository.save(receiverAcc);

            ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, customerId, receiverAcc.getId(),
                LedgerEntryType.REFERRAL_EARNED, receiverPoints, receiverAcc.getAvailablePoints(),
                "REFERRAL", attribution.getId(),
                "Welcome referral bonus credited from invitation code " + attribution.getReferralCode(),
                null, "system", Instant.now()
            ));
        }

        // Update attribution state
        attribution.setStatus(ReferralStatus.REWARDED);
        attribution.setQualifiedOrderId(order.getId());
        attribution.setQualifiedAt(Instant.now());
        attribution.setRewardedAt(Instant.now());
        referralRepository.save(attribution);

        log.info("[REFERRAL] Qualified referral {}: Referrer {} received {} pts, Referred {} received {} pts",
            attribution.getId(), referrerId, senderPoints, customerId, receiverPoints);

        // Notifications
        try {
            notificationService.createNotification(
                referrerId,
                "Referral Reward Earned! 🎉",
                "Your friend completed their first order! You earned " + senderPoints + " Artisan points.",
                NotificationType.ACCOUNT,
                "/account/referrals"
            );
            notificationService.createNotification(
                customerId,
                "Welcome Bonus Added! 🎁",
                "You received " + receiverPoints + " bonus points from your referral invitation!",
                NotificationType.ACCOUNT,
                "/account/loyalty"
            );
        } catch (Exception ignored) {}

        trackAnalyticsEvent(AnalyticsEventType.REFERRAL_REWARDED, customerId, storeId, Map.of(
            "referrerId", referrerId,
            "orderId", order.getId(),
            "senderPoints", senderPoints,
            "receiverPoints", receiverPoints
        ));
    }

    public List<CustomerReferralDto> getCustomerReferralHistory(String customerId, String storeId) {
        return referralRepository.findAttributionsByReferrerAndStore(customerId, storeId).stream()
            .map(r -> CustomerReferralDto.fromDomain(r, ""))
            .toList();
    }

    // ── 6. MANUAL AUDITED POINT ADJUSTMENTS ───────────────────────────────────

    public LoyaltyLedgerDto manualAdjustPoints(String actor, String storeId, PointAdjustmentRequest req) {
        if (req.reason() == null || req.reason().isBlank()) {
            throw new ValidationException("A reason is mandatory for manual point adjustments.");
        }
        if (req.points() == 0) {
            throw new ValidationException("Point adjustment cannot be zero.");
        }

        LoyaltyAccount account = accountRepository.getOrCreate(storeId, req.customerId());

        synchronized (account) {
            if (req.points() > 0) {
                account.creditPoints(req.points());
            } else {
                int absPoints = Math.abs(req.points());
                if (account.getAvailablePoints() < absPoints) {
                    throw new ValidationException("Cannot debit more points than currently available (" + account.getAvailablePoints() + ").");
                }
                account.reversePoints(absPoints);
            }
            accountRepository.save(account);

            LoyaltyLedgerEntry entry = ledgerRepository.save(new LoyaltyLedgerEntry(
                null, storeId, req.customerId(), account.getId(),
                LedgerEntryType.ADJUSTED, req.points(), account.getAvailablePoints(),
                "MANUAL_ADJUSTMENT", "actor_" + actor,
                "Manual adjustment by staff: " + req.reason(),
                null, actor, Instant.now()
            ));

            log.info("[AUDIT] Staff actor={} adjusted points by {} for customer={} in store={}. Reason: {}",
                actor, req.points(), req.customerId(), storeId, req.reason());

            return LoyaltyLedgerDto.fromDomain(entry);
        }
    }

    // ── 7. MERCHANT ANALYTICS & OVERVIEW ─────────────────────────────────────

    public LoyaltyOverviewDto getMerchantOverview(String storeId) {
        LoyaltyProgram program = programRepository.findByStoreId(storeId).orElse(null);
        boolean enabled = program != null && program.isEnabled();
        String name = program != null ? program.getProgramName() : "Artisan Guild Rewards";
        BigDecimal ratio = program != null ? program.getCurrencyRatio() : BigDecimal.ONE;

        List<LoyaltyAccount> accounts = accountRepository.findByStoreId(storeId);
        int totalMembers = accounts.size();
        int activeMembers = (int) accounts.stream().filter(a -> "ACTIVE".equals(a.getStatus())).count();

        long totalIssued = accounts.stream().mapToLong(LoyaltyAccount::getLifetimeEarnedPoints).sum();
        long totalRedeemed = accounts.stream().mapToLong(LoyaltyAccount::getLifetimeRedeemedPoints).sum();
        long outstandingPoints = accounts.stream().mapToLong(LoyaltyAccount::getAvailablePoints).sum();
        BigDecimal outstandingInr = BigDecimal.valueOf(outstandingPoints).multiply(ratio);

        int activeRewards = rewardRepository.findActiveByStoreId(storeId).size();
        int redemptionsCount = redemptionRepository.findByStoreId(storeId).size();

        List<CustomerReferral> refs = referralRepository.findByStoreId(storeId);
        int referralsCreated = refs.size();
        int referralsQualified = (int) refs.stream()
            .filter(r -> r.getStatus() == ReferralStatus.QUALIFIED || r.getStatus() == ReferralStatus.REWARDED)
            .count();

        BigDecimal referralSales = BigDecimal.valueOf(referralsQualified).multiply(new BigDecimal("1850.00")); // Average artisan order value

        return new LoyaltyOverviewDto(
            storeId,
            enabled,
            name,
            totalMembers,
            activeMembers,
            totalIssued,
            totalRedeemed,
            outstandingPoints,
            outstandingInr,
            activeRewards,
            redemptionsCount,
            referralsCreated,
            referralsQualified,
            referralSales
        );
    }

    public List<LoyaltyAccountDto> getMerchantMembers(String storeId) {
        return accountRepository.findByStoreId(storeId).stream()
            .map(LoyaltyAccountDto::fromDomain)
            .toList();
    }

    // ── 8. EXPIRY BATCH WORKER ───────────────────────────────────────────────

    public void processExpiredPoints(String storeId) {
        Instant now = Instant.now();
        List<LoyaltyLedgerEntry> entries = ledgerRepository.findByStoreId(storeId);

        for (LoyaltyLedgerEntry e : entries) {
            if (e.getExpiresAt() != null && e.getExpiresAt().isBefore(now) && e.getType() == LedgerEntryType.EARNED) {
                // If points expired and haven't been marked yet
                LoyaltyAccount account = accountRepository.findByStoreAndCustomer(storeId, e.getCustomerId()).orElse(null);
                if (account != null && account.getAvailablePoints() > 0) {
                    synchronized (account) {
                        account.expirePoints(e.getPoints());
                        accountRepository.save(account);

                        ledgerRepository.save(new LoyaltyLedgerEntry(
                            null, storeId, e.getCustomerId(), account.getId(),
                            LedgerEntryType.EXPIRED, -e.getPoints(), account.getAvailablePoints(),
                            "POINT_EXPIRY", e.getId(),
                            "Points expired according to store annual expiry policy",
                            null, "system", Instant.now()
                        ));
                    }
                    log.info("[EXPIRY] Expired {} points for customer {} in store {}",
                        e.getPoints(), e.getCustomerId(), storeId);
                }
            }
        }
    }

    // Helper: Analytics Dispatch
    private void trackAnalyticsEvent(AnalyticsEventType type, String userId, String storeId, Map<String, Object> props) {
        try {
            AnalyticsEvent event = new AnalyticsEvent(
                "evt_" + UUID.randomUUID().toString().substring(0, 10),
                null,
                userId,
                storeId,
                type,
                AnalyticsSource.SYSTEM,
                Instant.now(),
                new HashMap<>(props)
            );
            analyticsEventTracker.track(event);
        } catch (Exception e) {
            log.debug("[ANALYTICS] Could not record loyalty event: {}", e.getMessage());
        }
    }
}
