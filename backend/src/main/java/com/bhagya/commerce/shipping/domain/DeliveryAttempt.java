package com.bhagya.commerce.shipping.domain;

import java.time.Instant;

public class DeliveryAttempt {
    private String id;
    private String shipmentId;
    private int attemptNumber;
    private String status; // FAILED, RESCHEDULED, RTO_INITIATED
    private String reason;
    private String actionRequired;
    private Instant attemptedAt;

    public DeliveryAttempt() {
        this.attemptNumber = 1;
        this.attemptedAt = Instant.now();
    }

    public DeliveryAttempt(String id, String shipmentId, int attemptNumber, String status, String reason, String actionRequired) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.attemptNumber = attemptNumber;
        this.status = status;
        this.reason = reason;
        this.actionRequired = actionRequired;
        this.attemptedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }

    public int getAttemptNumber() { return attemptNumber; }
    public void setAttemptNumber(int attemptNumber) { this.attemptNumber = attemptNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getActionRequired() { return actionRequired; }
    public void setActionRequired(String actionRequired) { this.actionRequired = actionRequired; }

    public Instant getAttemptedAt() { return attemptedAt; }
    public void setAttemptedAt(Instant attemptedAt) { this.attemptedAt = attemptedAt; }
}
