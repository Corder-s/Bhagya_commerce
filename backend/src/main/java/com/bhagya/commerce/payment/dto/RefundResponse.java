package com.bhagya.commerce.payment.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record RefundResponse(
    String id,
    String paymentId,
    String orderId,
    BigDecimal amountInr,
    String currency,
    String status, // PENDING, PROCESSED, FAILED
    String providerRefundId,
    String reason,
    Instant createdAt
) {}
