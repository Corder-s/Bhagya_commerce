package com.bhagya.commerce.ai.domain;

import java.time.Instant;
import java.util.Map;

public class AIToolExecution {
    private String id;
    private String conversationId;
    private String messageId;
    private String toolName;
    private AIToolCategory category;
    private AIToolStatus status;
    private Map<String, Object> inputParameters;
    private Map<String, Object> outputData;
    private String errorMessage;
    private Long durationMs;
    private Instant executedAt;

    public AIToolExecution() {}

    public AIToolExecution(
        String id,
        String conversationId,
        String messageId,
        String toolName,
        AIToolCategory category,
        AIToolStatus status,
        Map<String, Object> inputParameters,
        Map<String, Object> outputData,
        String errorMessage,
        Long durationMs,
        Instant executedAt
    ) {
        this.id = id;
        this.conversationId = conversationId;
        this.messageId = messageId;
        this.toolName = toolName;
        this.category = category != null ? category : AIToolCategory.READ_ONLY;
        this.status = status != null ? status : AIToolStatus.COMPLETED;
        this.inputParameters = inputParameters;
        this.outputData = outputData;
        this.errorMessage = errorMessage;
        this.durationMs = durationMs;
        this.executedAt = executedAt != null ? executedAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getToolName() { return toolName; }
    public void setToolName(String toolName) { this.toolName = toolName; }

    public AIToolCategory getCategory() { return category; }
    public void setCategory(AIToolCategory category) { this.category = category; }

    public AIToolStatus getStatus() { return status; }
    public void setStatus(AIToolStatus status) { this.status = status; }

    public Map<String, Object> getInputParameters() { return inputParameters; }
    public void setInputParameters(Map<String, Object> inputParameters) { this.inputParameters = inputParameters; }

    public Map<String, Object> getOutputData() { return outputData; }
    public void setOutputData(Map<String, Object> outputData) { this.outputData = outputData; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public Long getDurationMs() { return durationMs; }
    public void setDurationMs(Long durationMs) { this.durationMs = durationMs; }

    public Instant getExecutedAt() { return executedAt; }
    public void setExecutedAt(Instant executedAt) { this.executedAt = executedAt; }
}
