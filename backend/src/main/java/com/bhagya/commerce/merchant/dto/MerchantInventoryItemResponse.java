package com.bhagya.commerce.merchant.dto;

import java.math.BigDecimal;

public record MerchantInventoryItemResponse(
    String productId,
    String productName,
    String sku,
    int stockQuantity,
    int reservedQuantity,
    int availableQuantity,
    int lowStockThreshold,
    BigDecimal price,
    String status // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
) {}
