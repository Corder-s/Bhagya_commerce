package com.bhagya.commerce.payment.service;

import com.bhagya.commerce.payment.domain.Payment;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.dto.RefundResponse;
import java.math.BigDecimal;

public interface PaymentProvider {
    String getProviderName();
    PaymentSessionResponse createGatewayOrder(Payment payment);
    boolean verifySignature(PaymentVerifyRequest request);
    boolean verifyWebhookSignature(String rawPayload, String signature);
    RefundResponse refundPayment(String gatewayPaymentId, BigDecimal amount, String reason, String idempotencyKey);
}
