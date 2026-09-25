package com.bhagya.commerce.shipping.dto;

import java.util.List;

public record TrackingResponse(
    String orderNumber,
    String carrier,
    String trackingNumber,
    String currentStatus,
    String estimatedDelivery,
    String destinationCity,
    int currentStepIndex,
    List<ShipmentEventResponse> timeline
) {}
