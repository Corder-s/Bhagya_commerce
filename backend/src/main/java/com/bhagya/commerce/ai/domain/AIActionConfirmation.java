package com.bhagya.commerce.ai.domain;

import java.time.Instant;
import java.util.Map;

public class AIActionConfirmation {
    private String id;
    private String conversationId;
    private String userId;
    private String storeId;
    private String actionType;
    private AIActionStatus status;
    private String summary;
    private Map<String, Object> actionPayload;
    private Map<String, Object> executionResult;
    private Instant createdAt;
    private Instant confirmedAt;
    private Instant expiresAt;

    public AIActionConfirmation() {}

    public AIActionConfirmation(
        String id,
        String conversationId,
        String userId,
        String storeId,
        String actionType,
        AIActionStatus status,
        String summary,
        Map<String, Object> actionPayload,
        Map<String, Object> executionResult,
        Instant createdAt,
        Instant confirmedAt,
        Instant expiresAt
    ) {
        this.id = id;
        this.conversationId = conversationId;
        this.userId = userId;
        this.storeId = storeId;
        this.actionType = actionType;
        this.status = status != null ? status : AIActionStatus.PENDING_CONFIRMATION;
        this.summary = summary;
        this.actionPayload = actionPayload;
        this.executionResult = executionResult;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.confirmedAt = confirmedAt;
        this.expiresAt = expiresAt != null ? expiresAt : this.createdAt.plusSeconds(900); // 15 min TTL
    }

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    public boolean isPending() {
        return status == AIActionStatus.PENDING_CONFIRMATION && !isExpired();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }

    public AIActionStatus getStatus() { return status; }
    public void setStatus(AIActionStatus status) { this.status = status; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public Map<String, Object> getActionPayload() { return actionPayload; }
    public void setActionPayload(Map<String, Object> actionPayload) { this.actionPayload = actionPayload; }

    public Map<String, Object> getExecutionResult() { return executionResult; }
    public void setExecutionResult(Map<String, Object> executionResult) { this.executionResult = executionResult; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(Instant confirmedAt) { this.confirmedAt = confirmedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
