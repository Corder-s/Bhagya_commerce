package com.bhagya.commerce.payment.service;

import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.payment.domain.Payment;
import com.bhagya.commerce.payment.domain.PaymentMethod;
import com.bhagya.commerce.payment.domain.PaymentStatus;
import com.bhagya.commerce.payment.dto.PaymentResponse;
import com.bhagya.commerce.payment.dto.PaymentSessionRequest;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final OrderRepository orderRepository;
    private final Map<String, Payment> paymentStorage = new ConcurrentHashMap<>();

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public PaymentSessionResponse createPaymentSession(PaymentSessionRequest request, String idempotencyKey) {
        Order order = orderRepository.findById(request.orderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + request.orderId()));

        String paymentId = "pay_" + System.currentTimeMillis();
        Payment payment = new Payment(paymentId, order.getId(), request.amountInr(), request.method(), PaymentStatus.CREATED);
        payment.setIdempotencyKey(idempotencyKey);
        paymentStorage.put(paymentId, payment);

        String gatewayOrderId = "order_rzp_" + System.currentTimeMillis();
        return new PaymentSessionResponse(paymentId, order.getId(), gatewayOrderId, request.amountInr(), "INR", "rzp_test_bhagya2026");
    }

    public PaymentResponse verifyPayment(PaymentVerifyRequest request) {
        Payment payment = paymentStorage.get(request.paymentId());
        if (payment == null) {
            throw new ResourceNotFoundException("Payment session not found: " + request.paymentId());
        }

        // Simulate authoritative verification
        payment.setStatus(PaymentStatus.CAPTURED);
        payment.setGatewayTransactionId(request.gatewayPaymentId() != null ? request.gatewayPaymentId() : "txn_" + System.currentTimeMillis());
        payment.setUpdatedAt(Instant.now());

        // Update corresponding Order
        Order order = orderRepository.findById(payment.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setPaymentStatus("PAID");
        order.setStatus(OrderStatus.CONFIRMED);
        order.setUpdatedAt(Instant.now());
        orderRepository.save(order);

        return toResponse(payment);
    }

    public PaymentResponse getPayment(String paymentId) {
        Payment payment = Optional.ofNullable(paymentStorage.get(paymentId))
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + paymentId));
        return toResponse(payment);
    }

    public void handleWebhook(String signature, String payload) {
        // Prepared for Step 12 HMAC-SHA256 signature verification & automated reconciliation
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
