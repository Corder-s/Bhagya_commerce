package com.bhagya.commerce.shipping.dto;

import java.math.BigDecimal;

public record ShippingRateDto(
    String id,
    String provider,
    String serviceCode,
    String serviceName,
    String carrier,
    int estimatedDays,
    BigDecimal price,
    String currency,
    boolean codSupported,
    String zone
) {}
