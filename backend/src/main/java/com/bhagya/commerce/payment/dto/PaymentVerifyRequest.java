package com.bhagya.commerce.payment.dto;

import jakarta.validation.constraints.NotBlank;

public record PaymentVerifyRequest(
    @NotBlank(message = "Payment ID is required")
    String paymentId,

    @NotBlank(message = "Order ID is required")
    String orderId,

    String gatewayOrderId,
    String gatewayPaymentId,
    String gatewaySignature
) {
    public PaymentVerifyRequest(String paymentId, String orderId, String gatewayPaymentId, String gatewaySignature) {
        this(paymentId, orderId, orderId, gatewayPaymentId, gatewaySignature);
    }
}
