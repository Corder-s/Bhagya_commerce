package com.bhagya.commerce.team.domain;

import java.util.Collections;
import java.util.Set;

public class RoleDefinition {

    private final RoleCode code;
    private final String name;
    private final String description;
    private final Set<PermissionCode> permissions;

    public RoleDefinition(RoleCode code, String name, String description, Set<PermissionCode> permissions) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.permissions = Collections.unmodifiableSet(permissions);
    }

    public RoleCode getCode() { return code; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Set<PermissionCode> getPermissions() { return permissions; }

    public boolean hasPermission(PermissionCode permission) {
        return permissions.contains(permission);
    }
}
