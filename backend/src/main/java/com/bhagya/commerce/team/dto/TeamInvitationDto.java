package com.bhagya.commerce.team.dto;

import com.bhagya.commerce.team.domain.InvitationStatus;
import com.bhagya.commerce.team.domain.RoleCode;
import com.bhagya.commerce.team.domain.StoreAccessType;
import java.time.Instant;
import java.util.List;

public record TeamInvitationDto(
    String id,
    String organizationId,
    String email,
    RoleCode role,
    StoreAccessType storeAccessType,
    List<String> storeIds,
    String token,
    InvitationStatus status,
    String invitedBy,
    Instant expiresAt,
    Instant createdAt,
    Instant acceptedAt
) {}
