package com.bhagya.commerce.checkout.dto;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutValidationResponse(
    boolean isValid,
    BigDecimal subtotalInr,
    BigDecimal deliveryFeeInr,
    BigDecimal discountInr,
    BigDecimal taxInr,
    BigDecimal totalInr,
    String estimatedDeliveryDate,
    List<String> warnings
) {}
