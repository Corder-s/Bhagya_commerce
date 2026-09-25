package com.bhagya.commerce.cart.dto;

import java.math.BigDecimal;

public record CartItemResponse(
    String itemId,
    String productId,
    String slug,
    String name,
    String imageUrl,
    BigDecimal unitPriceInr,
    int quantity,
    BigDecimal totalInr
) {}
