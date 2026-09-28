package com.bhagya.commerce.e2e;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.bhagya.commerce.analytics.service.AnalyticsEventTracker;
import com.bhagya.commerce.catalog.category.repository.CategoryRepository;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.common.redis.IdempotencyService;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.loyalty.domain.LoyaltyAccount;
import com.bhagya.commerce.loyalty.dto.LoyaltyAccountDto;
import com.bhagya.commerce.loyalty.repository.*;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import com.bhagya.commerce.marketing.repository.CouponRepository;
import com.bhagya.commerce.marketing.repository.PromotionRepository;
import com.bhagya.commerce.notification.repository.InMemoryNotificationRepository;
import com.bhagya.commerce.notification.service.NotificationOrchestrator;
import com.bhagya.commerce.notification.service.NotificationService;
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
import com.bhagya.commerce.payment.provider.MockPaymentProvider;
import com.bhagya.commerce.payment.service.PaymentService;
import com.bhagya.commerce.review.domain.ReviewStatus;
import com.bhagya.commerce.review.dto.CreateReviewRequest;
import com.bhagya.commerce.review.dto.ReviewDto;
import com.bhagya.commerce.review.repository.ReviewRepository;
import com.bhagya.commerce.review.service.ReviewEligibilityService;
import com.bhagya.commerce.review.service.ReviewModerationService;
import com.bhagya.commerce.review.service.ReviewService;
import com.bhagya.commerce.search.dto.SearchRequest;
import com.bhagya.commerce.search.dto.SearchResponse;
import com.bhagya.commerce.search.provider.SearchProvider;
import com.bhagya.commerce.search.service.SearchAnalyticsService;
import com.bhagya.commerce.search.service.SearchService;
import com.bhagya.commerce.shipping.domain.Fulfillment;
import com.bhagya.commerce.shipping.domain.FulfillmentStatus;
import com.bhagya.commerce.shipping.dto.FulfillmentActionRequest;
import com.bhagya.commerce.shipping.dto.ShippingWebhookPayload;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import com.bhagya.commerce.shipping.provider.MockShippingProvider;
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
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class FullCustomerJourneyE2ETest {

    private UserRepository userRepository;
    private StoreRepository storeRepository;
    private ProductRepository productRepository;
    private CategoryRepository categoryRepository;
    private OrderRepository orderRepository;
    private ReviewRepository reviewRepository;
    private ShipmentRepository shipmentRepository;
    private FulfillmentRepository fulfillmentRepository;

    private CacheService cacheService;
    private IdempotencyService idempotencyService;
    private JobQueue jobQueue;
    private InventoryService inventoryService;
    private LoyaltyService loyaltyService;
    private NotificationOrchestrator notificationOrchestrator;
    private OrderService orderService;
    private PaymentService paymentService;
    private FulfillmentService fulfillmentService;
    private ShippingService shippingService;
    private ReviewService reviewService;
    private SearchService searchService;

    private User customer;
    private Store store;
    private Product artisanShawl;

    private Address createAddress(String street, String city, String state, String pincode) {
        Address addr = new Address();
        addr.setId("addr_" + System.currentTimeMillis());
        addr.setName("Priya Customer");
        addr.setPhone("+91 98765 43210");
        addr.setAddressLine1(street);
        addr.setCity(city);
        addr.setState(state);
        addr.setPincode(pincode);
        return addr;
    }

    @BeforeEach
    void setUp() {
        userRepository = new UserRepository();
        storeRepository = new StoreRepository();
        productRepository = new ProductRepository();
        categoryRepository = new CategoryRepository();
        orderRepository = new OrderRepository();
        reviewRepository = new ReviewRepository();
        shipmentRepository = new ShipmentRepository();
        fulfillmentRepository = new FulfillmentRepository();

        cacheService = new CacheService(null);
        idempotencyService = new IdempotencyService(cacheService);
        jobQueue = new JobQueue(null);
        inventoryService = new InventoryService();

        NotificationService notificationService = new NotificationService(new InMemoryNotificationRepository());
        notificationOrchestrator = new NotificationOrchestrator(notificationService, jobQueue);

        LoyaltyProgramRepository programRepo = new LoyaltyProgramRepository();
        LoyaltyAccountRepository accountRepo = new LoyaltyAccountRepository();
        LoyaltyLedgerRepository ledgerRepo = new LoyaltyLedgerRepository();
        LoyaltyRewardRepository rewardRepo = new LoyaltyRewardRepository();
        RewardRedemptionRepository redemptionRepo = new RewardRedemptionRepository();
        CustomerReferralRepository referralRepo = new CustomerReferralRepository();
        PromotionRepository promotionRepo = mock(PromotionRepository.class);
        CouponRepository couponRepo = mock(CouponRepository.class);
        AnalyticsEventTracker analyticsTracker = mock(AnalyticsEventTracker.class);

        loyaltyService = new LoyaltyService(
            programRepo,
            accountRepo,
            ledgerRepo,
            rewardRepo,
            redemptionRepo,
            referralRepo,
            promotionRepo,
            couponRepo,
            notificationService,
            analyticsTracker
        );

        orderService = new OrderService(orderRepository, productRepository, storeRepository, userRepository, loyaltyService);
        MockPaymentProvider paymentProvider = new MockPaymentProvider();
        paymentService = new PaymentService(orderRepository, paymentProvider, inventoryService, notificationOrchestrator, idempotencyService, loyaltyService);

        ShippingProviderFactory shippingProviderFactory = mock(ShippingProviderFactory.class);
        when(shippingProviderFactory.getProvider()).thenReturn(new MockShippingProvider());
        fulfillmentService = new FulfillmentService(fulfillmentRepository, shipmentRepository, orderRepository, shippingProviderFactory);
        shippingService = new ShippingService(orderRepository, shipmentRepository, shippingProviderFactory, cacheService, null, "test_shipping_secret_2026");

        ReviewEligibilityService eligibilityService = new ReviewEligibilityService(orderRepository, reviewRepository);
        ReviewModerationService moderationService = new ReviewModerationService(reviewRepository);
        reviewService = new ReviewService(reviewRepository, eligibilityService, moderationService);

        SearchProvider searchProvider = mock(SearchProvider.class);
        SearchResponse mockSearchResponse = new SearchResponse();
        mockSearchResponse.setTotal(1);
        mockSearchResponse.setItems(Collections.emptyList());
        when(searchProvider.search(any(SearchRequest.class))).thenReturn(mockSearchResponse);

        SearchAnalyticsService searchAnalyticsService = mock(SearchAnalyticsService.class);
        searchService = new SearchService(searchProvider, searchAnalyticsService);

        // Seed Store & User
        store = new Store("store_kashmir_crafts", "org_kashmir", "Kashmir Heritage Crafts", "kashmir-crafts", "support@kashmircrafts.in");
        storeRepository.save(store);

        customer = new User("usr_customer_journey", "priya.customer@example.in", "Priya Customer", "hash_pw", UserRole.CUSTOMER);
        userRepository.save(customer);

        artisanShawl = new Product(
            "prod_pashmina_shawl",
            store.getId(),
            "cat_shawls",
            "Handwoven Pure Pashmina Shawl",
            "pashmina-shawl",
            new BigDecimal("4999.00"),
            15
        );
        productRepository.save(artisanShawl);
    }

    @Test
    @DisplayName("E2E: Complete Customer Journey - Search -> Cart -> Checkout -> Payment -> Tracking -> Review -> Loyalty")
    void testCompleteCustomerJourneyFlow() {
        // 1. Search Catalog
        SearchRequest searchReq = new SearchRequest();
        searchReq.setQuery("Pashmina Shawl");
        SearchResponse searchResult = searchService.search(searchReq);
        assertNotNull(searchResult);
        assertEquals(1, searchResult.getTotal());

        // 2. Customer Initiates Order / Cart Checkout
        Address shippingAddress = createAddress("42 Lakeview Colony", "Srinagar", "Jammu and Kashmir", "190001");
        OrderCreateRequest orderRequest = new OrderCreateRequest(
            store.getId(),
            shippingAddress,
            "COD",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(artisanShawl.getId(), 2)) // 2 shawls = ₹9,998
        );

        OrderResponse order = orderService.createOrder(customer.getId(), orderRequest);
        assertNotNull(order);
        assertEquals(OrderStatus.CONFIRMED, order.status());
        assertEquals("PENDING", order.paymentStatus());
        assertEquals(new BigDecimal("9998.00"), order.subtotalInr());
        assertEquals(BigDecimal.ZERO, order.deliveryFeeInr(), "Orders above ₹1,499 qualify for free shipping");
        // Remaining stock = 15 - 2 = 13
        assertEquals(13, productRepository.findById(artisanShawl.getId()).get().getStockQuantity());

        // 3. Payment Session Creation & Validation
        PaymentSessionRequest payReq = new PaymentSessionRequest(order.id(), order.totalInr(), PaymentMethod.CARD);
        PaymentSessionResponse session = paymentService.createPaymentSession(payReq, "idemp_pay_" + order.id());
        assertNotNull(session);
        assertEquals(order.totalInr(), session.amountInr());

        // 4. Server-Side Payment Verification (Authoritative)
        PaymentVerifyRequest verifyReq = new PaymentVerifyRequest(
            session.paymentId(),
            session.gatewayOrderId(),
            "pay_razorpay_success_123",
            "sig_valid_hash_456"
        );
        PaymentResponse verified = paymentService.verifyPayment(verifyReq);
        assertEquals(PaymentStatus.CAPTURED, verified.status());

        // Verify Order is now PAID
        Order updatedOrder = orderRepository.findById(order.id()).orElseThrow();
        assertEquals("PAID", updatedOrder.getPaymentStatus());

        // 5. Loyalty Points Automatically Awarded
        LoyaltyAccountDto loyaltyAccount = loyaltyService.getCustomerAccount(customer.getId(), store.getId());
        assertNotNull(loyaltyAccount, "Loyalty account must be accessible after order payment");
        assertTrue(loyaltyAccount.availablePoints() > 0, "Loyalty balance must reflect earned points");

        // 6. Fulfillment Lifecycle (Pack -> Manifest Shipment -> Courier Pickup)
        Fulfillment fulfillment = fulfillmentService.getOrCreateFulfillment(order.id(), store.getId());
        assertNotNull(fulfillment);

        // Pack
        fulfillmentService.handleAction(order.id(), store.getId(), new FulfillmentActionRequest("PACK", null, null, new BigDecimal("1.2"), "20x15x5 cm", "Care instructions included"));
        // Create Shipment & Label
        fulfillmentService.handleAction(order.id(), store.getId(), new FulfillmentActionRequest("CREATE_SHIPMENT", "Delhivery Express", null, new BigDecimal("1.2"), "20x15x5 cm", null));

        Fulfillment shippedFulfillment = fulfillmentRepository.findByOrderId(order.id()).orElseThrow();
        assertEquals(FulfillmentStatus.READY_FOR_PICKUP, shippedFulfillment.getStatus());
        assertNotNull(shippedFulfillment.getTrackingNumber());

        // 7. Courier Webhook Updates to DELIVERED
        ShippingWebhookPayload webhook = new ShippingWebhookPayload(
            "evt_ship_deliv_999",
            "DELIVERED",
            shippedFulfillment.getTrackingNumber(),
            "Delhivery Express",
            "DELIVERED",
            "Srinagar Customer Hub",
            "Package delivered to Priya Customer",
            Instant.now(),
            null,
            1
        );
        boolean webhookResult = shippingService.processWebhook(webhook, "test_shipping_secret_2026");
        assertTrue(webhookResult);

        // Verify Order transitioned to DELIVERED
        Order deliveredOrder = orderRepository.findById(order.id()).orElseThrow();
        assertEquals(OrderStatus.DELIVERED, deliveredOrder.getStatus());

        // Customer Tracking check
        TrackingResponse tracking = shippingService.getTrackingInfo(order.id(), customer.getId());
        assertEquals("DELIVERED", tracking.currentStatus());

        // 8. Verified Purchaser Review Submission
        CreateReviewRequest reviewReq = new CreateReviewRequest(
            artisanShawl.getId(),
            order.id(),
            "oi_1",
            5,
            "Breathtaking softness and weave",
            "The handwoven pashmina is truly an authentic masterpiece. Kept me warm throughout the winter.",
            List.of("https://media.bhagya.commerce/reviews/pashmina1.jpg")
        );
        ReviewDto review = reviewService.createReview(reviewReq, customer.getId(), customer.getName());
        assertNotNull(review);
        assertTrue(review.verifiedPurchase());
        assertEquals(5, review.rating());
        assertEquals("PUBLISHED", review.status());
    }

    @Test
    @DisplayName("E2E: Guest Checkout creates order safely and cannot access customer accounts")
    void testGuestCheckoutFlow() {
        User guest = new User("usr_guest_temp", "guest.visitor@example.com", "Guest Visitor", "no_pw", UserRole.CUSTOMER);
        userRepository.save(guest);

        Address guestAddress = createAddress("12 MG Road", "Jaipur", "Rajasthan", "302001");
        OrderCreateRequest guestOrderRequest = new OrderCreateRequest(
            store.getId(),
            guestAddress,
            "ONLINE_PREPAID",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(artisanShawl.getId(), 1))
        );

        OrderResponse guestOrder = orderService.createOrder(guest.getId(), guestOrderRequest);
        assertNotNull(guestOrder);
        assertNotEquals(customer.getId(), guest.getId());

        // Guest attempts to access another customer's order directly -> MUST REJECT
        assertThrows(ForbiddenException.class, () -> {
            orderService.getCustomerOrderById(guestOrder.id(), "usr_different_customer");
        });
    }

    @Test
    @DisplayName("E2E: Out-of-Stock Checkout Rejection & Stock Concurrency")
    void testOutOfStockValidation() {
        Address addr = createAddress("Test Street", "Test City", "State", "100001");
        // Attempting to buy 20 units when stock is 15
        OrderCreateRequest overRequest = new OrderCreateRequest(
            store.getId(),
            addr,
            "COD",
            null,
            List.of(new OrderCreateRequest.OrderItemDto(artisanShawl.getId(), 20))
        );

        assertThrows(ValidationException.class, () -> {
            orderService.createOrder(customer.getId(), overRequest);
        });

        // Stock remains uncompromised
        assertEquals(15, productRepository.findById(artisanShawl.getId()).get().getStockQuantity());
    }
}
