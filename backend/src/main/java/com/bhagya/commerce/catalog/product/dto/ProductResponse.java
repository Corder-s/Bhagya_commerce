package com.bhagya.commerce.catalog.product.dto;

import com.bhagya.commerce.catalog.product.domain.ProductStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProductResponse(
    String id,
    String storeId,
    String categoryId,
    String categoryName,
    String name,
    String slug,
    String blurb,
    String description,
    BigDecimal priceInr,
    BigDecimal mrpInr,
    int stockQuantity,
    String sku,
    ProductStatus status,
    String imageUrl,
    List<String> tags,
    String shippingInfo,
    String careInstructions,
    double ratingValue,
    int reviewCount,
    Instant createdAt
) {}
