package com.bhagya.commerce.shipping.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.shipping.dto.ServiceabilityResponse;
import com.bhagya.commerce.shipping.dto.ShipmentResponse;
import com.bhagya.commerce.shipping.dto.ShippingRateDto;
import com.bhagya.commerce.shipping.dto.ShippingRateRequest;
import com.bhagya.commerce.shipping.dto.TrackingResponse;
import com.bhagya.commerce.shipping.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Shipping & Logistics", description = "Customer shipping rates, serviceability, tracking, and shipment APIs")
public class ShippingController {

    private final ShippingService shippingService;

    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @PostMapping("/shipping/rates")
    @Operation(summary = "Calculate shipping rates", description = "Returns available courier services, estimates, and backend-authoritative pricing")
    public ResponseEntity<ApiResponse<List<ShippingRateDto>>> getRates(@RequestBody ShippingRateRequest request) {
        List<ShippingRateDto> rates = shippingService.getRates(request);
        return ResponseEntity.ok(ApiResponse.success(rates, "Shipping rates calculated"));
    }

    @GetMapping("/shipping/serviceability")
    @Operation(summary = "Check pincode serviceability", description = "Validates courier coverage and COD availability for a given pincode")
    public ResponseEntity<ApiResponse<ServiceabilityResponse>> checkServiceability(@RequestParam String postalCode) {
        ServiceabilityResponse res = shippingService.checkServiceability(postalCode);
        return ResponseEntity.ok(ApiResponse.success(res, "Pincode serviceability checked"));
    }

    @GetMapping("/orders/{orderId}/tracking")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get order tracking info", description = "Returns shipping carrier, tracking number, current milestone, and timeline")
    public ResponseEntity<ApiResponse<TrackingResponse>> getTracking(
        @PathVariable String orderId,
        @CurrentUser UserPrincipal principal
    ) {
        TrackingResponse tracking = shippingService.getTrackingInfo(orderId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(tracking, "Tracking details retrieved"));
    }

    @GetMapping("/orders/{orderId}/shipments")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get shipments for order", description = "Returns shipment summary for order")
    public ResponseEntity<ApiResponse<ShipmentResponse>> getOrderShipments(
        @PathVariable String orderId,
        @CurrentUser UserPrincipal principal
    ) {
        ShipmentResponse shipment = shippingService.getShipment(orderId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(shipment, "Shipment details retrieved"));
    }

    @GetMapping("/orders/{orderId}/shipment")
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
