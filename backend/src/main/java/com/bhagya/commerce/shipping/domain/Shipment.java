package com.bhagya.commerce.shipping.domain;

import java.time.Instant;

public class Shipment {
    private String id;
    private String orderId;
    private String carrier;
    private String trackingNumber;
    private ShipmentStatus status;
    private Instant estimatedDelivery;
    private String origin;
    private String destination;
    private Instant createdAt;

    public Shipment() {
        this.status = ShipmentStatus.MANIFESTED;
        this.createdAt = Instant.now();
    }

    public Shipment(String id, String orderId, String carrier, String trackingNumber, ShipmentStatus status, Instant estimatedDelivery) {
        this.id = id;
        this.orderId = orderId;
        this.carrier = carrier;
        this.trackingNumber = trackingNumber;
        this.status = status != null ? status : ShipmentStatus.MANIFESTED;
        this.estimatedDelivery = estimatedDelivery;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public Instant getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(Instant estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
