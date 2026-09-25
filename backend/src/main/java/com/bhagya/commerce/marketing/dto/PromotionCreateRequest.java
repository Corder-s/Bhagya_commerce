package com.bhagya.commerce.marketing.dto;

import com.bhagya.commerce.marketing.domain.PromotionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PromotionCreateRequest(
    @NotBlank(message = "Promotion name is required")
    String name,
    String description,
    @NotNull(message = "Promotion type is required")
    PromotionType type,
    @NotNull(message = "Discount value is required")
    BigDecimal value,
    BigDecimal minimumOrderValue,
    BigDecimal maximumDiscount,
    String couponCode,
    Instant startsAt,
    Instant endsAt,
    Integer usageLimit,
    Integer perCustomerLimit,
    List<String> eligibleCategoryIds,
    List<String> eligibleProductIds
) {}
