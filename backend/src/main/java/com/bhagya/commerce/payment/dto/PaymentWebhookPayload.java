package com.bhagya.commerce.payment.dto;

public record PaymentWebhookPayload(
    String event,
    String paymentId,
    String orderId,
    String status,
    String signature
) {}
