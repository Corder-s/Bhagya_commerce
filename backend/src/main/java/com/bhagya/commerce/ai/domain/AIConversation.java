package com.bhagya.commerce.ai.domain;

import java.time.Instant;

public class AIConversation {
    private String id;
    private String userId;
    private String storeId;
    private AIContextMode contextMode;
    private String title;
    private Instant createdAt;
    private Instant updatedAt;

    public AIConversation() {}

    public AIConversation(
        String id,
        String userId,
        String storeId,
        AIContextMode contextMode,
        String title,
        Instant createdAt,
        Instant updatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.storeId = storeId;
        this.contextMode = contextMode != null ? contextMode : AIContextMode.CUSTOMER;
        this.title = title != null && !title.isBlank() ? title : "New Conversation";
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : this.createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public AIContextMode getContextMode() { return contextMode; }
    public void setContextMode(AIContextMode contextMode) { this.contextMode = contextMode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
