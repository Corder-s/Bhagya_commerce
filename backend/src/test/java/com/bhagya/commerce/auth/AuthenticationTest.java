package com.bhagya.commerce.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.auth.dto.AuthResponse;
import com.bhagya.commerce.auth.dto.LoginRequest;
import com.bhagya.commerce.auth.dto.OtpVerifyRequest;
import com.bhagya.commerce.auth.service.AuthService;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.security.JwtTokenProvider;
import com.bhagya.commerce.user.repository.InMemoryUserRepository;
import com.bhagya.commerce.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class AuthenticationTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = new InMemoryUserRepository();
        passwordEncoder = new BCryptPasswordEncoder();
        jwtTokenProvider = new JwtTokenProvider(
            "BhagyaCommerceSuperSecureProductionJwtSecretKey2026MustBeAtLeast256BitsLong!",
            86400000L,
            604800000L
        );
        authService = new AuthService(userRepository, passwordEncoder, jwtTokenProvider);
    }

    @Test
    @DisplayName("Valid credentials should authenticate and issue JWT tokens")
    void testValidLogin() {
        AuthResponse response = authService.login(new LoginRequest("aarav.sharma@example.com", "Password@123"));
        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertNotNull(response.user());
        assertEquals("aarav.sharma@example.com", response.user().email());
    }

    @Test
    @DisplayName("Invalid password should throw UnauthorizedException")
    void testInvalidPasswordThrowsUnauthorized() {
        assertThrows(UnauthorizedException.class, () -> {
            authService.login(new LoginRequest("aarav.sharma@example.com", "WrongPassword"));
        });
    }

    @Test
    @DisplayName("OTP verification with valid code should authenticate user")
    void testOtpVerification() {
        AuthResponse response = authService.verifyOtp(new OtpVerifyRequest("+919876543210", "123456"));
        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertTrue(response.user().phone().contains("9876543210"));
    }
}
