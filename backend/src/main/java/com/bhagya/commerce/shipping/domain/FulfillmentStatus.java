package com.bhagya.commerce.shipping.domain;

public enum FulfillmentStatus {
    UNFULFILLED,
    PROCESSING,
    PACKED,
    READY_FOR_PICKUP,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
