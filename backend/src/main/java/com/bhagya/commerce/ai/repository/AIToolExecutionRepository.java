package com.bhagya.commerce.ai.repository;

import com.bhagya.commerce.ai.domain.AIToolExecution;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class AIToolExecutionRepository {

    private final Map<String, AIToolExecution> storage = new ConcurrentHashMap<>();

    public List<AIToolExecution> findByConversationId(String conversationId) {
        return storage.values().stream()
            .filter(t -> Objects.equals(t.getConversationId(), conversationId))
            .sorted(Comparator.comparing(AIToolExecution::getExecutedAt))
            .toList();
    }

    public Optional<AIToolExecution> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public AIToolExecution save(AIToolExecution execution) {
        if (execution.getId() == null) {
            execution.setId("tool_exec_" + UUID.randomUUID().toString().substring(0, 8));
        }
        storage.put(execution.getId(), execution);
        return execution;
    }
}
