package com.bhagya.commerce.order.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
    String productId,
    String productName,
    String productImageUrl,
    BigDecimal unitPriceInr,
    int quantity,
    BigDecimal totalInr
) {}
