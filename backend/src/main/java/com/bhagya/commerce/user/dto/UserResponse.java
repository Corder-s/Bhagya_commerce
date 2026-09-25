package com.bhagya.commerce.user.dto;

import com.bhagya.commerce.user.domain.UserRole;
import java.time.Instant;

public record UserResponse(
    String id,
    String phone,
    String email,
    String name,
    String avatarUrl,
    UserRole role,
    String storeId,
    String organizationId,
    Instant createdAt
) {}
