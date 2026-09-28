package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.RewardType;
import java.math.BigDecimal;
import java.time.Instant;

public record RewardCreateRequest(
    String name,
    String description,
    RewardType type,
    int pointsCost,
    BigDecimal value,
    BigDecimal minimumOrderValue,
    BigDecimal maximumDiscount,
    Integer usageLimit,
    Integer perCustomerLimit,
    Instant startsAt,
    Instant endsAt,
    Boolean enabled
) {}
