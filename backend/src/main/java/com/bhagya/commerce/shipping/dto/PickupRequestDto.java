package com.bhagya.commerce.shipping.dto;

import java.time.Instant;

public record PickupRequestDto(
    String shipmentId,
    String carrier,
    Instant pickupDate,
    String notes
) {}
