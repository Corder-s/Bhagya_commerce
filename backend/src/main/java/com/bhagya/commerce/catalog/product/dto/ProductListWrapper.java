package com.bhagya.commerce.catalog.product.dto;

import java.util.List;

public record ProductListWrapper(
    List<ProductResponse> products
) {
    public ProductListWrapper {
        if (products == null) {
            products = List.of();
        }
    }
}
