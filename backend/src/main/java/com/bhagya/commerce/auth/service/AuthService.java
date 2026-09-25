package com.bhagya.commerce.auth.service;

import com.bhagya.commerce.auth.dto.AuthResponse;
import com.bhagya.commerce.auth.dto.LoginRequest;
import com.bhagya.commerce.auth.dto.OtpVerifyRequest;
import com.bhagya.commerce.auth.dto.RegisterRequest;
import com.bhagya.commerce.common.error.ConflictException;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.common.security.JwtTokenProvider;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.user.domain.User;
import com.bhagya.commerce.user.domain.UserRole;
import com.bhagya.commerce.user.repository.UserRepository;
import com.bhagya.commerce.user.service.UserService;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;
    private final long validitySeconds;

    // Temporary OTP store for Step 11 development before Step 12 Redis
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public AuthService(
        UserRepository userRepository,
        UserService userService,
        JwtTokenProvider tokenProvider,
        @Value("${bhagya.security.jwt.access-token-validity-seconds:86400}") long validitySeconds
    ) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
        this.validitySeconds = validitySeconds;
    }

    public void sendOtp(String phone) {
        // Standard mock OTP for local development and test automation
        otpStorage.put(phone, "123456");
    }

    public AuthResponse verifyOtp(OtpVerifyRequest request) {
        String expectedOtp = otpStorage.getOrDefault(request.phone(), "123456");
        if (!expectedOtp.equals(request.otp())) {
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

        return createAuthResponse(user);
    }

    public AuthResponse loginWithPhone(LoginRequest request) {
        User user = userRepository.findByPhone(request.phone())
            .orElseThrow(() -> new UnauthorizedException("No account found with this phone number. Please register."));

        return createAuthResponse(user);
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
}
