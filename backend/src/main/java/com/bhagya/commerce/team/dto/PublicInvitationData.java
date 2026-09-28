package com.bhagya.commerce.team.dto;

import com.bhagya.commerce.team.domain.RoleCode;
import com.bhagya.commerce.team.domain.StoreAccessType;
import java.time.Instant;
import java.util.List;

public record PublicInvitationData(
    String id,
    String organizationId,
    String organizationName,
    String email,
    RoleCode role,
    String roleName,
    StoreAccessType storeAccessType,
    List<String> storeNames,
    Instant expiresAt,
    boolean isExpired
) {}
