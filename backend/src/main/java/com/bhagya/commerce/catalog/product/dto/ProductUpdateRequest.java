package com.bhagya.commerce.catalog.product.dto;

import com.bhagya.commerce.catalog.product.domain.ProductStatus;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record ProductUpdateRequest(
    @Size(min = 2, max = 255)
    String name,

    String categoryId,
    String categoryName,
    String blurb,
    String description,

    @Positive(message = "Price must be positive")
    BigDecimal priceInr,

    BigDecimal mrpInr,

    @PositiveOrZero(message = "Stock quantity cannot be negative")
    Integer stockQuantity,

    String sku,
    ProductStatus status,
    String imageUrl,
    List<String> tags,
    String shippingInfo,
    String careInstructions
) {}
