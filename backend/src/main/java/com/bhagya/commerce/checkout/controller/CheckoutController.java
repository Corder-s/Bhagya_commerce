package com.bhagya.commerce.checkout.controller;

import com.bhagya.commerce.checkout.dto.CheckoutSessionRequest;
import com.bhagya.commerce.checkout.dto.CheckoutSessionResponse;
import com.bhagya.commerce.checkout.dto.CheckoutValidationRequest;
import com.bhagya.commerce.checkout.dto.CheckoutValidationResponse;
import com.bhagya.commerce.checkout.service.CheckoutService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/checkout")
@Tag(name = "Checkout", description = "Authoritative Cart Validation & Checkout Sessions")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate cart availability, GST tax, address, and coupon code")
    public ResponseEntity<ApiResponse<CheckoutValidationResponse>> validateCheckout(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody CheckoutValidationRequest request
    ) {
        CheckoutValidationResponse response = checkoutService.validateCheckout(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/session")
    @Operation(summary = "Create an authoritative 30-minute checkout session")
    public ResponseEntity<ApiResponse<CheckoutSessionResponse>> createSession(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody CheckoutSessionRequest request
    ) {
        CheckoutSessionResponse session = checkoutService.createCheckoutSession(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(session, "Checkout session initialized"));
    }
}
