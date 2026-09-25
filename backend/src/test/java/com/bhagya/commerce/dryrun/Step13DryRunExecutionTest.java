package com.bhagya.commerce.dryrun;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.auth.dto.AuthResponse;
import com.bhagya.commerce.auth.dto.LoginRequest;
import com.bhagya.commerce.auth.service.AuthService;
import com.bhagya.commerce.catalog.category.repository.InMemoryCategoryRepository;
import com.bhagya.commerce.catalog.product.dto.ProductCreateRequest;
import com.bhagya.commerce.catalog.product.repository.InMemoryProductRepository;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.queue.JobMessage;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.queue.JobType;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.common.redis.IdempotencyService;
import com.bhagya.commerce.common.security.JwtTokenProvider;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.merchant.dto.MerchantDashboardOverviewResponse;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.notification.channel.MockEmailProvider;
import com.bhagya.commerce.notification.channel.MockSmsProvider;
import com.bhagya.commerce.notification.channel.MockWhatsAppProvider;
import com.bhagya.commerce.notification.dto.NotificationResponse;
import com.bhagya.commerce.notification.repository.InMemoryNotificationRepository;
import com.bhagya.commerce.notification.service.NotificationOrchestrator;
import com.bhagya.commerce.notification.service.NotificationService;
import com.bhagya.commerce.notification.worker.NotificationJobWorker;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.repository.InMemoryOrderRepository;
import com.bhagya.commerce.order.service.OrderService;
import com.bhagya.commerce.organization.repository.InMemoryOrganizationRepository;
import com.bhagya.commerce.payment.config.PaymentProperties;
import com.bhagya.commerce.payment.domain.PaymentMethod;
import com.bhagya.commerce.payment.domain.PaymentStatus;
import com.bhagya.commerce.payment.dto.PaymentResponse;
import com.bhagya.commerce.payment.dto.PaymentSessionRequest;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.dto.RefundRequest;
import com.bhagya.commerce.payment.dto.RefundResponse;
import com.bhagya.commerce.payment.provider.RazorpayPaymentProvider;
import com.bhagya.commerce.payment.service.PaymentService;
import com.bhagya.commerce.payment.util.PaymentSignatureUtil;
import com.bhagya.commerce.store.repository.InMemoryStoreRepository;
import com.bhagya.commerce.store.service.StoreService;
import com.bhagya.commerce.user.repository.InMemoryUserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Step13DryRunExecutionTest {

    private InMemoryOrderRepository orderRepository;
    private InventoryService inventoryService;
    private PaymentService paymentService;
    private NotificationService notificationService;
    private NotificationOrchestrator notificationOrchestrator;
    private JobQueue jobQueue;
    private NotificationJobWorker notificationWorker;
    private IdempotencyService idempotencyService;
    private CacheService cacheService;
    private RazorpayPaymentProvider razorpayProvider;
    private AuthService authService;
    private MerchantService merchantService;
    private ProductService productService;

    private final String webhookSecret = "bhagya_webhook_secret_2026";
    private final String keySecret = "bhagya_key_secret_2026";

    @BeforeEach
    void setUp() {
        orderRepository = new InMemoryOrderRepository();
        inventoryService = new InventoryService(null);
        cacheService = new CacheService(null);
        idempotencyService = new IdempotencyService(cacheService);
        jobQueue = new JobQueue(null);

        notificationService = new NotificationService(new InMemoryNotificationRepository());
        notificationOrchestrator = new NotificationOrchestrator(notificationService, jobQueue);

        PaymentProperties paymentProperties = new PaymentProperties();
        paymentProperties.setKeyId("rzp_test_key_123");
        paymentProperties.setKeySecret(keySecret);
        paymentProperties.setWebhookSecret(webhookSecret);
        razorpayProvider = new RazorpayPaymentProvider(paymentProperties);

        paymentService = new PaymentService(
            orderRepository,
            razorpayProvider,
            inventoryService,
            notificationOrchestrator,
            idempotencyService
        );

        notificationWorker = new NotificationJobWorker(
            jobQueue,
            new MockEmailProvider(),
            new MockWhatsAppProvider(),
            new MockSmsProvider()
        );

        authService = new AuthService(
            new InMemoryUserRepository(),
            new BCryptPasswordEncoder(),
            new JwtTokenProvider("BhagyaCommerceSuperSecureProductionJwtSecretKey2026MustBeAtLeast256BitsLong!", 86400000L, 604800000L)
        );

        InMemoryOrganizationRepository orgRepo = new InMemoryOrganizationRepository();
        InMemoryStoreRepository storeRepo = new InMemoryStoreRepository();
        StoreService storeService = new StoreService(storeRepo, orgRepo);
        productService = new ProductService(new InMemoryProductRepository(), storeRepo, orgRepo, cacheService);
        OrderService orderService = new OrderService(orderRepository, inventoryService);

        merchantService = new MerchantService(orgRepo, storeRepo, storeService, productService, orderService);
    }

    @Test
    @DisplayName("[PAYMENT - SUCCESS] Online Payment Success Flow")
    void testOnlinePaymentSuccess() {
        // 1. Order ord_101 exists with totalAmount = ₹12,499
        Order order = orderRepository.findById("ord_101").orElseThrow();
        assertEquals(BigDecimal.valueOf(12499), order.getTotalAmount());

        // 2. Create Payment Session
        PaymentSessionRequest sessionReq = new PaymentSessionRequest(order.getId(), BigDecimal.valueOf(12499), PaymentMethod.UPI);
        PaymentSessionResponse session = paymentService.createPaymentSession(sessionReq, "idem_session_1");
        assertNotNull(session);
        assertNotNull(session.gatewayOrderId());

        // 3. Verify Payment with HMAC-SHA256 signature
        String validSig = PaymentSignatureUtil.calculateHmacSha256(session.gatewayOrderId() + "|pay_rzp_success_1", keySecret);
        PaymentVerifyRequest verifyReq = new PaymentVerifyRequest(session.paymentId(), "pay_rzp_success_1", session.gatewayOrderId(), validSig);
        PaymentResponse response = paymentService.verifyPayment(verifyReq);

        assertEquals(PaymentStatus.CAPTURED, response.status());

        // 4. Verify Order updated
        Order updatedOrder = orderRepository.findById("ord_101").orElseThrow();
        assertEquals(OrderStatus.CONFIRMED, updatedOrder.getStatus());
        assertEquals("PAID", updatedOrder.getPaymentStatus());

        // 5. Verify Notifications in-app & job queue
        List<NotificationResponse> notifs = notificationService.getNotificationsForUser(order.getUserId());
        assertTrue(notifs.stream().anyMatch(n -> n.title().contains("Order Confirmed")));
        assertTrue(jobQueue.size() >= 3); // Email, WhatsApp, SMS
    }

    @Test
    @DisplayName("[PAYMENT - FAILED] Online Payment Failure Handling")
    void testPaymentFailure() {
        Order order = orderRepository.findById("ord_101").orElseThrow();
        PaymentSessionRequest sessionReq = new PaymentSessionRequest(order.getId(), BigDecimal.valueOf(12499), PaymentMethod.CARD);
        PaymentSessionResponse session = paymentService.createPaymentSession(sessionReq, "idem_session_failed");

        // Attempt verification with forged signature
        PaymentVerifyRequest verifyReq = new PaymentVerifyRequest(session.paymentId(), "pay_rzp_fail_1", session.gatewayOrderId(), "forged_invalid_signature");
        assertThrows(UnauthorizedException.class, () -> paymentService.verifyPayment(verifyReq));

        // Payment status must be FAILED, order must NOT be marked PAID
        PaymentResponse payment = paymentService.getPayment(session.paymentId());
        assertEquals(PaymentStatus.FAILED, payment.status());
    }

    @Test
    @DisplayName("[PAYMENT - WRONG AMOUNT] Server-Side Amount Validation Rejection")
    void testWrongAmountRejected() {
        Order order = orderRepository.findById("ord_101").orElseThrow();
        // Client attempts to send ₹1 instead of authoritative ₹12,499
        PaymentSessionRequest invalidAmountReq = new PaymentSessionRequest(order.getId(), BigDecimal.valueOf(1), PaymentMethod.UPI);

        assertThrows(ValidationException.class, () -> {
            paymentService.createPaymentSession(invalidAmountReq, "idem_wrong_amount");
        });
    }

    @Test
    @DisplayName("[PAYMENT - DUPLICATE REQUEST] Idempotency Key Deduplication")
    void testDuplicatePaymentSessionIdempotency() {
        Order order = orderRepository.findById("ord_101").orElseThrow();
        PaymentSessionRequest req = new PaymentSessionRequest(order.getId(), BigDecimal.valueOf(12499), PaymentMethod.NETBANKING);

        PaymentSessionResponse res1 = paymentService.createPaymentSession(req, "idem_unique_key_777");
        PaymentSessionResponse res2 = paymentService.createPaymentSession(req, "idem_unique_key_777");

        assertEquals(res1.paymentId(), res2.paymentId());
        assertEquals(res1.gatewayOrderId(), res2.gatewayOrderId());
    }

    @Test
    @DisplayName("[PAYMENT - WEBHOOK IDEMPOTENCY] Replay duplicate webhooks safely")
    void testWebhookDuplicateIdempotency() {
        String rawBody = "{\"event\":\"payment.captured\",\"id\":\"evt_webhook_dedup_101\",\"payload\":{\"payment\":{\"entity\":{\"id\":\"pay_123\",\"notes\":{\"paymentId\":\"pay_test\"}}}}}";
        String validSig = PaymentSignatureUtil.calculateHmacSha256(rawBody, webhookSecret);

        // First delivery: processes
        paymentService.handleWebhook(validSig, rawBody);

        // Replay delivery: processed idempotently without exception
        paymentService.handleWebhook(validSig, rawBody);
    }

    @Test
    @DisplayName("[PAYMENT - INVALID WEBHOOK] Rejection of unverified signature")
    void testInvalidWebhookRejected() {
        String rawBody = "{\"event\":\"payment.captured\",\"id\":\"evt_forged_999\"}";
        assertThrows(UnauthorizedException.class, () -> {
            paymentService.handleWebhook("invalid_signature_string", rawBody);
        });
    }

    @Test
    @DisplayName("[PAYMENT - REFUND] Process Refund on Captured Payment")
    void testPaymentRefund() {
        // Prepare captured payment
        Order order = orderRepository.findById("ord_101").orElseThrow();
        PaymentSessionRequest sessionReq = new PaymentSessionRequest(order.getId(), BigDecimal.valueOf(12499), PaymentMethod.UPI);
        PaymentSessionResponse session = paymentService.createPaymentSession(sessionReq, "idem_session_refund");
        String validSig = PaymentSignatureUtil.calculateHmacSha256(session.gatewayOrderId() + "|pay_rzp_ref_1", keySecret);
        paymentService.verifyPayment(new PaymentVerifyRequest(session.paymentId(), "pay_rzp_ref_1", session.gatewayOrderId(), validSig));

        // Execute refund
        RefundRequest refundReq = new RefundRequest(BigDecimal.valueOf(12499), "Customer cancelled handloom order");
        RefundResponse refundRes = paymentService.refundPayment(session.paymentId(), refundReq, "usr_admin", "idem_refund_1");

        assertNotNull(refundRes);
        assertEquals("PROCESSED", refundRes.status());
        assertEquals(PaymentStatus.REFUNDED, paymentService.getPayment(session.paymentId()).status());
        assertEquals(OrderStatus.REFUNDED, orderRepository.findById("ord_101").orElseThrow().getStatus());
    }

    @Test
    @DisplayName("[NOTIFICATIONS - PIPELINE & WORKER] Multi-channel consumption and delivery")
    void testNotificationQueueAndWorker() {
        notificationOrchestrator.handleOrderConfirmed(
            "usr_cust_1",
            "Aarav Sharma",
            "aarav@example.com",
            "+919876543210",
            "BG-20260926-991102",
            BigDecimal.valueOf(12499)
        );

        assertEquals(3, jobQueue.size());

        // Worker consumes all 3 queued jobs
        notificationWorker.processNextJob();
        notificationWorker.processNextJob();
        notificationWorker.processNextJob();

        assertEquals(0, jobQueue.size());
    }

    @Test
    @DisplayName("[SECURITY - CUSTOMER ISOLATION] Customer A cannot access Customer B orders")
    void testCustomerIsolation() {
        OrderService orderService = new OrderService(orderRepository, inventoryService);

        // ord_101 belongs to usr_cust_1
        OrderResponse ownOrder = orderService.getOrderById("ord_101", "usr_cust_1");
        assertNotNull(ownOrder);

        // Attacker customer usr_cust_attacker is forbidden
        assertThrows(ForbiddenException.class, () -> {
            orderService.getOrderById("ord_101", "usr_cust_attacker");
        });
    }

    @Test
    @DisplayName("[SECURITY - MERCHANT ISOLATION] Merchant A cannot access foreign Store data")
    void testMerchantIsolation() {
        // usr_merch_1 belongs to org_1
        MerchantDashboardOverviewResponse overview = merchantService.getDashboardOverview("usr_merch_1");
        assertNotNull(overview);

        // Non-merchant customer usr_cust_1 is forbidden
        assertThrows(ForbiddenException.class, () -> {
            merchantService.getDashboardOverview("usr_cust_1");
        });
    }

    @Test
    @DisplayName("[INVENTORY - CONCURRENCY] Anti-overselling stock reservation and commit")
    void testInventoryAntiOverselling() {
        assertTrue(inventoryService.checkAvailability("prod_1", 10));
        assertTrue(inventoryService.reserveInventory("prod_1", 10));
        inventoryService.commitInventory("prod_1", 10);

        // Out of stock case
        inventoryService.reserveInventory("prod_4", 15);
        assertFalse(inventoryService.reserveInventory("prod_4", 1)); // Cannot oversell
    }
}
