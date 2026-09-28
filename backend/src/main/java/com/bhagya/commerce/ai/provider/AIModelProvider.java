package com.bhagya.commerce.ai.provider;

import com.bhagya.commerce.ai.dto.AIChatResponse;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import java.util.List;
import java.util.Map;

public interface AIModelProvider {
    AIChatResponse process(
        String conversationId,
        String userMessage,
        AIToolContext context,
        List<AITool> availableTools,
        Map<String, Object> metadata
    );
}
