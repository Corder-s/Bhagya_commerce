package com.bhagya.commerce.team.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class TeamInvitation {

    private String id;
    private String organizationId;
    private String email;
    private RoleCode role;
    private StoreAccessType storeAccessType = StoreAccessType.ALL_STORES;
    private List<String> storeIds = new ArrayList<>();
    private String token;
    private InvitationStatus status = InvitationStatus.PENDING;
    private String invitedBy;
    private Instant expiresAt;
    private Instant createdAt = Instant.now();
    private Instant acceptedAt;

    public TeamInvitation() {}

    public TeamInvitation(String id, String organizationId, String email, RoleCode role, String invitedBy, Instant expiresAt) {
        this.id = id;
        this.organizationId = organizationId;
        this.email = email;
        this.role = role;
        this.invitedBy = invitedBy;
        this.expiresAt = expiresAt;
        this.status = InvitationStatus.PENDING;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public RoleCode getRole() { return role; }
    public void setRole(RoleCode role) { this.role = role; }

    public StoreAccessType getStoreAccessType() { return storeAccessType; }
    public void setStoreAccessType(StoreAccessType storeAccessType) { this.storeAccessType = storeAccessType; }

    public List<String> getStoreIds() { return storeIds; }
    public void setStoreIds(List<String> storeIds) { this.storeIds = storeIds; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public InvitationStatus getStatus() { return status; }
    public void setStatus(InvitationStatus status) { this.status = status; }

    public String getInvitedBy() { return invitedBy; }
    public void setInvitedBy(String invitedBy) { this.invitedBy = invitedBy; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Instant acceptedAt) { this.acceptedAt = acceptedAt; }

    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }
}
