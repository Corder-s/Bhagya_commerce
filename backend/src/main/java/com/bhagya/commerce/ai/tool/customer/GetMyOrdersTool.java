package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.service.OrderService;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class GetMyOrdersTool implements AITool {

    private final OrderService orderService;

    public GetMyOrdersTool(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public String name() {
        return "getMyOrders";
    }

    @Override
    public String description() {
        return "Retrieve the list of recent verified orders placed by the current authenticated customer.";
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
        return null; // Public for authenticated customer
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        if (context.userId() == null || context.userId().startsWith("usr_anon")) {
            return AIToolResult.failure("Customer authentication required to view orders.");
        }

        List<OrderResponse> orders = orderService.getCustomerOrders(context.userId());
        List<Map<String, Object>> sanitized = orders.stream()
            .map(o -> Map.<String, Object>of(
                "orderId", o.id(),
                "orderNumber", o.orderNumber(),
                "status", o.status().name(),
                "totalInr", o.totalInr(),
                "createdAt", o.createdAt().toString(),
                "itemCount", o.items().size()
            ))
            .toList();

        return AIToolResult.success(Map.of(
            "totalOrders", sanitized.size(),
            "orders", sanitized
        ));
    }
}
