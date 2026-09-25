package com.bhagya.commerce.order.repository;

import com.bhagya.commerce.order.domain.Order;
import com.bhagya.commerce.order.domain.OrderEvent;
import com.bhagya.commerce.order.domain.OrderItem;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.user.domain.Address;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class OrderRepository {

    private final Map<String, Order> orderStorage = new ConcurrentHashMap<>();
    private final Map<String, String> orderNumberIndex = new ConcurrentHashMap<>();

    public OrderRepository() {
        // Seed customer and merchant orders
        Address addr = new Address();
        addr.setName("Priya Sharma");
        addr.setPhone("+919876543210");
        addr.setAddressLine1("Flat 402, Lotus Residency, 12th Main Road");
        addr.setCity("Bengaluru");
        addr.setState("Karnataka");
        addr.setPincode("560038");

        Order o1 = new Order();
        o1.setId("ord_9812");
        o1.setOrderNumber("ORD-2026-9812");
        o1.setUserId("usr_dev_customer_01");
        o1.setCustomerName("Priya Sharma");
        o1.setCustomerEmail("priya.sharma@example.com");
        o1.setStoreId("store_varanasi_silk");
        o1.setStoreName("Varanasi Heritage Silks");
        o1.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        o1.setPaymentStatus("PAID");
        o1.setPaymentMethod("UPI");
        o1.setSubtotalInr(new BigDecimal("3850.00"));
        o1.setDeliveryFeeInr(BigDecimal.ZERO);
        o1.setTaxInr(new BigDecimal("192.50"));
        o1.setDiscountInr(BigDecimal.ZERO);
        o1.setTotalInr(new BigDecimal("4042.50"));
        o1.setShippingAddress(addr);

        OrderItem item1 = new OrderItem("oi_1", "prod_01", "Handloom Chanderi Silk Saree", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80", new BigDecimal("3850.00"), 1);
        o1.getItems().add(item1);

        o1.getEvents().add(new OrderEvent("oe_1", "ord_9812", OrderStatus.CONFIRMED, "Order Placed & Confirmed", "Payment verified via UPI."));
        o1.getEvents().add(new OrderEvent("oe_2", "ord_9812", OrderStatus.PROCESSING, "Handcrafted & Packed", "Carefully packaged with authenticity certificate."));
        o1.getEvents().add(new OrderEvent("oe_3", "ord_9812", OrderStatus.SHIPPED, "Handed over to Delhivery", "Tracking #DLH-99281745"));
        o1.getEvents().add(new OrderEvent("oe_4", "ord_9812", OrderStatus.OUT_FOR_DELIVERY, "Out for Delivery", "Courier executive Rajesh K. is delivering today."));

        save(o1);
    }

    public List<Order> findAll() {
        return new ArrayList<>(orderStorage.values());
    }

    public Optional<Order> findById(String id) {
        return Optional.ofNullable(orderStorage.get(id));
    }

    public Optional<Order> findByOrderNumber(String orderNumber) {
        String id = orderNumberIndex.get(orderNumber);
        return id != null ? Optional.ofNullable(orderStorage.get(id)) : Optional.empty();
    }

    public List<Order> findByUserId(String userId) {
        return orderStorage.values().stream()
            .filter(o -> o.getUserId().equals(userId))
            .toList();
    }

    public List<Order> findByStoreId(String storeId) {
        return orderStorage.values().stream()
            .filter(o -> o.getStoreId().equals(storeId))
            .toList();
    }

    public Order save(Order order) {
        if (order.getId() == null) {
            order.setId("ord_" + System.currentTimeMillis());
        }
        orderStorage.put(order.getId(), order);
        if (order.getOrderNumber() != null) {
            orderNumberIndex.put(order.getOrderNumber(), order.getId());
        }
        return order;
    }
}
