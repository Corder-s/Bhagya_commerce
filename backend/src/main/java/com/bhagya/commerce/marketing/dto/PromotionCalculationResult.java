package com.bhagya.commerce.marketing.dto;

import java.math.BigDecimal;

public record PromotionCalculationResult(
    boolean valid,
    String message,
    String promotionId,
    String couponCode,
    BigDecimal discountAmount,
    BigDecimal subtotal,
    BigDecimal finalSubtotal,
    boolean freeDelivery
) {}
