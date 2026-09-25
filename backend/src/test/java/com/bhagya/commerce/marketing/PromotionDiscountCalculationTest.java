package com.bhagya.commerce.marketing;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.marketing.domain.PromotionType;
import com.bhagya.commerce.marketing.dto.PromotionCalculationResult;
import com.bhagya.commerce.marketing.dto.PromotionCreateRequest;
import com.bhagya.commerce.marketing.dto.PromotionValidateRequest;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import com.bhagya.commerce.marketing.service.PromotionService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PromotionDiscountCalculationTest {

    private PromotionService promotionService;
    private final String storeId = "store_test_mktg";

    @BeforeEach
    void setUp() {
        PromotionRepository promotionRepository = new PromotionRepository();
        CouponRepository couponRepository = new CouponRepository();
        promotionService = new PromotionService(promotionRepository, couponRepository);
    }

    @Test
    @DisplayName("Should correctly calculate percentage discount with maximum cap")
    void testPercentageDiscountWithCap() {
        // 20% off on min spend ?1000, capped at ?500
        promotionService.createPromotion(storeId, new PromotionCreateRequest(
            "Festive 20",
            "20% off",
            PromotionType.PERCENTAGE_DISCOUNT,
            new BigDecimal("20.00"),
            new BigDecimal("1000.00"),
            new BigDecimal("500.00"),
            "FESTIVE20",
            Instant.now().minus(1, ChronoUnit.DAYS),
            Instant.now().plus(10, ChronoUnit.DAYS),
            100,
            1,
            Collections.emptyList(),
            Collections.emptyList()
        ));

        // Subtotal = ?4000 -> 20% is ?800, but capped at ?500
        PromotionCalculationResult res = promotionService.validateAndCalculate(new PromotionValidateRequest(
            storeId,
            "festive20", // Test case-insensitivity
            new BigDecimal("4000.00"),
            "usr_1",
            Collections.emptyList(),
            Collections.emptyList()
        ));

        assertTrue(res.valid());
        assertEquals(new BigDecimal("500.00"), res.discountAmount());
        assertEquals(new BigDecimal("3500.00"), res.finalSubtotal());
    }

    @Test
    @DisplayName("Should reject coupon when subtotal does not meet minimum order value")
    void testMinimumOrderRequirement() {
        promotionService.createPromotion(storeId, new PromotionCreateRequest(
            "VIP Flat 1000",
            "Flat 1000 off",
            PromotionType.FIXED_DISCOUNT,
            new BigDecimal("1000.00"),
            new BigDecimal("5000.00"),
            null,
            "VIP1000",
            Instant.now().minus(1, ChronoUnit.DAYS),
            Instant.now().plus(10, ChronoUnit.DAYS),
            100,
            1,
            Collections.emptyList(),
            Collections.emptyList()
        ));

        // Subtotal = ?3500 < ?5000 required
        PromotionCalculationResult res = promotionService.validateAndCalculate(new PromotionValidateRequest(
            storeId,
            "VIP1000",
            new BigDecimal("3500.00"),
            "usr_1",
            Collections.emptyList(),
            Collections.emptyList()
        ));

        assertFalse(res.valid());
        assertTrue(res.message().contains("Minimum purchase"));
        assertEquals(BigDecimal.ZERO, res.discountAmount());
    }
}
