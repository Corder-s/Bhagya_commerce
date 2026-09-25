package com.bhagya.commerce.payment;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.payment.config.PaymentProperties;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.provider.RazorpayPaymentProvider;
import com.bhagya.commerce.payment.util.PaymentSignatureUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class RazorpaySignatureTest {

    private RazorpayPaymentProvider provider;
    private final String testSecret = "bhagya_test_secret_key_2026";

    @BeforeEach
    void setUp() {
        PaymentProperties properties = new PaymentProperties();
        properties.setKeyId("rzp_test_123");
        properties.setKeySecret(testSecret);
        properties.setWebhookSecret("bhagya_webhook_secret_2026");
        provider = new RazorpayPaymentProvider(properties);
    }

    @Test
    @DisplayName("Should verify valid Razorpay order|payment signature")
    void testValidRazorpaySignature() {
        String orderId = "order_rzp_994821";
        String paymentId = "pay_rzp_112233";
        String payload = orderId + "|" + paymentId;
        String validSignature = PaymentSignatureUtil.calculateHmacSha256(payload, testSecret);

        PaymentVerifyRequest request = new PaymentVerifyRequest("pay_internal_1", paymentId, orderId, validSignature);
        assertTrue(provider.verifySignature(request));
    }

    @Test
    @DisplayName("Should reject tampered Razorpay signature")
    void testTamperedSignatureRejected() {
        PaymentVerifyRequest request = new PaymentVerifyRequest("pay_internal_1", "pay_rzp_112233", "order_rzp_994821", "invalid_forged_signature");
        assertFalse(provider.verifySignature(request));
    }

    @Test
    @DisplayName("Should verify valid webhook HMAC-SHA256 signature")
    void testValidWebhookSignature() {
        String rawBody = "{\"event\":\"payment.captured\",\"id\":\"evt_101\"}";
        String validWebhookSig = PaymentSignatureUtil.calculateHmacSha256(rawBody, "bhagya_webhook_secret_2026");

        assertTrue(provider.verifyWebhookSignature(rawBody, validWebhookSig));
        assertFalse(provider.verifyWebhookSignature(rawBody, "forged_signature"));
    }
}
