package com.bhagya.commerce.shipping.domain;

import java.time.Instant;

public class ShipmentEvent {
    private String id;
    private String shipmentId;
    private ShipmentStatus status;
    private String location;
    private String description;
    private Instant eventTime;
    private String source;

    public ShipmentEvent() {
        this.eventTime = Instant.now();
        this.source = "DELHIVERY_CARRIER";
    }

    public ShipmentEvent(String id, String shipmentId, ShipmentStatus status, String location, String description, Instant eventTime, String source) {
        this.id = id;
        this.shipmentId = shipmentId;
        this.status = status;
        this.location = location;
        this.description = description;
        this.eventTime = eventTime != null ? eventTime : Instant.now();
        this.source = source != null ? source : "DELHIVERY_CARRIER";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getShipmentId() { return shipmentId; }
    public void setShipmentId(String shipmentId) { this.shipmentId = shipmentId; }

    public ShipmentStatus getStatus() { return status; }
    public void setStatus(ShipmentStatus status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getEventTime() { return eventTime; }
    public void setEventTime(Instant eventTime) { this.eventTime = eventTime; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
