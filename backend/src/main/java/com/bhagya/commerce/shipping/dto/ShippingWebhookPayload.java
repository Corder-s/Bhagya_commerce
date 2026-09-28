package com.bhagya.commerce.shipping.dto;

import java.time.Instant;

public record ShippingWebhookPayload(
    String eventId,
    String eventType, // PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED_DELIVERY, RTO
    String trackingNumber,
    String carrier,
    String status,
    String location,
    String description,
    Instant timestamp,
    String failureReason,
    Integer attemptCount
) {}
