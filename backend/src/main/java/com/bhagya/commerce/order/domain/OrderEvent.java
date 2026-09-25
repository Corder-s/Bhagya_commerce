package com.bhagya.commerce.order.domain;

import java.time.Instant;

public class OrderEvent {
    private String id;
    private String orderId;
    private OrderStatus status;
    private String title;
    private String description;
    private Instant createdAt;

    public OrderEvent() {}

    public OrderEvent(String id, String orderId, OrderStatus status, String title, String description) {
        this.id = id;
        this.orderId = orderId;
        this.status = status;
        this.title = title;
        this.description = description;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
