package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.catalog.product.service.ProductService;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class SearchProductsTool implements AITool {

    private final ProductService productService;

    public SearchProductsTool(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public String name() {
        return "searchProducts";
    }

    @Override
    public String description() {
        return "Search verified handcrafted and organic products in the active catalogue by query, category, and budget.";
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
        return null; // Public discovery
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String query = (String) parameters.get("query");
        String category = (String) parameters.get("category");
        Object maxPriceObj = parameters.get("maxPrice");
        BigDecimal maxPrice = null;
        if (maxPriceObj instanceof Number num) {
            maxPrice = BigDecimal.valueOf(num.doubleValue());
        }

        try {
            var page = productService.searchProducts(query, category, null, maxPrice, "popular", 0, 5);
            List<Map<String, Object>> items = page.items().stream()
                .map(p -> Map.<String, Object>of(
                    "productId", p.id(),
                    "name", p.name(),
                    "slug", p.slug(),
                    "category", p.categoryName() != null ? p.categoryName() : "",
                    "price", p.priceInr(),
                    "mrp", p.mrpInr() != null ? p.mrpInr() : p.priceInr(),
                    "inStock", p.stockQuantity() > 0,
                    "imageSrc", p.imageUrl() != null ? p.imageUrl() : ""
                ))
                .toList();

            return AIToolResult.success(Map.of(
                "totalFound", page.totalElements(),
                "products", items
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Search failed: " + e.getMessage());
        }
    }
}
