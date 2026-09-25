package com.bhagya.commerce.payment.service;

import com.bhagya.commerce.payment.domain.Payment;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;

public interface PaymentProvider {
    PaymentSessionResponse createGatewayOrder(Payment payment);
    boolean verifySignature(PaymentVerifyRequest request);
}
