package com.bhagya.commerce.shipping.dto;

import java.math.BigDecimal;

public record FulfillmentActionRequest(
    String action, // PROCESS, PACK, SHIP, DELIVER, CANCEL
    String carrier,
    String trackingNumber,
    BigDecimal weightKg,
    String dimensions,
    String notes
) {}
