package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class GetInventoryStatusTool implements AITool {

    private final ProductRepository productRepository;

    public GetInventoryStatusTool(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public String name() {
        return "getInventoryStatus";
    }

    @Override
    public String description() {
        return "Detect catalog products with low stock levels (< 10 units) or out of stock items requiring restocking.";
    }

    @Override
    public AIToolCategory category() {
        return AIToolCategory.READ_ONLY;
    }

    @Override
    public boolean requiresConfirmation() {
        return false;
    }

    @Override
    public String requiredPermission() {
        return "INVENTORY_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_main";

        try {
            List<Product> products = productRepository.findByStoreId(storeId);
            List<Map<String, Object>> lowStock = products.stream()
                .filter(p -> p.getStockQuantity() <= 10)
                .map(p -> Map.<String, Object>of(
                    "productId", p.getId(),
                    "productName", p.getName(),
                    "sku", p.getSku() != null ? p.getSku() : "SKU-" + p.getId(),
                    "currentStock", p.getStockQuantity(),
                    "status", p.getStockQuantity() == 0 ? "out_of_stock" : "low_stock"
                ))
                .toList();

            return AIToolResult.success(Map.of(
                "totalProducts", products.size(),
                "lowStockCount", lowStock.size(),
                "items", lowStock
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to check inventory status: " + e.getMessage());
        }
    }
}
