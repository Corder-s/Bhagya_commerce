package com.bhagya.commerce.team.dto;

import com.bhagya.commerce.team.domain.PermissionCode;
import com.bhagya.commerce.team.domain.RoleCode;
import java.util.Set;

public record RoleDefinitionDto(
    RoleCode code,
    String name,
    String description,
    Set<PermissionCode> permissions
) {}
