package com.bhagya.commerce.ai.tool;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import java.util.Map;

public interface AITool {
    String name();
    String description();
    AIToolCategory category();
    boolean requiresConfirmation();
    String requiredPermission(); // Null for public customer tools

    default boolean isAllowed(AIToolContext context) {
        if (requiredPermission() == null) {
            return true;
        }
        return context.hasPermission(requiredPermission());
    }

    AIToolResult execute(AIToolContext context, Map<String, Object> parameters);
}
