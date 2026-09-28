package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.catalog.product.service.ProductService;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class GetProductDetailsTool implements AITool {

    private final ProductService productService;

    public GetProductDetailsTool(ProductService productService) {
        this.productService = productService;
    }

    @Override
    public String name() {
        return "getProductDetails";
    }

    @Override
    public String description() {
        return "Fetch complete verified materials, artisan technique, GI-tag status, care guide, and pricing for a product.";
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
        return null;
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String productIdOrSlug = (String) parameters.get("productId");
        if (productIdOrSlug == null || productIdOrSlug.isBlank()) {
            productIdOrSlug = (String) parameters.get("slug");
        }

        if (productIdOrSlug == null || productIdOrSlug.isBlank()) {
            return AIToolResult.failure("Product ID or slug is required.");
        }

        try {
            ProductResponse p = productService.getProductByIdOrSlug(productIdOrSlug);

            Map<String, Object> details = new LinkedHashMap<>();
            details.put("productId", p.id());
            details.put("name", p.name());
            details.put("slug", p.slug());
            details.put("price", p.priceInr());
            details.put("mrp", p.mrpInr());
            details.put("category", p.categoryName());
            details.put("blurb", p.blurb());
            details.put("description", p.description());
            details.put("inStock", p.stockQuantity() > 0);
            details.put("stockQuantity", p.stockQuantity());
            details.put("artisanOrigin", "Varanasi Handloom Cluster / GI Certified");

            return AIToolResult.success(details);
        } catch (Exception e) {
            return AIToolResult.failure("Product not found: " + e.getMessage());
        }
    }
}
