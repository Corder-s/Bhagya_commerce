package com.bhagya.commerce.shipping.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class Fulfillment {
    private String id;
    private String orderId;
    private String storeId;
    private FulfillmentStatus status;
    private String carrier;
    private String trackingNumber;
    private BigDecimal packageWeightKg;
    private String packageDimensions;
    private String notes;
    private Instant createdAt;
    private Instant updatedAt;

    public Fulfillment() {
        this.status = FulfillmentStatus.UNFULFILLED;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Fulfillment(String id, String orderId, String storeId) {
        this.id = id;
        this.orderId = orderId;
        this.storeId = storeId;
        this.status = FulfillmentStatus.UNFULFILLED;
        this.packageWeightKg = new BigDecimal("0.50");
        this.packageDimensions = "25x20x8 cm";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public FulfillmentStatus getStatus() { return status; }
    public void setStatus(FulfillmentStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public BigDecimal getPackageWeightKg() { return packageWeightKg; }
    public void setPackageWeightKg(BigDecimal packageWeightKg) { this.packageWeightKg = packageWeightKg; }

    public String getPackageDimensions() { return packageDimensions; }
    public void setPackageDimensions(String packageDimensions) { this.packageDimensions = packageDimensions; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
