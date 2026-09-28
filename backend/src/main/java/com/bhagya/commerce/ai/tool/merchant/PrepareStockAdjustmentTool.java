package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIActionConfirmation;
import com.bhagya.commerce.ai.domain.AIActionStatus;
import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.repository.AIActionConfirmationRepository;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.catalog.product.domain.Product;
import com.bhagya.commerce.catalog.product.repository.ProductRepository;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class PrepareStockAdjustmentTool implements AITool {

    private final ProductRepository productRepository;
    private final AIActionConfirmationRepository actionRepository;

    public PrepareStockAdjustmentTool(
        ProductRepository productRepository,
        AIActionConfirmationRepository actionRepository
    ) {
        this.productRepository = productRepository;
        this.actionRepository = actionRepository;
    }

    @Override
    public String name() {
        return "prepareStockAdjustment";
    }

    @Override
    public String description() {
        return "Prepare an audited inventory stock quantity adjustment for an artisan product in the merchant catalog. Requires explicit confirmation.";
    }

    @Override
    public AIToolCategory category() {
        return AIToolCategory.MUTATING;
    }

    @Override
    public boolean requiresConfirmation() {
        return true;
    }

    @Override
    public String requiredPermission() {
        return "INVENTORY_MANAGE";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String productId = (String) parameters.get("productId");
        Object newStockObj = parameters.get("newStock");

        if (productId == null || newStockObj == null) {
            return AIToolResult.failure("Product ID and new stock quantity are required.");
        }

        int newStock = ((Number) newStockObj).intValue();
        if (newStock < 0) {
            return AIToolResult.failure("Stock quantity cannot be negative.");
        }

        Product product = productRepository.findById(productId).orElse(null);
        String productName = product != null ? product.getName() : "Catalog Item (" + productId + ")";
        int currentStock = product != null ? product.getStockQuantity() : 0;

        String actionId = "act_stock_" + UUID.randomUUID().toString().substring(0, 8);
        String summary = String.format("Adjust inventory stock for '%s' from %d to %d units", productName, currentStock, newStock);

        Map<String, Object> payload = Map.of(
            "productId", productId,
            "productName", productName,
            "currentStock", currentStock,
            "newStock", newStock
        );

        AIActionConfirmation action = new AIActionConfirmation(
            actionId,
            "conv_current",
            context.userId(),
            context.storeId(),
            "UPDATE_INVENTORY_STOCK",
            AIActionStatus.PENDING_CONFIRMATION,
            summary,
            payload,
            null,
            Instant.now(),
            null,
            Instant.now().plusSeconds(900)
        );

        actionRepository.save(action);
        return AIToolResult.requiresConfirmation(action);
    }
}
