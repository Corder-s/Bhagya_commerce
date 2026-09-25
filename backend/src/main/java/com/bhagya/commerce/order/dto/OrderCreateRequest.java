package com.bhagya.commerce.order.dto;

import com.bhagya.commerce.user.domain.Address;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record OrderCreateRequest(
    @NotBlank(message = "Store ID is required")
    String storeId,

    @NotNull(message = "Shipping address is required")
    Address shippingAddress,

    @NotBlank(message = "Payment method is required")
    String paymentMethod,

    String couponCode,

    @NotEmpty(message = "Order must have at least one item")
    List<OrderItemDto> items
) {
    public record OrderItemDto(
        @NotBlank String productId,
        int quantity
    ) {}
}
