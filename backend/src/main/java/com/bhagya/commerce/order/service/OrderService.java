package com.bhagya.commerce.order.service;

import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderEvent;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.dto.OrderCreateRequest;
import com.bhagya.commerce.order.dto.OrderEventResponse;
import com.bhagya.commerce.order.dto.OrderItemResponse;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    public OrderService(
        OrderRepository orderRepository,
        ProductRepository productRepository,
        StoreRepository storeRepository,
        UserRepository userRepository
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.storeRepository = storeRepository;
        this.userRepository = userRepository;
    }

    public List<OrderResponse> getCustomerOrders(String userId) {
        return orderRepository.findByUserId(userId).stream()
            .map(this::toResponse)
            .toList();
    }

    public OrderResponse getCustomerOrderById(String orderIdOrNumber, String userId) {
        Order order = findOrder(orderIdOrNumber);

        // Strict ownership check: Customer A cannot access Customer B's order
        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view this order.");
        }

        return toResponse(order);
    }

    public OrderResponse createOrder(String userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Store store = storeRepository.findById(request.storeId())
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + request.storeId()));

        String orderId = "ord_" + System.currentTimeMillis();
        String orderNumber = "BG-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + (int) (100000 + Math.random() * 900000);

        Order order = new Order();
        order.setId(orderId);
        order.setOrderNumber(orderNumber);
        order.setUserId(userId);
        order.setCustomerName(user.getName());
        order.setCustomerEmail(user.getEmail());
        order.setStoreId(store.getId());
        order.setStoreName(store.getName());
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(request.paymentMethod().equalsIgnoreCase("COD") ? "PENDING" : "PAID");
        order.setPaymentMethod(request.paymentMethod());
        order.setShippingAddress(request.shippingAddress());
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderCreateRequest.OrderItemDto itemDto : request.items()) {
            Product product = productRepository.findById(itemDto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDto.productId()));

            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new ValidationException("Product '" + product.getName() + "' does not have sufficient stock.");
            }

            // Decrement inventory stock
            product.setStockQuantity(product.getStockQuantity() - itemDto.quantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(
                "oi_" + System.currentTimeMillis() + "_" + items.size(),
                product.getId(),
                product.getName(),
                product.getImageUrl(),
                product.getPriceInr(),
                itemDto.quantity()
            );
            orderItem.setOrderId(orderId);
            items.add(orderItem);

            subtotal = subtotal.add(orderItem.getTotalInr());
        }

        order.setItems(items);
        order.setSubtotalInr(subtotal);

        BigDecimal delivery = subtotal.compareTo(new BigDecimal("1499")) >= 0 ? BigDecimal.ZERO : new BigDecimal("99.00");
        BigDecimal tax = subtotal.multiply(new BigDecimal("0.05"));
        BigDecimal discount = BigDecimal.ZERO;

        order.setDeliveryFeeInr(delivery);
        order.setTaxInr(tax);
        order.setDiscountInr(discount);
        order.setTotalInr(subtotal.add(delivery).add(tax).subtract(discount));

        order.getEvents().add(new OrderEvent(
            "oe_" + System.currentTimeMillis(),
            orderId,
            OrderStatus.CONFIRMED,
            "Order Placed",
            "Order placed and confirmed via " + request.paymentMethod()
        ));

        orderRepository.save(order);
        return toResponse(order);
    }

    public OrderResponse cancelOrder(String orderIdOrNumber, String userId, String reason) {
        Order order = findOrder(orderIdOrNumber);

        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to cancel this order.");
        }

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new ValidationException("Orders that have already been shipped cannot be cancelled directly. Please initiate a return instead.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(Instant.now());

        order.getEvents().add(new OrderEvent(
            "oe_" + System.currentTimeMillis(),
            order.getId(),
            OrderStatus.CANCELLED,
            "Order Cancelled",
            reason != null ? reason : "Cancelled by customer"
        ));

        orderRepository.save(order);
        return toResponse(order);
    }

    public List<OrderEventResponse> getOrderEvents(String orderIdOrNumber, String userId) {
        Order order = findOrder(orderIdOrNumber);
        if (!order.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to view this order's events.");
        }

        return order.getEvents().stream()
            .map(e -> new OrderEventResponse(e.getId(), e.getStatus(), e.getTitle(), e.getDescription(), e.getCreatedAt()))
            .toList();
    }

    private Order findOrder(String idOrNumber) {
        if (idOrNumber.startsWith("ord_")) {
            return orderRepository.findById(idOrNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + idOrNumber));
        }
        return orderRepository.findByOrderNumber(idOrNumber)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + idOrNumber));
    }

    public OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
            .map(i -> new OrderItemResponse(
                i.getProductId(), i.getProductName(), i.getProductImageUrl(),
                i.getUnitPriceInr(), i.getQuantity(), i.getTotalInr()
            ))
            .toList();

        List<OrderEventResponse> eventResponses = order.getEvents().stream()
            .map(e -> new OrderEventResponse(
                e.getId(), e.getStatus(), e.getTitle(), e.getDescription(), e.getCreatedAt()
            ))
            .toList();

        return new OrderResponse(
            order.getId(),
            order.getOrderNumber(),
            order.getUserId(),
            order.getCustomerName(),
            order.getCustomerEmail(),
            order.getStoreId(),
            order.getStoreName(),
            order.getStatus(),
            order.getPaymentStatus(),
            order.getPaymentMethod(),
            order.getSubtotalInr(),
            order.getDeliveryFeeInr(),
            order.getTaxInr(),
            order.getDiscountInr(),
            order.getTotalInr(),
            order.getShippingAddress(),
            itemResponses,
            eventResponses,
            order.getCreatedAt()
        );
    }
}
