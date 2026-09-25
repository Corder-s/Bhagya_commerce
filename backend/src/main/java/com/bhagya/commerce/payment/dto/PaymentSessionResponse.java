package com.bhagya.commerce.payment.dto;

import java.math.BigDecimal;

public record PaymentSessionResponse(
    String paymentId,
    String orderId,
    String gatewayOrderId,
    BigDecimal amountInr,
    String currency,
    String keyId
) {}
