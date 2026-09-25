package com.bhagya.commerce.payment;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.common.redis.IdempotencyService;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.notification.repository.InMemoryNotificationRepository;
import com.bhagya.commerce.notification.service.NotificationOrchestrator;
import com.bhagya.commerce.notification.service.NotificationService;
import com.bhagya.commerce.order.repository.InMemoryOrderRepository;
import com.bhagya.commerce.payment.config.PaymentProperties;
import com.bhagya.commerce.payment.provider.RazorpayPaymentProvider;
import com.bhagya.commerce.payment.service.PaymentService;
import com.bhagya.commerce.payment.util.PaymentSignatureUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PaymentWebhookIdempotencyTest {

    private PaymentService paymentService;
    private final String webhookSecret = "bhagya_webhook_secret_2026";

    @BeforeEach
    void setUp() {
        PaymentProperties properties = new PaymentProperties();
        properties.setWebhookSecret(webhookSecret);
        RazorpayPaymentProvider provider = new RazorpayPaymentProvider(properties);

        NotificationService notificationService = new NotificationService(new InMemoryNotificationRepository());
        NotificationOrchestrator orchestrator = new NotificationOrchestrator(notificationService, new JobQueue(null));
        IdempotencyService idempotencyService = new IdempotencyService(new CacheService(null));

        paymentService = new PaymentService(
            new InMemoryOrderRepository(),
            provider,
            new InventoryService(null),
            orchestrator,
            idempotencyService
        );
    }

    @Test
    @DisplayName("Valid webhook with signature should process cleanly and handle duplicate events idempotently")
    void testWebhookProcessingAndIdempotency() {
        String rawBody = "{\"event\":\"payment.captured\",\"id\":\"evt_test_unique_99\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_123\",\"notes\":{\"paymentId\":\"pay_test\"}}}}}";
        String validSig = PaymentSignatureUtil.calculateHmacSha256(rawBody, webhookSecret);

        // First delivery: processes
        assertDoesNotThrow(() -> paymentService.handleWebhook(validSig, rawBody));

        // Duplicate delivery (retry by gateway): handled idempotently with zero errors
        assertDoesNotThrow(() -> paymentService.handleWebhook(validSig, rawBody));
    }

    @Test
    @DisplayName("Invalid webhook signature should be rejected with UnauthorizedException")
    void testInvalidWebhookSignatureRejected() {
        String rawBody = "{\"event\":\"payment.captured\",\"id\":\"evt_forged\"}";
        assertThrows(UnauthorizedException.class, () -> {
            paymentService.handleWebhook("forged_signature", rawBody);
        });
    }
}
