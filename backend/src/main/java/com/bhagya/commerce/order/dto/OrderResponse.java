package com.bhagya.commerce.order.dto;

import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.user.domain.Address;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
    String id,
    String orderNumber,
    String userId,
    String customerName,
    String customerEmail,
    String storeId,
    String storeName,
    OrderStatus status,
    String paymentStatus,
    String paymentMethod,
    BigDecimal subtotalInr,
    BigDecimal deliveryFeeInr,
    BigDecimal taxInr,
    BigDecimal discountInr,
    BigDecimal totalInr,
    Address shippingAddress,
    List<OrderItemResponse> items,
    List<OrderEventResponse> events,
    Instant createdAt
) {}
