package com.bhagya.commerce.shipping.dto;

import java.util.List;

public record ServiceabilityResponse(
    String postalCode,
    boolean serviceable,
    String status, // DELIVERABLE, NOT_SERVICEABLE, LIMITED_SERVICE
    boolean codAvailable,
    int estimatedDeliveryDays,
    List<String> availableCarriers,
    String message
) {}
