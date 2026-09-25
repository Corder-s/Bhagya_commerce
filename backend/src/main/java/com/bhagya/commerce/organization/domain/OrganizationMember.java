package com.bhagya.commerce.organization.domain;

import java.time.Instant;

public class OrganizationMember {
    private String id;
    private String organizationId;
    private String userId;
    private OrganizationRole role;
    private Instant createdAt;

    public OrganizationMember() {}

    public OrganizationMember(String id, String organizationId, String userId, OrganizationRole role) {
        this.id = id;
        this.organizationId = organizationId;
        this.userId = userId;
        this.role = role;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public OrganizationRole getRole() { return role; }
    public void setRole(OrganizationRole role) { this.role = role; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
