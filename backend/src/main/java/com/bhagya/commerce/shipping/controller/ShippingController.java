package com.bhagya.commerce.shipping.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.shipping.dto.ShipmentResponse;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import com.bhagya.commerce.shipping.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/orders/{orderId}")
@Tag(name = "Shipping & Tracking", description = "Order shipment status and real-time tracking timeline APIs")
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @GetMapping("/tracking")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get order tracking info", description = "Returns shipping carrier, tracking number, current milestone, and timeline")
    public ResponseEntity<ApiResponse<TrackingResponse>> getTracking(
        @PathVariable String orderId,
        @CurrentUser UserPrincipal principal
    ) {
        TrackingResponse tracking = shippingService.getTrackingInfo(orderId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(tracking, "Tracking details retrieved"));
    }

    @GetMapping("/shipment")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get shipment summary", description = "Returns shipment carrier details and dispatch info")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getShipment(
        @PathVariable String orderId,
        @CurrentUser UserPrincipal principal
    ) {
        ShipmentResponse shipment = shippingService.getShipment(orderId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(shipment, "Shipment details retrieved"));
    }
}
