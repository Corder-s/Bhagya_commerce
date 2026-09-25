package com.bhagya.commerce.payment.service;

import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.redis.IdempotencyService;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.notification.service.NotificationOrchestrator;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.payment.domain.Payment;
import com.bhagya.commerce.payment.domain.PaymentMethod;
import com.bhagya.commerce.payment.domain.PaymentStatus;
import com.bhagya.commerce.payment.dto.PaymentResponse;
import com.bhagya.commerce.payment.dto.PaymentSessionRequest;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.dto.RefundRequest;
import com.bhagya.commerce.payment.dto.RefundResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final OrderRepository orderRepository;
    private final PaymentProvider paymentProvider;
    private final InventoryService inventoryService;
    private final NotificationOrchestrator notificationOrchestrator;
    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final Map<String, Payment> paymentStorage = new ConcurrentHashMap<>();
    private final Map<String, RefundResponse> refundStorage = new ConcurrentHashMap<>();
    private final Map<String, Instant> processedWebhookEvents = new ConcurrentHashMap<>();

    public PaymentService(
        OrderRepository orderRepository,
        PaymentProvider paymentProvider,
        InventoryService inventoryService,
        NotificationOrchestrator notificationOrchestrator,
        IdempotencyService idempotencyService
    ) {
        this.orderRepository = orderRepository;
        this.paymentProvider = paymentProvider;
        this.inventoryService = inventoryService;
        this.notificationOrchestrator = notificationOrchestrator;
        this.idempotencyService = idempotencyService;
    }

    public PaymentSessionResponse createPaymentSession(PaymentSessionRequest request, String idempotencyKey) {
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            Optional<PaymentSessionResponse> cached = idempotencyService.getProcessedResult(idempotencyKey, PaymentSessionResponse.class);
            if (cached.isPresent()) {
                log.info("[PAYMENT] Returning cached payment session for idempotencyKey={}", idempotencyKey);
                return cached.get();
            }
        }

        Order order = orderRepository.findById(request.orderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.orderId()));

        // Authoritative server-side total validation
        if (order.getTotalAmount().compareTo(request.amountInr()) != 0) {
            log.warn("[PAYMENT] Amount mismatch: requested={}, orderTotal={}", request.amountInr(), order.getTotalAmount());
            throw new ValidationException(Map.of("amountInr", "Payment amount must match authoritative order total of ₹" + order.getTotalAmount()));
        }

        String paymentId = "pay_" + UUID.randomUUID().toString().substring(0, 10);
        Payment payment = new Payment(paymentId, order.getId(), request.amountInr(), request.method(), PaymentStatus.CREATED);
        payment.setIdempotencyKey(idempotencyKey);
        paymentStorage.put(paymentId, payment);

        PaymentSessionResponse response = paymentProvider.createGatewayOrder(payment);

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            idempotencyService.storeResult(idempotencyKey, response);
        }

        return response;
    }

    @Transactional
    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentStorage.get(request.paymentId());
        if (payment == null) {
            throw new ResourceNotFoundException("Payment session not found: " + request.paymentId());
        }

        // Validate state machine
        if (payment.getStatus() == PaymentStatus.CAPTURED) {
            return toResponse(payment); // Already verified
        }

        boolean isValid = paymentProvider.verifySignature(request);
        if (!isValid) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(Instant.now());
            log.warn("[PAYMENT] Signature verification failed for paymentId={}", request.paymentId());
            throw new UnauthorizedException("Payment signature verification failed.");
        }

        payment.setStatus(PaymentStatus.CAPTURED);
        payment.setGatewayTransactionId(request.gatewayPaymentId() != null ? request.gatewayPaymentId() : "txn_" + System.currentTimeMillis());
        payment.setUpdatedAt(Instant.now());

        // Update Order
        Order order = orderRepository.findById(payment.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + payment.getOrderId()));
        order.setPaymentStatus("PAID");
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        // Commit reserved inventory
        for (OrderItem item : order.getItems()) {
            inventoryService.commitInventory(item.getProductId(), item.getQuantity());
        }

        // Trigger asynchronous multi-channel notification
        String email = order.getShippingAddress() != null ? order.getShippingAddress().getEmail() : "customer@bhagya.in";
        notificationOrchestrator.handleOrderConfirmed(
            order.getUserId(),
            order.getCustomerName(),
            email,
            order.getCustomerPhone(),
            order.getOrderNumber(),
            order.getTotalAmount()
        );

        return toResponse(payment);
    }

    public PaymentResponse getPayment(String paymentId) {
        Payment payment = Optional.ofNullable(paymentStorage.get(paymentId))
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
        return toResponse(payment);
    }

    @Transactional
    public void handleWebhook(String signature, String rawBody) {
        log.info("[WEBHOOK] Received payment webhook. Verifying signature...");

        boolean valid = paymentProvider.verifyWebhookSignature(rawBody, signature);
        if (!valid) {
            log.error("[WEBHOOK] Invalid webhook signature detected. Rejecting request.");
            throw new UnauthorizedException("Invalid webhook signature.");
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String event = root.path("event").asText("");
            String eventId = root.path("id").asText("evt_" + UUID.randomUUID().toString().substring(0, 8));

            // Webhook Idempotency Check
            if (processedWebhookEvents.containsKey(eventId)) {
                log.info("[WEBHOOK] Duplicate event id={} already processed. Acknowledging safely.", eventId);
                return;
            }
            processedWebhookEvents.put(eventId, Instant.now());

            log.info("[WEBHOOK] Processing event={} eventId={}", event, eventId);

            if ("payment.captured".equals(event) || "order.paid".equals(event)) {
                JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
                String gatewayPaymentId = paymentEntity.path("id").asText("");
                String notesPaymentId = paymentEntity.path("notes").path("paymentId").asText("");

                if (!notesPaymentId.isBlank() && paymentStorage.containsKey(notesPaymentId)) {
                    Payment payment = paymentStorage.get(notesPaymentId);
                    if (payment.getStatus() != PaymentStatus.CAPTURED) {
                        payment.setStatus(PaymentStatus.CAPTURED);
                        payment.setGatewayTransactionId(gatewayPaymentId);
                        payment.setUpdatedAt(Instant.now());

                        orderRepository.findById(payment.getOrderId()).ifPresent(order -> {
                            order.setPaymentStatus("PAID");
                            order.setStatus(OrderStatus.CONFIRMED);
                            orderRepository.save(order);
                        });
                    }
                }
            }
        } catch (Exception e) {
            log.error("[WEBHOOK] Error processing webhook payload: {}", e.getMessage());
        }
    }

    public RefundResponse refundPayment(String paymentId, RefundRequest request, String userId, String idempotencyKey) {
        Payment payment = paymentStorage.get(paymentId);
        if (payment == null) {
            throw new ResourceNotFoundException("Payment not found: " + paymentId);
        }

        if (payment.getStatus() != PaymentStatus.CAPTURED) {
            throw new ConflictException("Cannot refund a payment with status: " + payment.getStatus());
        }

        if (request.amountInr().compareTo(payment.getAmountInr()) > 0) {
            throw new ValidationException(Map.of("amountInr", "Refund amount cannot exceed captured amount of ₹" + payment.getAmountInr()));
        }

        RefundResponse response = paymentProvider.refundPayment(
            payment.getGatewayTransactionId() != null ? payment.getGatewayTransactionId() : payment.getId(),
            request.amountInr(),
            request.reason(),
            idempotencyKey
        );

        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setUpdatedAt(Instant.now());
        refundStorage.put(response.id(), response);

        orderRepository.findById(payment.getOrderId()).ifPresent(order -> {
            order.setStatus(OrderStatus.REFUNDED);
            order.setPaymentStatus("REFUNDED");
            orderRepository.save(order);
            notificationOrchestrator.handleRefundCompleted(order.getUserId(), order.getOrderNumber(), request.amountInr());
        });

        return response;
    }

    public PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
            payment.getId(),
            payment.getOrderId(),
            payment.getAmountInr(),
            payment.getMethod(),
            payment.getStatus(),
            payment.getGatewayTransactionId(),
            payment.getCreatedAt()
        );
    }
}
