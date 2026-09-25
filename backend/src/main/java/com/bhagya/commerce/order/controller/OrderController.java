package com.bhagya.commerce.order.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.order.dto.OrderCreateRequest;
import com.bhagya.commerce.order.dto.OrderEventResponse;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders")
@Tag(name = "Orders", description = "Customer Order Placement, Tracking, and Fulfillment")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @Operation(summary = "Get list of orders for the authenticated customer")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getCustomerOrders(@CurrentUser UserPrincipal principal) {
        List<OrderResponse> orders = orderService.getCustomerOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{orderIdOrNumber}")
    @Operation(summary = "Get single order details with ownership verification")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrder(
        @PathVariable String orderIdOrNumber,
        @CurrentUser UserPrincipal principal
    ) {
        OrderResponse order = orderService.getCustomerOrderById(orderIdOrNumber, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping
    @Operation(summary = "Place a new customer order")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody OrderCreateRequest request
    ) {
        OrderResponse created = orderService.createOrder(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(created, "Order placed successfully. Order Number: " + created.orderNumber()));
    }

    @PostMapping("/{orderIdOrNumber}/cancel")
    @Operation(summary = "Cancel an order before dispatch")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
        @PathVariable String orderIdOrNumber,
        @RequestParam(required = false) String reason,
        @CurrentUser UserPrincipal principal
    ) {
        OrderResponse cancelled = orderService.cancelOrder(orderIdOrNumber, principal.getId(), reason);
        return ResponseEntity.ok(ApiResponse.ok(cancelled, "Order has been cancelled"));
    }

    @GetMapping("/{orderIdOrNumber}/events")
    @Operation(summary = "Get audit tracking events for an order")
    public ResponseEntity<ApiResponse<List<OrderEventResponse>>> getOrderEvents(
        @PathVariable String orderIdOrNumber,
        @CurrentUser UserPrincipal principal
    ) {
        List<OrderEventResponse> events = orderService.getOrderEvents(orderIdOrNumber, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(events));
    }
}
