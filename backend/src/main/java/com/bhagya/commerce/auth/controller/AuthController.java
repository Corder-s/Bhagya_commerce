package com.bhagya.commerce.auth.controller;

import com.bhagya.commerce.auth.dto.*;
import com.bhagya.commerce.auth.service.AuthService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.error.RateLimitException;
import com.bhagya.commerce.common.redis.RateLimitService;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "Customer & Merchant OTP Verification, Login, Registration, Password Reset & Session Management")
public class AuthController {

    private final AuthService authService;
    private final RateLimitService rateLimitService;

    public AuthController(AuthService authService, RateLimitService rateLimitService) {
        this.authService = authService;
        this.rateLimitService = rateLimitService;
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwarded = request.getHeader("X-Forwarded-For");
        if (xForwarded != null && !xForwarded.isBlank()) {
            return xForwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "127.0.0.1";
    }

    @PostMapping("/otp/send")
    @Operation(summary = "Send OTP to mobile number with rate limiting")
    public ResponseEntity<ApiResponse<Void>> sendOtp(@Valid @RequestBody OtpRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("otp_send:" + ip, 5, 60)) {
            throw new RateLimitException("Too many OTP requests. Please wait a minute before trying again.");
        }
        authService.sendOtp(request.phone());
        return ResponseEntity.ok(ApiResponse.ok(null, "OTP sent successfully to " + request.phone()));
    }

    @PostMapping("/otp/verify")
    @Operation(summary = "Verify OTP and obtain JWT access token")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("otp_verify:" + ip, 10, 60)) {
            throw new RateLimitException("Too many verification attempts. Please wait before retrying.");
        }
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new customer account")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("register:" + ip, 5, 60)) {
            throw new RateLimitException("Too many registration attempts. Please wait.");
        }
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(response, "Registration successful"));
    }

    @PostMapping("/login")
    @Operation(summary = "Direct phone number login for returning users")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("login:" + ip, 10, 60)) {
            throw new RateLimitException("Too many login attempts. Please wait before retrying.");
        }
        AuthResponse response = authService.loginWithPhone(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Login successful"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset with account enumeration protection")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("forgot_pwd:" + ip, 5, 900)) {
            throw new RateLimitException("Too many password reset requests. Please wait 15 minutes.");
        }
        authService.requestPasswordReset(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "If an account exists for this credential, password reset instructions have been dispatched."));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with single-use cryptographic token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        if (!rateLimitService.allowRequest("reset_pwd:" + ip, 5, 900)) {
            throw new RateLimitException("Too many reset attempts. Please wait before retrying.");
        }
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(null, "Password reset successfully. You may now log in with your new credentials."));
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out user and blocklist JWT access token")
    public ResponseEntity<ApiResponse<Void>> logout(
        @RequestHeader(value = "Authorization", required = false) String authorizationHeader,
        @CurrentUser UserPrincipal principal
    ) {
        String userId = principal != null ? principal.getId() : null;
        authService.logout(authorizationHeader, userId);
        return ResponseEntity.ok(ApiResponse.ok(null, "Logged out successfully. Token invalidated."));
    }
}
