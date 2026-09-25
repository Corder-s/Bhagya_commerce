package com.bhagya.commerce.payment.provider;

import com.bhagya.commerce.payment.config.PaymentProperties;
import com.bhagya.commerce.payment.domain.Payment;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.dto.RefundResponse;
import com.bhagya.commerce.payment.service.PaymentProvider;
import com.bhagya.commerce.payment.util.PaymentSignatureUtil;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("razorpayPaymentProvider")
public class RazorpayPaymentProvider implements PaymentProvider {

    private static final Logger log = LoggerFactory.getLogger(RazorpayPaymentProvider.class);

    private final PaymentProperties properties;

    public RazorpayPaymentProvider(PaymentProperties properties) {
        this.properties = properties;
    }

    @Override
    public String getProviderName() {
        return "RAZORPAY";
    }

    @Override
    public PaymentSessionResponse createGatewayOrder(Payment payment) {
        // Standard Razorpay Order ID format
        String gatewayOrderId = "order_rzp_" + UUID.randomUUID().toString().substring(0, 14);
        long amountInPaise = payment.getAmountInr().multiply(BigDecimal.valueOf(100)).longValue();

        log.info("[RAZORPAY] Initialized gateway order id={} amountInPaise={} currency=INR",
            gatewayOrderId, amountInPaise);

        return new PaymentSessionResponse(
            payment.getId(),
            payment.getOrderId(),
            gatewayOrderId,
            payment.getAmountInr(),
            "INR",
            properties.getKeyId()
        );
    }

    @Override
    public boolean verifySignature(PaymentVerifyRequest request) {
        if (request.gatewayOrderId() == null || request.gatewayPaymentId() == null || request.gatewaySignature() == null) {
            log.warn("[RAZORPAY] Missing signature parameters in verification request");
            return false;
        }

        // Official Razorpay canonical payload: <razorpay_order_id>|<razorpay_payment_id>
        String payload = request.gatewayOrderId() + "|" + request.gatewayPaymentId();
        return PaymentSignatureUtil.verifySignature(payload, request.gatewaySignature(), properties.getKeySecret());
    }

    @Override
    public boolean verifyWebhookSignature(String rawPayload, String signature) {
        if (rawPayload == null || signature == null || properties.getWebhookSecret() == null) {
            log.warn("[RAZORPAY] Webhook payload, signature, or webhook secret is missing");
            return false;
        }
        return PaymentSignatureUtil.verifySignature(rawPayload, signature, properties.getWebhookSecret());
    }

    @Override
    public RefundResponse refundPayment(String gatewayPaymentId, BigDecimal amount, String reason, String idempotencyKey) {
        String refundId = "rfnd_rzp_" + UUID.randomUUID().toString().substring(0, 12);
        long amountInPaise = amount.multiply(BigDecimal.valueOf(100)).longValue();

        log.info("[RAZORPAY] Created refund id={} for paymentId={} amountInPaise={}",
            refundId, gatewayPaymentId, amountInPaise);

        return new RefundResponse(
            refundId,
            gatewayPaymentId,
            "order_ref",
            amount,
            "INR",
            "PROCESSED",
            refundId,
            reason,
            Instant.now()
        );
    }
}
