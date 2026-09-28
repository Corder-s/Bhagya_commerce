package com.bhagya.commerce.team.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class TeamMember {

    private String id;
    private String organizationId;
    private String userId;
    private String name;
    private String email;
    private String avatarUrl;
    private RoleCode role;
    private StoreAccessType storeAccessType = StoreAccessType.ALL_STORES;
    private List<String> storeIds = new ArrayList<>();
    private MemberStatus status = MemberStatus.ACTIVE;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();

    public TeamMember() {}

    public TeamMember(String id, String organizationId, String userId, String name, String email, RoleCode role) {
        this.id = id;
        this.organizationId = organizationId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = MemberStatus.ACTIVE;
        this.storeAccessType = StoreAccessType.ALL_STORES;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public RoleCode getRole() { return role; }
    public void setRole(RoleCode role) { this.role = role; }

    public StoreAccessType getStoreAccessType() { return storeAccessType; }
    public void setStoreAccessType(StoreAccessType storeAccessType) { this.storeAccessType = storeAccessType; }

    public List<String> getStoreIds() { return storeIds; }
    public void setStoreIds(List<String> storeIds) { this.storeIds = storeIds; }

    public MemberStatus getStatus() { return status; }
    public void setStatus(MemberStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
