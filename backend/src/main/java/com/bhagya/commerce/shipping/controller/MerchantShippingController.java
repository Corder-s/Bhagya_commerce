package com.bhagya.commerce.shipping.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.shipping.domain.Fulfillment;
import com.bhagya.commerce.shipping.domain.ShippingLabel;
import com.bhagya.commerce.shipping.dto.FulfillmentActionRequest;
import com.bhagya.commerce.shipping.service.FulfillmentService;
import com.bhagya.commerce.shipping.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/merchant")
@Tag(name = "Merchant Shipping & Fulfillment", description = "Merchant order processing, AWB generation, label printing, and pickup requests")
public class MerchantShippingController {

    private final FulfillmentService fulfillmentService;
    private final ShippingService shippingService;

    public MerchantShippingController(
        FulfillmentService fulfillmentService,
        ShippingService shippingService
    ) {
        this.fulfillmentService = fulfillmentService;
        this.shippingService = shippingService;
    }

    @GetMapping("/orders/{orderId}/fulfillment")
    @PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Get fulfillment state for order")
    public ResponseEntity<ApiResponse<Fulfillment>> getFulfillment(
        @PathVariable String orderId,
        @RequestHeader(value = "X-Store-Id", required = false) String storeId
    ) {
        Fulfillment fulfillment = fulfillmentService.getOrCreateFulfillment(orderId, storeId);
        return ResponseEntity.ok(ApiResponse.success(fulfillment, "Fulfillment state retrieved"));
    }

    @PostMapping("/orders/{orderId}/fulfillment")
    @PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Execute fulfillment action", description = "Transitions fulfillment: PROCESS, PACK, CREATE_SHIPMENT, REQUEST_PICKUP, SHIP, DELIVER, CANCEL")
    public ResponseEntity<ApiResponse<Fulfillment>> executeAction(
        @PathVariable String orderId,
        @RequestHeader(value = "X-Store-Id", required = false) String storeId,
        @RequestBody FulfillmentActionRequest request
    ) {
        Fulfillment fulfillment = fulfillmentService.handleAction(orderId, storeId, request);
        return ResponseEntity.ok(ApiResponse.success(fulfillment, "Fulfillment updated successfully"));
    }

    @GetMapping("/shipments/{shipmentId}/label")
    @PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Get shipping label metadata & signed URL")
    public ResponseEntity<ApiResponse<ShippingLabel>> getShippingLabel(
        @PathVariable String shipmentId,
        @RequestHeader(value = "X-Store-Id", required = false) String storeId
    ) {
        ShippingLabel label = shippingService.getLabelForShipment(shipmentId, storeId);
        return ResponseEntity.ok(ApiResponse.success(label, "Shipping label ready for print"));
    }
}
