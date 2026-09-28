package com.bhagya.commerce.auth;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.auth.dto.AuthResponse;
import com.bhagya.commerce.auth.dto.LoginRequest;
import com.bhagya.commerce.auth.dto.OtpVerifyRequest;
import com.bhagya.commerce.auth.service.AuthService;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.security.JwtTokenProvider;
import com.bhagya.commerce.user.repository.InMemoryUserRepository;
import com.bhagya.commerce.user.repository.UserRepository;
import com.bhagya.commerce.user.service.UserService;
import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.common.security.TokenRevocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class AuthenticationTest {

    private UserRepository userRepository;
    private JwtTokenProvider jwtTokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = new InMemoryUserRepository();
        UserService userService = new UserService(userRepository);
        jwtTokenProvider = new JwtTokenProvider(
            "BhagyaCommerceSuperSecureProductionJwtSecretKey2026MustBeAtLeast256BitsLong!",
            86400000L,
            604800000L
        );
        CacheService cacheService = new CacheService(null);
        TokenRevocationService tokenRevocationService = new TokenRevocationService(cacheService);
        AuditService auditService = new AuditService();
        authService = new AuthService(
            userRepository,
            userService,
            jwtTokenProvider,
            new BCryptPasswordEncoder(4),
            cacheService,
            tokenRevocationService,
            auditService,
            86400L
        );
    }

    @Test
    @DisplayName("Valid phone should authenticate and issue JWT tokens")
    void testValidLogin() {
        AuthResponse response = authService.login(new LoginRequest("+919876543210"));
        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertNotNull(response.user());
        assertEquals("+919876543210", response.user().phone());
    }

    @Test
    @DisplayName("Unregistered phone should throw UnauthorizedException")
    void testUnregisteredPhoneThrowsUnauthorized() {
        assertThrows(UnauthorizedException.class, () -> {
            authService.login(new LoginRequest("+919999999999"));
        });
    }

    @Test
    @DisplayName("OTP verification with valid code should authenticate user")
    void testVerifyOtpSuccess() {
        authService.sendOtp("+919876543210");
        AuthResponse response = authService.verifyOtp(new OtpVerifyRequest("+919876543210", "123456"));
        assertNotNull(response);
        assertNotNull(response.accessToken());
        assertEquals("+919876543210", response.user().phone());
    }
}
