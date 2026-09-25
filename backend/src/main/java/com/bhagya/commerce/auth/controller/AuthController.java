package com.bhagya.commerce.auth.controller;

import com.bhagya.commerce.auth.dto.AuthResponse;
import com.bhagya.commerce.auth.dto.LoginRequest;
import com.bhagya.commerce.auth.dto.OtpRequest;
import com.bhagya.commerce.auth.dto.OtpVerifyRequest;
import com.bhagya.commerce.auth.dto.RegisterRequest;
import com.bhagya.commerce.auth.service.AuthService;
import com.bhagya.commerce.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Customer & Merchant OTP Verification, Login, and Registration")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/otp/send")
    @Operation(summary = "Send OTP to mobile number")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody OtpRequest request) {
        authService.sendOtp(request.phone());
        return ResponseEntity.ok(ApiResponse.ok(null, "OTP sent successfully to " + request.phone()));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify OTP and obtain JWT access token")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(response, "Registration successful"));
    }

    @PostMapping("/login")
    @Operation(summary = "Direct phone number login for returning users")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginWithPhone(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }
}
