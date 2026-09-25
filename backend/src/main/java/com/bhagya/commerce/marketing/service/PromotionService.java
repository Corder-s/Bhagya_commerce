package com.bhagya.commerce.marketing.service;

import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.marketing.domain.Coupon;
import com.bhagya.commerce.marketing.domain.Promotion;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.domain.PromotionType;
import com.bhagya.commerce.marketing.dto.*;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PromotionService {

    private static final Logger log = LoggerFactory.getLogger(PromotionService.class);

    private final PromotionRepository promotionRepository;
    private final CouponRepository couponRepository;

    public PromotionService(PromotionRepository promotionRepository, CouponRepository couponRepository) {
        this.promotionRepository = promotionRepository;
        this.couponRepository = couponRepository;
    }

    public List<PromotionResponse> getStorePromotions(String storeId) {
        return promotionRepository.findByStoreId(storeId).stream().map(p -> {
            String code = couponRepository.findByPromotionId(p.getId()).map(Coupon::getCode).orElse(null);
            return PromotionResponse.fromDomain(p, code);
        }).toList();
    }

    public PromotionResponse getPromotionById(String promotionId, String storeId) {
        Promotion p = promotionRepository.findById(promotionId)
            .orElseThrow(() -> new ResourceNotFoundException("Promotion not found: " + promotionId));

        if (!p.getStoreId().equals(storeId)) {
            throw new ValidationException("Promotion does not belong to your store.");
        }

        String code = couponRepository.findByPromotionId(p.getId()).map(Coupon::getCode).orElse(null);
        return PromotionResponse.fromDomain(p, code);
    }

    public PromotionResponse createPromotion(String storeId, PromotionCreateRequest request) {
        if (request.value() == null || request.value().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Promotion value must be greater than zero.");
        }

        String promoId = "promo_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 1000);
        Promotion p = new Promotion(
            promoId,
            storeId,
            request.name(),
            request.description(),
            request.type(),
            PromotionStatus.ACTIVE,
            request.value(),
            "INR",
            request.minimumOrderValue() != null ? request.minimumOrderValue() : BigDecimal.ZERO,
            request.maximumDiscount(),
            request.startsAt() != null ? request.startsAt() : Instant.now(),
            request.endsAt(),
            request.usageLimit(),
            request.perCustomerLimit() != null ? request.perCustomerLimit() : 1
        );

        if (request.eligibleCategoryIds() != null) p.setEligibleCategoryIds(request.eligibleCategoryIds());
        if (request.eligibleProductIds() != null) p.setEligibleProductIds(request.eligibleProductIds());

        promotionRepository.save(p);

        String couponCode = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            couponCode = request.couponCode().trim().toUpperCase();
            Coupon c = new Coupon(
                "coup_" + System.currentTimeMillis(),
                promoId,
                storeId,
                couponCode,
                request.usageLimit(),
                request.perCustomerLimit(),
                p.getStartsAt(),
                p.getEndsAt()
            );
            couponRepository.save(c);
        }

        log.info("Created promotion: {} with coupon: {} for store: {}", promoId, couponCode, storeId);
        return PromotionResponse.fromDomain(p, couponCode);
    }

    public PromotionResponse togglePromotionStatus(String promotionId, String storeId, PromotionStatus newStatus) {
        Promotion p = promotionRepository.findById(promotionId)
            .orElseThrow(() -> new ResourceNotFoundException("Promotion not found: " + promotionId));

        if (!p.getStoreId().equals(storeId)) {
            throw new ValidationException("Promotion does not belong to your store.");
        }

        p.setStatus(newStatus);
        p.setUpdatedAt(Instant.now());
        promotionRepository.save(p);

        String code = couponRepository.findByPromotionId(p.getId()).map(Coupon::getCode).orElse(null);
        return PromotionResponse.fromDomain(p, code);
    }

    public PromotionCalculationResult validateAndCalculate(PromotionValidateRequest request) {
        if (request.code() == null || request.code().isBlank()) {
            return new PromotionCalculationResult(false, "Coupon code is required.", null, null, BigDecimal.ZERO, request.subtotal(), request.subtotal(), false);
        }

        String normCode = request.code().trim().toUpperCase();
        Optional<Coupon> couponOpt = couponRepository.findByStoreIdAndCode(request.storeId(), normCode);
        if (couponOpt.isEmpty()) {
            return new PromotionCalculationResult(false, "Coupon code '" + normCode + "' is invalid or does not exist for this store.", null, normCode, BigDecimal.ZERO, request.subtotal(), request.subtotal(), false);
        }

        Coupon coupon = couponOpt.get();
        Promotion promotion = promotionRepository.findById(coupon.getPromotionId())
            .orElseThrow(() -> new ResourceNotFoundException("Associated promotion not found."));

        Instant now = Instant.now();
        if (promotion.getStatus() != PromotionStatus.ACTIVE) {
            return new PromotionCalculationResult(false, "This promotion is currently inactive.", promotion.getId(), normCode, BigDecimal.ZERO, request.subtotal(), request.subtotal(), false);
        }

        if (promotion.getStartsAt() != null && now.isBefore(promotion.getStartsAt())) {
            return new PromotionCalculationResult(false, "This promotion has not started yet.", promotion.getId(), normCode, BigDecimal.ZERO, request.subtotal(), request.subtotal(), false);
        }

        if (promotion.getEndsAt() != null && now.isAfter(promotion.getEndsAt())) {
            return new PromotionCalculationResult(false, "This promotion has expired.", promotion.getId(), normCode, BigDecimal.ZERO, request.subtotal(), request.subtotal(), false);
        }

        if (promotion.getUsageLimit() != null && promotion.getUsageCount() >= promotion.getUsageLimit()) {
            return new PromotionCalculationResult(false, "This promotion has reached its maximum total usage limit.", promotion.getId(), normCode, BigDecimal.ZERO, request.subtotal(), request.subtotal(), false);
        }

        BigDecimal subtotal = request.subtotal() != null ? request.subtotal() : BigDecimal.ZERO;
        if (promotion.getMinimumOrderValue() != null && subtotal.compareTo(promotion.getMinimumOrderValue()) < 0) {
            return new PromotionCalculationResult(
                false,
                "Minimum purchase of ?" + promotion.getMinimumOrderValue().toPlainString() + " required to use this coupon.",
                promotion.getId(),
                normCode,
                BigDecimal.ZERO,
                subtotal,
                subtotal,
                false
            );
        }

        BigDecimal discount = BigDecimal.ZERO;
        boolean freeDelivery = false;

        if (promotion.getType() == PromotionType.PERCENTAGE_DISCOUNT) {
            BigDecimal pct = promotion.getValue().divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            discount = subtotal.multiply(pct).setScale(2, RoundingMode.HALF_UP);
            if (promotion.getMaximumDiscount() != null && discount.compareTo(promotion.getMaximumDiscount()) > 0) {
                discount = promotion.getMaximumDiscount();
            }
        } else if (promotion.getType() == PromotionType.FIXED_DISCOUNT) {
            discount = promotion.getValue().min(subtotal);
        } else if (promotion.getType() == PromotionType.FREE_DELIVERY) {
            freeDelivery = true;
        }

        BigDecimal finalSubtotal = subtotal.subtract(discount).max(BigDecimal.ZERO);

        return new PromotionCalculationResult(
            true,
            "Coupon applied successfully! Savings of ?" + discount.toPlainString(),
            promotion.getId(),
            normCode,
            discount,
            subtotal,
            finalSubtotal,
            freeDelivery
        );
    }

    public synchronized void recordUsage(String promotionId, String couponCode) {
        if (promotionId != null) {
            promotionRepository.findById(promotionId).ifPresent(p -> {
                p.setUsageCount(p.getUsageCount() + 1);
                promotionRepository.save(p);
            });
        }
        if (couponCode != null) {
            String norm = couponCode.trim().toUpperCase();
            couponRepository.findAll().stream()
                .filter(c -> norm.equals(c.getCode()))
                .findFirst()
                .ifPresent(c -> {
                    c.setUsageCount(c.getUsageCount() + 1);
                    couponRepository.save(c);
                });
        }
    }
}
