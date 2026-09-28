package com.bhagya.commerce.shipping.domain;

import java.time.Instant;

public class PickupRequest {
    private String id;
    private String shipmentId;
    private String carrier;
    private Instant pickupDate;
    private String status; // SCHEDULED, COMPLETED, RESCHEDULED, CANCELLED
    private String referenceNumber;
    private String notes;
    private Instant createdAt;

    public PickupRequest() {
        this.status = "SCHEDULED";
        this.createdAt = Instant.now();
    }

    public PickupRequest(String id, String shipmentId, String carrier, Instant pickupDate, String referenceNumber, String notes) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.carrier = carrier;
        this.pickupDate = pickupDate;
        this.status = "SCHEDULED";
        this.referenceNumber = referenceNumber;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }

    public String getCarrier() { return carrier; }
    public void setCarrier(String carrier) { this.carrier = carrier; }

    public Instant getPickupDate() { return pickupDate; }
    public void setPickupDate(Instant pickupDate) { this.pickupDate = pickupDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
