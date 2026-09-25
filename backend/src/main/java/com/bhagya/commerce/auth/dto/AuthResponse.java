package com.bhagya.commerce.auth.dto;

import com.bhagya.commerce.user.dto.UserResponse;

public record AuthResponse(
    String accessToken,
    String tokenType,
    long expiresInSeconds,
    UserResponse user
) {
    public static AuthResponse of(String token, long validitySeconds, UserResponse user) {
        return new AuthResponse(token, "Bearer", validitySeconds, user);
    }
}
