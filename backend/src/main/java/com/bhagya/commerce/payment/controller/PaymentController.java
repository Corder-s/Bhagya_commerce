package com.bhagya.commerce.payment.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.payment.dto.PaymentResponse;
import com.bhagya.commerce.payment.dto.PaymentSessionRequest;
import com.bhagya.commerce.payment.dto.PaymentSessionResponse;
import com.bhagya.commerce.payment.dto.PaymentVerifyRequest;
import com.bhagya.commerce.payment.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
@Tag(name = "Payments", description = "Authoritative Gateway Sessions, Verification, & Webhooks")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/session")
    @Operation(summary = "Initialize gateway payment session (Idempotent)")
    public ResponseEntity<ApiResponse<PaymentSessionResponse>> createSession(
        @Valid @RequestBody PaymentSessionRequest request,
        @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey
    ) {
        PaymentSessionResponse session = paymentService.createPaymentSession(request, idempotencyKey);
        return ResponseEntity.ok(ApiResponse.ok(session, "Payment session initialized"));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify gateway payment signature and confirm order")
    public ResponseEntity<ApiResponse<PaymentResponse>> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Payment verified successfully"));
    }

    @GetMapping("/{paymentId}")
    @Operation(summary = "Get payment status")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPayment(@PathVariable String paymentId) {
        PaymentResponse response = paymentService.getPayment(paymentId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Asynchronous payment gateway webhook listener (isolated)")
    public ResponseEntity<ApiResponse<Void>> handleWebhook(
        @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature,
        @RequestBody String payload
    ) {
        paymentService.handleWebhook(signature, payload);
        return ResponseEntity.ok(ApiResponse.ok(null, "Webhook received"));
    }
}
