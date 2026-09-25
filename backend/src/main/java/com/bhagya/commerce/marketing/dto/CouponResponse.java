package com.bhagya.commerce.marketing.dto;

import java.time.Instant;

public record CouponResponse(
    String id,
    String promotionId,
    String storeId,
    String code,
    Integer usageLimit,
    Integer perCustomerLimit,
    int usageCount,
    Instant startsAt,
    Instant endsAt,
    String status,
    Instant createdAt
) {}
