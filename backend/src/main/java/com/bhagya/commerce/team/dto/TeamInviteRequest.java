package com.bhagya.commerce.team.dto;

import com.bhagya.commerce.team.domain.RoleCode;
import com.bhagya.commerce.team.domain.StoreAccessType;
import java.util.List;

public record TeamInviteRequest(
    String email,
    RoleCode role,
    StoreAccessType storeAccessType,
    List<String> storeIds
) {}
