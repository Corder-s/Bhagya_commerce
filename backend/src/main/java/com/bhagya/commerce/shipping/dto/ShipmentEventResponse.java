package com.bhagya.commerce.shipping.dto;

import java.time.Instant;

public record ShipmentEventResponse(
    String id,
    String status,
    String title,
    String description,
    String location,
    Instant timestamp
) {}
