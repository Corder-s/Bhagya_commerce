package com.bhagya.commerce.shipping.dto;

import java.math.BigDecimal;

public record CreateShipmentRequest(
    String orderId,
    String carrier,
    BigDecimal weightKg,
    String dimensions,
    String pickupNotes
) {}
