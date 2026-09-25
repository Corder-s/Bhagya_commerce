package com.bhagya.commerce.marketing.dto;

import com.bhagya.commerce.marketing.domain.Promotion;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.domain.PromotionType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PromotionResponse(
    String id,
    String storeId,
    String name,
    String description,
    PromotionType type,
    PromotionStatus status,
    BigDecimal value,
    String currency,
    BigDecimal minimumOrderValue,
    BigDecimal maximumDiscount,
    String couponCode,
    Instant startsAt,
    Instant endsAt,
    Integer usageLimit,
    Integer perCustomerLimit,
    int usageCount,
    List<String> eligibleCategoryIds,
    List<String> eligibleProductIds,
    Instant createdAt
) {
    public static PromotionResponse fromDomain(Promotion p, String couponCode) {
        return new PromotionResponse(
            p.getId(),
            p.getStoreId(),
            p.getName(),
            p.getDescription(),
            p.getType(),
            p.getStatus(),
            p.getValue(),
            p.getCurrency(),
            p.getMinimumOrderValue(),
            p.getMaximumDiscount(),
            couponCode,
            p.getStartsAt(),
            p.getEndsAt(),
            p.getUsageLimit(),
            p.getPerCustomerLimit(),
            p.getUsageCount(),
            p.getEligibleCategoryIds(),
            p.getEligibleProductIds(),
            p.getCreatedAt()
        );
    }
}
