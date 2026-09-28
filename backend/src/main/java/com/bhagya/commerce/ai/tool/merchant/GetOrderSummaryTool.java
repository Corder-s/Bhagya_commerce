package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import com.bhagya.commerce.order.domain.OrderStatus;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.service.OrderService;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class GetOrderSummaryTool implements AITool {

    private final OrderService orderService;

    public GetOrderSummaryTool(OrderService orderService) {
        this.orderService = orderService;
    }

    @Override
    public String name() {
        return "getOrderSummary";
    }

    @Override
    public String description() {
        return "Retrieve live store order counts grouped by fulfillment status (pending, processing, shipped, delivered, cancelled).";
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
        return "ORDER_VIEW";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String storeId = context.storeId() != null ? context.storeId() : "store_main";

        try {
            List<OrderResponse> orders = orderService.getOrdersForStore(storeId);
            long confirmed = orders.stream().filter(o -> o.status() == OrderStatus.CONFIRMED).count();
            long processing = orders.stream().filter(o -> o.status() == OrderStatus.PROCESSING).count();
            long shipped = orders.stream().filter(o -> o.status() == OrderStatus.SHIPPED).count();
            long delivered = orders.stream().filter(o -> o.status() == OrderStatus.DELIVERED).count();
            long cancelled = orders.stream().filter(o -> o.status() == OrderStatus.CANCELLED).count();

            return AIToolResult.success(Map.of(
                "totalOrders", orders.size(),
                "pendingDispatch", confirmed + processing,
                "inTransit", shipped,
                "delivered", delivered,
                "cancelled", cancelled
            ));
        } catch (Exception e) {
            return AIToolResult.failure("Failed to summarize store orders: " + e.getMessage());
        }
    }
}
