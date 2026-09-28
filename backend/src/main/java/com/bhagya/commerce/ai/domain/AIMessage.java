package com.bhagya.commerce.ai.domain;

import java.time.Instant;
import java.util.Map;

public class AIMessage {
    private String id;
    private String conversationId;
    private AIMessageRole role;
    private String content;
    private String intent;
    private Map<String, Object> structuredData;
    private Instant createdAt;

    public AIMessage() {}

    public AIMessage(
        String id,
        String conversationId,
        AIMessageRole role,
        String content,
        String intent,
        Map<String, Object> structuredData,
        Instant createdAt
    ) {
        this.id = id;
        this.conversationId = conversationId;
        this.role = role != null ? role : AIMessageRole.USER;
        this.content = content != null ? content : "";
        this.intent = intent;
        this.structuredData = structuredData;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public AIMessageRole getRole() { return role; }
    public void setRole(AIMessageRole role) { this.role = role; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getIntent() { return intent; }
    public void setIntent(String intent) { this.intent = intent; }

    public Map<String, Object> getStructuredData() { return structuredData; }
    public void setStructuredData(Map<String, Object> structuredData) { this.structuredData = structuredData; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
