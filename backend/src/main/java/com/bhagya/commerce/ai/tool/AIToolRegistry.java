package com.bhagya.commerce.ai.tool;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class AIToolRegistry {

    private final Map<String, AITool> tools = new ConcurrentHashMap<>();

    public AIToolRegistry(List<AITool> toolList) {
        if (toolList != null) {
            for (AITool tool : toolList) {
                tools.put(tool.name(), tool);
            }
        }
    }

    public Optional<AITool> getTool(String name) {
        return Optional.ofNullable(tools.get(name));
    }

    public List<AITool> getAvailableTools(AIToolContext context) {
        return tools.values().stream()
            .filter(t -> {
                if (context.isCustomer()) {
                    // Customer context: allow only customer tools (those without merchant permissions)
                    return t.requiredPermission() == null;
                } else {
                    // Merchant context: enforce permission check
                    return t.isAllowed(context);
                }
            })
            .sorted(Comparator.comparing(AITool::name))
            .toList();
    }

    public Collection<AITool> getAllTools() {
        return Collections.unmodifiableCollection(tools.values());
    }
}
