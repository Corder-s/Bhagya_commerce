package com.bhagya.commerce.ai.tool;

import com.bhagya.commerce.ai.domain.AIActionConfirmation;

public record AIToolResult(
    boolean success,
    Object data,
    String errorMessage,
    AIActionConfirmation pendingAction
) {
    public static AIToolResult success(Object data) {
        return new AIToolResult(true, data, null, null);
    }

    public static AIToolResult failure(String errorMessage) {
        return new AIToolResult(false, null, errorMessage, null);
    }

    public static AIToolResult requiresConfirmation(AIActionConfirmation pendingAction) {
        return new AIToolResult(true, pendingAction, null, pendingAction);
    }
}
