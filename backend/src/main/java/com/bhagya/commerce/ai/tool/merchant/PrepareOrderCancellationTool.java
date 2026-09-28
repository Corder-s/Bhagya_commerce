package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIActionConfirmation;
import com.bhagya.commerce.ai.domain.AIActionStatus;
import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.repository.AIActionConfirmationRepository;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.service.OrderService;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class PrepareOrderCancellationTool implements AITool {

    private final OrderService orderService;
    private final AIActionConfirmationRepository actionRepository;

    public PrepareOrderCancellationTool(
        OrderService orderService,
        AIActionConfirmationRepository actionRepository
    ) {
        this.orderService = orderService;
        this.actionRepository = actionRepository;
    }

    @Override
    public String name() {
        return "prepareOrderCancellation";
    }

    @Override
    public String description() {
        return "Prepare an audited cancellation and loyalty points reversal for an eligible customer order. Requires explicit confirmation.";
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
        return "ORDER_MANAGE";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String orderNumber = (String) parameters.get("orderNumber");
        if (orderNumber == null || orderNumber.isBlank()) {
            orderNumber = (String) parameters.get("orderId");
        }
        String reason = (String) parameters.getOrDefault("reason", "Customer requested cancellation via Merchant Copilot");

        if (orderNumber == null || orderNumber.isBlank()) {
            return AIToolResult.failure("Order number or ID is required.");
        }

        try {
            String storeId = context.storeId() != null ? context.storeId() : "store_main";
            var orders = orderService.getOrdersForStore(storeId);
            final String targetNum = orderNumber;
            OrderResponse found = orders.stream()
                .filter(o -> o.orderNumber().equalsIgnoreCase(targetNum) || o.id().equalsIgnoreCase(targetNum))
                .findFirst()
                .orElse(null);

            if (found == null) {
                return AIToolResult.failure("Order not found in this store scope.");
            }

            String actionId = "act_cancel_" + UUID.randomUUID().toString().substring(0, 8);
            String summary = String.format("Cancel Order #%s (Total: ₹%s) with reason: '%s'", found.orderNumber(), found.totalInr(), reason);

            Map<String, Object> payload = Map.of(
                "orderId", found.id(),
                "orderNumber", found.orderNumber(),
                "totalInr", found.totalInr(),
                "customerEmail", found.customerEmail(),
                "reason", reason
            );

            AIActionConfirmation action = new AIActionConfirmation(
                actionId,
                "conv_current",
                context.userId(),
                context.storeId(),
                "CANCEL_ORDER",
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
        } catch (Exception e) {
            return AIToolResult.failure("Could not prepare cancellation: " + e.getMessage());
        }
    }
}
