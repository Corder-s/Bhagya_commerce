package com.bhagya.commerce.shipping.dto;

import java.time.Instant;
import java.util.List;

public record ShipmentResponse(
    String id,
    String orderId,
    String carrier,
    String trackingNumber,
    String status,
    String estimatedDelivery,
    Instant dispatchedAt
) {}
