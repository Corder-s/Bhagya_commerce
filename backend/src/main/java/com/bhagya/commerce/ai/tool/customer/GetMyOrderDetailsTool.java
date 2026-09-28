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
public class GetMyOrderDetailsTool implements AITool {

    private final OrderService orderService;

    public GetMyOrderDetailsTool(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public String name() {
        return "getMyOrderDetails";
    }

    @Override
    public String description() {
        return "Fetch complete verified status, item line items, payment state, and delivery details for a customer order.";
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
        if (context.userId() == null || context.userId().startsWith("usr_anon")) {
            return AIToolResult.failure("Customer authentication required.");
        }

        String orderIdOrNumber = (String) parameters.get("orderId");
        if (orderIdOrNumber == null || orderIdOrNumber.isBlank()) {
            orderIdOrNumber = (String) parameters.get("orderNumber");
        }

        if (orderIdOrNumber == null || orderIdOrNumber.isBlank()) {
            // Default to most recent order if not provided
            List<OrderResponse> recent = orderService.getCustomerOrders(context.userId());
            if (recent.isEmpty()) {
                return AIToolResult.failure("No orders found for this customer.");
            }
            orderIdOrNumber = recent.get(0).orderNumber();
        }

        try {
            OrderResponse order = orderService.getCustomerOrderById(orderIdOrNumber, context.userId());
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("orderId", order.id());
            result.put("orderNumber", order.orderNumber());
            result.put("status", order.status().name());
            result.put("paymentStatus", order.paymentStatus());
            result.put("paymentMethod", order.paymentMethod());
            result.put("totalInr", order.totalInr());
            result.put("storeName", order.storeName());
            result.put("createdAt", order.createdAt().toString());

            List<Map<String, Object>> items = order.items().stream()
                .map(i -> Map.<String, Object>of(
                    "productName", i.productName(),
                    "quantity", i.quantity(),
                    "unitPrice", i.unitPriceInr(),
                    "total", i.totalInr()
                ))
                .toList();
            result.put("items", items);

            return AIToolResult.success(result);
        } catch (Exception e) {
            return AIToolResult.failure("Unable to retrieve order details: " + e.getMessage());
        }
    }
}
