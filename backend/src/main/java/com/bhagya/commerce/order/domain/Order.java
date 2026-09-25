package com.bhagya.commerce.order.domain;

import com.bhagya.commerce.user.domain.Address;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Order {
    private String id;
    private String orderNumber;
    private String userId;
    private String customerName;
    private String customerEmail;
    private String storeId;
    private String storeName;
    private OrderStatus status;
    private String paymentStatus;
    private String paymentMethod;
    private BigDecimal subtotalInr;
    private BigDecimal deliveryFeeInr;
    private BigDecimal taxInr;
    private BigDecimal discountInr;
    private BigDecimal totalInr;
    private Address shippingAddress;
    private List<OrderItem> items = new ArrayList<>();
    private List<OrderEvent> events = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public BigDecimal getSubtotalInr() { return subtotalInr; }
    public void setSubtotalInr(BigDecimal subtotalInr) { this.subtotalInr = subtotalInr; }

    public BigDecimal getDeliveryFeeInr() { return deliveryFeeInr; }
    public void setDeliveryFeeInr(BigDecimal deliveryFeeInr) { this.deliveryFeeInr = deliveryFeeInr; }

    public BigDecimal getTaxInr() { return taxInr; }
    public void setTaxInr(BigDecimal taxInr) { this.taxInr = taxInr; }

    public BigDecimal getDiscountInr() { return discountInr; }
    public void setDiscountInr(BigDecimal discountInr) { this.discountInr = discountInr; }

    public BigDecimal getTotalInr() { return totalInr; }
    public void setTotalInr(BigDecimal totalInr) { this.totalInr = totalInr; }

    public Address getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(Address shippingAddress) { this.shippingAddress = shippingAddress; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public List<OrderEvent> getEvents() { return events; }
    public void setEvents(List<OrderEvent> events) { this.events = events; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
