package com.bhagya.commerce.catalog.product.dto;

import com.bhagya.commerce.catalog.product.domain.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

public record ProductCreateRequest(
    @NotBlank(message = "Product title is required")
    @Size(min = 2, max = 255)
    String name,

    String categoryId,
    String categoryName,
    String slug,
    String blurb,
    String description,

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal priceInr,

    BigDecimal mrpInr,

    @PositiveOrZero(message = "Stock quantity cannot be negative")
    int stockQuantity,

    String sku,
    ProductStatus status,
    String imageUrl,
    List<String> tags,
    String shippingInfo,
    String careInstructions
) {}
