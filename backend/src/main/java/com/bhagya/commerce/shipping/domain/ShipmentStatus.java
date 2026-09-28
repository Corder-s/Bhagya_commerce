package com.bhagya.commerce.shipping.domain;

public enum ShipmentStatus {
    MANIFESTED,
    PICKED_UP,
    IN_TRANSIT,
    OUT_FOR_DELIVERY,
    DELIVERED,
    FAILED_DELIVERY,
    RTO,
    CANCELLED
}
