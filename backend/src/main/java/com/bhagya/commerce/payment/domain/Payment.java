package com.bhagya.commerce.payment.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class Payment {
    private String id;
    private String orderId;
    private BigDecimal amountInr;
    private PaymentMethod method;
    private PaymentStatus status;
    private String gatewayTransactionId;
    private String idempotencyKey;
    private Instant createdAt;
    private Instant updatedAt;

    public Payment() {}

    public Payment(String id, String orderId, BigDecimal amountInr, PaymentMethod method, PaymentStatus status) {
        this.id = id;
        this.orderId = orderId;
        this.amountInr = amountInr;
        this.method = method;
        this.status = status;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public BigDecimal getAmountInr() { return amountInr; }
    public void setAmountInr(BigDecimal amountInr) { this.amountInr = amountInr; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getGatewayTransactionId() { return gatewayTransactionId; }
    public void setGatewayTransactionId(String gatewayTransactionId) { this.gatewayTransactionId = gatewayTransactionId; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
