package com.bhagya.commerce.shipping.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.shipping.dto.ShippingWebhookPayload;
import com.bhagya.commerce.shipping.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/shipping")
@Tag(name = "Shipping Webhooks", description = "Inbound courier tracking webhooks from Delhivery, BlueDart, etc.")
public class ShippingWebhookController {

    private final ShippingService shippingService;

    public ShippingWebhookController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }

    @PostMapping("/webhook")
    @Operation(summary = "Process shipping carrier webhook", description = "Verifies signature, ensures idempotency, and updates shipment tracking milestones")
    public ResponseEntity<ApiResponse<Boolean>> handleWebhook(
        @RequestBody ShippingWebhookPayload payload,
        @RequestHeader(value = "X-Shipping-Signature", required = false) String signature
    ) {
        boolean processed = shippingService.processWebhook(payload, signature);
        return ResponseEntity.ok(ApiResponse.success(processed, "Webhook processed successfully"));
    }
}
