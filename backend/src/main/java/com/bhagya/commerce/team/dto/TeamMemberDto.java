package com.bhagya.commerce.team.dto;

import com.bhagya.commerce.team.domain.MemberStatus;
import com.bhagya.commerce.team.domain.RoleCode;
import com.bhagya.commerce.team.domain.StoreAccessType;
import java.time.Instant;
import java.util.List;

public record TeamMemberDto(
    String id,
    String organizationId,
    String userId,
    String name,
    String email,
    String avatarUrl,
    RoleCode role,
    StoreAccessType storeAccessType,
    List<String> storeIds,
    MemberStatus status,
    Instant createdAt,
    Instant updatedAt
) {}
