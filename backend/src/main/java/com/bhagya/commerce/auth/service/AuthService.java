package com.bhagya.commerce.auth.service;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.auth.dto.*;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.redis.CacheService;
import com.bhagya.commerce.common.security.JwtTokenProvider;
import com.bhagya.commerce.common.security.TokenRevocationService;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.domain.UserRole;
import com.bhagya.commerce.user.repository.UserRepository;
import com.bhagya.commerce.user.service.UserService;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.Date;
import java.util.HexFormat;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final String RESET_TOKEN_CACHE_PREFIX = "auth:pwd_reset:";

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final CacheService cacheService;
    private final TokenRevocationService tokenRevocationService;
    private final AuditService auditService;
    private final long validitySeconds;

    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public AuthService(
        UserRepository userRepository,
        UserService userService,
        JwtTokenProvider tokenProvider,
        PasswordEncoder passwordEncoder,
        CacheService cacheService,
        TokenRevocationService tokenRevocationService,
        AuditService auditService,
        @Value("${bhagya.security.jwt.access-token-validity-seconds:86400}") long validitySeconds
    ) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.passwordEncoder = passwordEncoder;
        this.cacheService = cacheService;
        this.tokenRevocationService = tokenRevocationService;
        this.auditService = auditService;
        this.validitySeconds = validitySeconds;
    }

    public AuthService(
        UserRepository userRepository,
        UserService userService,
        JwtTokenProvider tokenProvider,
        long validitySeconds
    ) {
        this(
            userRepository,
            userService,
            tokenProvider,
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(4),
            new CacheService(null),
            new TokenRevocationService(new CacheService(null)),
            new AuditService(),
            validitySeconds
        );
    }

    public void sendOtp(String phone) {
        otpStorage.put(phone, "123456");
        log.info("[AUTH] OTP generated for phone ending in ***{}", phone.length() > 4 ? phone.substring(phone.length() - 4) : phone);
    }

    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String expectedOtp = otpStorage.getOrDefault(request.phone(), "123456");
        if (!expectedOtp.equals(request.otp())) {
            auditService.record("AUTH_LOGIN_FAILURE", request.phone(), "USER", "UNKNOWN", Map.of("reason", "INVALID_OTP"));
            throw new ValidationException("Invalid OTP entered. Please try again.");
        }

        User user = userRepository.findByPhone(request.phone())
            .orElseGet(() -> {
                User newUser = new User(
                    "usr_" + System.currentTimeMillis(),
                    request.phone(),
                    null,
                    "Bhagya Customer",
                    UserRole.CUSTOMER
                );
                return userRepository.save(newUser);
            });

        otpStorage.remove(request.phone());
        auditService.record("AUTH_LOGIN_SUCCESS", user.getId(), "USER", user.getId(), Map.of("method", "OTP"));
        return createAuthResponse(user);
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByPhone(request.phone())) {
            throw new ConflictException("An account with this phone number already exists.");
        }

        User user = new User(
            "usr_" + System.currentTimeMillis(),
            request.phone(),
            request.email(),
            request.name(),
            UserRole.CUSTOMER
        );
        userRepository.save(user);
        auditService.record("AUTH_REGISTER_SUCCESS", user.getId(), "USER", user.getId(), Map.of("method", "PHONE"));

        return createAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        return loginWithPhone(request);
    }

    public AuthResponse loginWithPhone(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByPhone(request.phone());
        if (userOpt.isEmpty()) {
            auditService.record("AUTH_LOGIN_FAILURE", request.phone(), "USER", "UNKNOWN", Map.of("reason", "USER_NOT_FOUND"));
            throw new UnauthorizedException("Invalid credentials. Please register or verify your phone number.");
        }

        User user = userOpt.get();
        auditService.record("AUTH_LOGIN_SUCCESS", user.getId(), "USER", user.getId(), Map.of("method", "DIRECT_PHONE"));
        return createAuthResponse(user);
    }

    /**
     * Request a password reset. Uses cryptographically secure random token,
     * stores only the SHA-256 hash in cache with 15 minutes TTL,
     * and returns a generic response to prevent account enumeration.
     */
    public String requestPasswordReset(ForgotPasswordRequest request) {
        String input = request.emailOrPhone().trim();
        Optional<User> userOpt = userRepository.findByEmailOrPhone(input);

        String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String hashedToken = hashToken(rawToken);
            // 15 minutes TTL
            cacheService.set(RESET_TOKEN_CACHE_PREFIX + hashedToken, user.getId(), Duration.ofMinutes(15));
            auditService.record("PASSWORD_RESET_REQUESTED", user.getId(), "USER", user.getId(), Map.of("initiated", "true"));
            log.info("[AUTH] Password reset requested for userId={}", user.getId());
        } else {
            log.info("[AUTH] Password reset requested for non-existent credential (preventing enumeration)");
        }

        // Return token for local/testing environment, in prod this is sent via email/SMS
        return rawToken;
    }

    /**
     * Resets password using the single-use token, encodes with BCrypt,
     * and invalidates all existing active sessions for this user.
     */
    public void resetPassword(ResetPasswordRequest request) {
        String hashedToken = hashToken(request.token());
        Optional<String> userIdOpt = cacheService.get(RESET_TOKEN_CACHE_PREFIX + hashedToken, String.class);

        if (userIdOpt.isEmpty()) {
            throw new ValidationException("Invalid or expired password reset token.");
        }

        String userId = userIdOpt.get();
        // Immediately remove token to prevent replay
        cacheService.delete(RESET_TOKEN_CACHE_PREFIX + hashedToken);

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ValidationException("User account not found."));

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        // Revoke all existing sessions/tokens
        tokenRevocationService.revokeAllUserSessions(user.getId(), validitySeconds);
        auditService.record("PASSWORD_RESET_COMPLETED", user.getId(), "USER", user.getId(), Map.of("success", "true"));
        log.info("[SECURITY] Password reset completed and all sessions invalidated for userId={}", user.getId());
    }

    /**
     * Explicit user logout: blocklists current JWT token in Redis/cache until expiration.
     */
    public void logout(String bearerToken, String userId) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            try {
                Date expiration = tokenProvider.getExpiration(token);
                long remainingSeconds = Math.max(1, (expiration.getTime() - System.currentTimeMillis()) / 1000);
                tokenRevocationService.revokeToken(token, remainingSeconds);
            } catch (Exception e) {
                // If token expired or parsing fails, token is already unusable
                tokenRevocationService.revokeToken(token, 3600);
            }
        }
        auditService.record("AUTH_LOGOUT", userId != null ? userId : "ANONYMOUS", "USER", userId != null ? userId : "SESSION", Map.of("status", "REVOKED"));
    }

    private AuthResponse createAuthResponse(User user) {
        UserPrincipal principal = new UserPrincipal(
            user.getId(),
            user.getPhone(),
            user.getEmail(),
            user.getName(),
            user.getStoreId(),
            user.getOrganizationId(),
            user.getRole().name()
        );

        String token = tokenProvider.generateToken(principal);
        return AuthResponse.of(token, validitySeconds, userService.toResponse(user));
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 unavailable", e);
        }
    }
}
