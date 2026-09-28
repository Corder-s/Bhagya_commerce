package com.bhagya.commerce.e2e;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.common.redis.IdempotencyService;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.notification.service.NotificationOrchestrator;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.dto.OrderCreateRequest;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.order.service.OrderService;
import com.bhagya.commerce.payment.domain.PaymentMethod;
import com.bhagya.commerce.payment.domain.PaymentStatus;
import com.bhagya.commerce.payment.dto.PaymentResponse;
import com.bhagya.commerce.payment.dto.PaymentSessionRequest;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.dto.RefundRequest;
import com.bhagya.commerce.payment.dto.RefundResponse;
import com.bhagya.commerce.payment.provider.MockPaymentProvider;
import com.bhagya.commerce.payment.service.PaymentService;
import com.bhagya.commerce.shipping.domain.Fulfillment;
import com.bhagya.commerce.shipping.domain.FulfillmentStatus;
import com.bhagya.commerce.shipping.dto.FulfillmentActionRequest;
import com.bhagya.commerce.shipping.dto.ShippingWebhookPayload;
import com.bhagya.commerce.shipping.provider.ShippingProviderFactory;
import com.bhagya.commerce.shipping.repository.FulfillmentRepository;
import com.bhagya.commerce.shipping.repository.ShipmentRepository;
import com.bhagya.commerce.shipping.service.FulfillmentService;
import com.bhagya.commerce.shipping.service.ShippingService;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.user.domain.Address;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.domain.UserRole;
import com.bhagya.commerce.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class OrderLifecycleAndIdempotencyE2ETest {

    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private StoreRepository storeRepository;
    private UserRepository userRepository;
    private ShipmentRepository shipmentRepository;
    private FulfillmentRepository fulfillmentRepository;

    private CacheService cacheService;
    private IdempotencyService idempotencyService;
    private InventoryService inventoryService;
    private OrderService orderService;
    private PaymentService paymentService;
    private FulfillmentService fulfillmentService;
    private ShippingService shippingService;

    private User customer;
    private Store store;
    private Product brassLamp;

    private Address createAddress(String street, String city, String state, String pincode, String phone) {
        Address addr = new Address();
        addr.setId("addr_" + System.currentTimeMillis());
        addr.setName("Karan Brass Buyer");
        addr.setPhone(phone);
        addr.setAddressLine1(street);
        addr.setCity(city);
        addr.setState(state);
        addr.setPincode(pincode);
        return addr;
    }

    @BeforeEach
    void setUp() {
        orderRepository = new OrderRepository();
        productRepository = new ProductRepository();
        storeRepository = new StoreRepository();
        userRepository = new UserRepository();
        shipmentRepository = new ShipmentRepository();
        fulfillmentRepository = new FulfillmentRepository();

        cacheService = new CacheService(null);
        idempotencyService = new IdempotencyService(cacheService);
        inventoryService = new InventoryService();

        orderService = new OrderService(orderRepository, productRepository, storeRepository, userRepository, null);
        MockPaymentProvider paymentProvider = new MockPaymentProvider();
        paymentService = new PaymentService(
            orderRepository,
            paymentProvider,
            inventoryService,
            new NotificationOrchestrator(new com.bhagya.commerce.notification.service.NotificationService(new com.bhagya.commerce.notification.repository.InMemoryNotificationRepository()), new com.bhagya.commerce.common.queue.JobQueue(null)),
            idempotencyService,
            null
        );

        ShippingProviderFactory providerFactory = org.mockito.Mockito.mock(ShippingProviderFactory.class);
        org.mockito.Mockito.when(providerFactory.getProvider()).thenReturn(new com.bhagya.commerce.shipping.provider.MockShippingProvider());
        fulfillmentService = new FulfillmentService(fulfillmentRepository, shipmentRepository, orderRepository, providerFactory);
        shippingService = new ShippingService(orderRepository, shipmentRepository, providerFactory, cacheService, null, "test_shipping_secret");

        store = new Store("store_moradabad_brass", "org_moradabad", "Moradabad Artisans", "moradabad-brass", "support@moradabadbrass.in");
        storeRepository.save(store);

        customer = new User("usr_brass_buyer", "buyer@brasscrafts.in", "Karan Brass Buyer", "hash", UserRole.CUSTOMER);
        userRepository.save(customer);

        brassLamp = new Product("prod_brass_diya", store.getId(), "cat_brass", "Handcrafted Brass Diya", "brass-diya", new BigDecimal("1200.00"), 20);
        productRepository.save(brassLamp);
    }

    @Test
    @DisplayName("State Machine: Order transitions cleanly through full fulfillment lifecycle")
    void testOrderLifecycleTransitions() {
        Address addr = createAddress("45 Artisan Galli", "Moradabad", "Uttar Pradesh", "244001", "9898989898");
        OrderCreateRequest req = new OrderCreateRequest(
            store.getId(),
            addr,
            "ONLINE_PREPAID",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(brassLamp.getId(), 1))
        );

        OrderResponse order = orderService.createOrder(customer.getId(), req);
        assertEquals(OrderStatus.CONFIRMED, order.status());

        // Merchant starts processing
        fulfillmentService.handleAction(order.id(), store.getId(), new FulfillmentActionRequest("PROCESS", null, null, null, null, null));
        assertEquals(OrderStatus.PROCESSING, orderRepository.findById(order.id()).get().getStatus());

        // Merchant packs
        fulfillmentService.handleAction(order.id(), store.getId(), new FulfillmentActionRequest("PACK", null, null, new BigDecimal("0.8"), "15x15x10", "Foam wrapped"));
        Fulfillment f = fulfillmentRepository.findByOrderId(order.id()).orElseThrow();
        assertEquals(FulfillmentStatus.PACKED, f.getStatus());

        // Manifest shipment
        fulfillmentService.handleAction(order.id(), store.getId(), new FulfillmentActionRequest("CREATE_SHIPMENT", "BlueDart", null, new BigDecimal("0.8"), "15x15x10", null));
        assertEquals(FulfillmentStatus.READY_FOR_PICKUP, fulfillmentRepository.findByOrderId(order.id()).get().getStatus());

        // Courier hands over
        fulfillmentService.handleAction(order.id(), store.getId(), new FulfillmentActionRequest("SHIP", null, null, null, null, null));
        assertEquals(OrderStatus.SHIPPED, orderRepository.findById(order.id()).get().getStatus());

        // Out for Delivery
        String tracking = fulfillmentRepository.findByOrderId(order.id()).get().getTrackingNumber();
        shippingService.processWebhook(
            new ShippingWebhookPayload("ev_ofd", "OUT_FOR_DELIVERY", tracking, "BlueDart", "OUT_FOR_DELIVERY", "Hub 1", "Out with courier", Instant.now(), null, 1),
            "test_shipping_secret"
        );
        assertEquals(OrderStatus.OUT_FOR_DELIVERY, orderRepository.findById(order.id()).get().getStatus());

        // Delivered
        shippingService.processWebhook(
            new ShippingWebhookPayload("ev_deliv", "DELIVERED", tracking, "BlueDart", "DELIVERED", "Customer address", "Delivered", Instant.now(), null, 1),
            "test_shipping_secret"
        );
        assertEquals(OrderStatus.DELIVERED, orderRepository.findById(order.id()).get().getStatus());
    }

    @Test
    @DisplayName("Cancellation Rule: Shipped or Delivered order cannot be cancelled")
    void testCannotCancelShippedOrDeliveredOrder() {
        Address addr = createAddress("45 Artisan Galli", "Moradabad", "Uttar Pradesh", "244001", "9898989898");
        OrderCreateRequest req = new OrderCreateRequest(
            store.getId(),
            addr,
            "ONLINE_PREPAID",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(brassLamp.getId(), 1))
        );
        OrderResponse order = orderService.createOrder(customer.getId(), req);

        // Manually mark SHIPPED
        Order o = orderRepository.findById(order.id()).get();
        o.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(o);

        // Customer attempts cancellation -> MUST REJECT
        ValidationException ex = assertThrows(ValidationException.class, () -> {
            orderService.cancelOrder(order.id(), customer.getId(), "Changed my mind");
        });
        assertTrue(ex.getMessage().contains("already been shipped"));
    }

    @Test
    @DisplayName("Payment Idempotency: Duplicate payment session requests with same idempotency key return cached session")
    void testPaymentSessionIdempotency() {
        Address addr = createAddress("45 Artisan Galli", "Moradabad", "Uttar Pradesh", "244001", "9898989898");
        OrderCreateRequest req = new OrderCreateRequest(
            store.getId(),
            addr,
            "ONLINE_PREPAID",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(brassLamp.getId(), 1))
        );
        OrderResponse order = orderService.createOrder(customer.getId(), req);

        String idempKey = "idemp_order_" + order.id();
        PaymentSessionRequest payReq = new PaymentSessionRequest(order.id(), order.totalInr(), PaymentMethod.UPI);

        PaymentSessionResponse session1 = paymentService.createPaymentSession(payReq, idempKey);
        PaymentSessionResponse session2 = paymentService.createPaymentSession(payReq, idempKey);

        assertEquals(session1.paymentId(), session2.paymentId());
        assertEquals(session1.gatewayOrderId(), session2.gatewayOrderId());
    }

    @Test
    @DisplayName("Refund Lifecycle: Full refund marks payment and order as REFUNDED")
    void testPaymentRefundLifecycle() {
        Address addr = createAddress("45 Artisan Galli", "Moradabad", "Uttar Pradesh", "244001", "9898989898");
        OrderCreateRequest req = new OrderCreateRequest(
            store.getId(),
            addr,
            "ONLINE_PREPAID",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(brassLamp.getId(), 1))
        );
        OrderResponse order = orderService.createOrder(customer.getId(), req);

        PaymentSessionResponse session = paymentService.createPaymentSession(
            new PaymentSessionRequest(order.id(), order.totalInr(), PaymentMethod.CARD),
            "idemp_pay_rfnd"
        );
        paymentService.verifyPayment(new PaymentVerifyRequest(session.paymentId(), session.gatewayOrderId(), "txn_123", "sig_valid"));

        // Process Refund
        RefundRequest refundReq = new RefundRequest(order.totalInr(), "Customer requested return");
        RefundResponse refund = paymentService.refundPayment(session.paymentId(), refundReq, customer.getId(), "rfnd_key_1");

        assertNotNull(refund);
        PaymentResponse finalPayment = paymentService.getPayment(session.paymentId());
        assertEquals(PaymentStatus.REFUNDED, finalPayment.status());

        Order finalOrder = orderRepository.findById(order.id()).get();
        assertEquals(OrderStatus.REFUNDED, finalOrder.getStatus());
        assertEquals("REFUNDED", finalOrder.getPaymentStatus());
    }
}
