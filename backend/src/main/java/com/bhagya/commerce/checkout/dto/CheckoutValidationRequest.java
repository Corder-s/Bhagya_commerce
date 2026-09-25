package com.bhagya.commerce.checkout.dto;

import com.bhagya.commerce.user.domain.Address;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CheckoutValidationRequest(
    @NotNull(message = "Shipping address is required")
    Address address,

    String couponCode
) {}
