package com.bhagya.commerce.shipping.dto;

import java.math.BigDecimal;

public record ShippingRateRequest(
    String originPostalCode,
    String destinationPostalCode,
    BigDecimal weightKg,
    BigDecimal declaredValueInr,
    boolean cod
) {}
