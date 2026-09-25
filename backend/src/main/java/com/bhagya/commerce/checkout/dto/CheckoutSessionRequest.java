package com.bhagya.commerce.checkout.dto;

import com.bhagya.commerce.user.domain.Address;
import jakarta.validation.constraints.NotNull;

public record CheckoutSessionRequest(
    @NotNull(message = "Shipping address is required")
    Address address,

    String couponCode,
    String notes
) {}
