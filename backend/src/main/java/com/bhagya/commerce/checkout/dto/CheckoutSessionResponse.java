package com.bhagya.commerce.checkout.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record CheckoutSessionResponse(
    String sessionId,
    String orderId,
    String orderNumber,
    BigDecimal totalAmountInr,
    String currency,
    Instant expiresAt
) {}
