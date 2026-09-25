package com.bhagya.commerce.payment.dto;

import com.bhagya.commerce.payment.domain.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PaymentSessionRequest(
    @NotBlank(message = "Order ID is required")
    String orderId,

    @NotNull(message = "Payment method is required")
    PaymentMethod method,

    @NotNull(message = "Amount is required")
    BigDecimal amountInr
) {}
