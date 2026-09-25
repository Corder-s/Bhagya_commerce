package com.bhagya.commerce.marketing.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;

public record PromotionValidateRequest(
    String storeId,
    @NotBlank(message = "Coupon code is required")
    String code,
    BigDecimal subtotal,
    String customerId,
    List<String> productIds,
    List<String> categoryIds
) {}
