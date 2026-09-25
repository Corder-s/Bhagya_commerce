package com.bhagya.commerce.payment.provider;

import com.bhagya.commerce.payment.domain.Payment;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.dto.RefundResponse;
import com.bhagya.commerce.payment.service.PaymentProvider;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("mockPaymentProvider")
public class MockPaymentProvider implements PaymentProvider {

    private static final Logger log = LoggerFactory.getLogger(MockPaymentProvider.class);

    @Override
    public String getProviderName() {
        return "MOCK";
    }

    @Override
    public PaymentSessionResponse createGatewayOrder(Payment payment) {
        String gatewayOrderId = "order_mock_" + UUID.randomUUID().toString().substring(0, 12);
        log.info("[MOCK_PAYMENT] Created mock order gatewayOrderId={} for orderId={}", gatewayOrderId, payment.getOrderId());
        return new PaymentSessionResponse(
            payment.getId(),
            payment.getOrderId(),
            gatewayOrderId,
            payment.getAmountInr(),
            "INR",
            "mock_key_bhagya_2026"
        );
    }

    @Override
    public boolean verifySignature(PaymentVerifyRequest request) {
        log.info("[MOCK_PAYMENT] Verified client signature for paymentId={}", request.paymentId());
        return request.gatewayPaymentId() != null && !request.gatewayPaymentId().isBlank();
    }

    @Override
    public boolean verifyWebhookSignature(String rawPayload, String signature) {
        log.info("[MOCK_PAYMENT] Verified webhook signature");
        return signature != null && !signature.isBlank();
    }

    @Override
    public RefundResponse refundPayment(String gatewayPaymentId, BigDecimal amount, String reason, String idempotencyKey) {
        String refundId = "rfnd_mock_" + UUID.randomUUID().toString().substring(0, 8);
        log.info("[MOCK_PAYMENT] Processed mock refund id={} for amount={}", refundId, amount);
        return new RefundResponse(
            refundId,
            "pay_ref",
            "ord_ref",
            amount,
            "INR",
            "PROCESSED",
            refundId,
            reason,
            Instant.now()
        );
    }
}
