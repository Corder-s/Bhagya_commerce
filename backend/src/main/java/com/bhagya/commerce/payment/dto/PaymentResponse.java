package com.bhagya.commerce.payment.dto;

import com.bhagya.commerce.payment.domain.PaymentMethod;
import com.bhagya.commerce.payment.domain.PaymentStatus;
import java.math.BigDecimal;
import java.time.Instant;

public record PaymentResponse(
    String id,
    String orderId,
    BigDecimal amountInr,
    PaymentMethod method,
    PaymentStatus status,
    String gatewayTransactionId,
    Instant createdAt
) {}
