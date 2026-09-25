package com.bhagya.commerce.merchant.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record MerchantCustomerResponse(
    String id,
    String fullName,
    String email,
    String phone,
    String city,
    int orderCount,
    BigDecimal totalSpent,
    Instant lastOrderAt
) {}
