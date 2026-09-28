package com.bhagya.commerce.team.dto;

import com.bhagya.commerce.team.domain.MemberStatus;
import com.bhagya.commerce.team.domain.RoleCode;
import com.bhagya.commerce.team.domain.StoreAccessType;
import java.util.List;

public record TeamMemberUpdateRequest(
    RoleCode role,
    StoreAccessType storeAccessType,
    List<String> storeIds,
    MemberStatus status
) {}
