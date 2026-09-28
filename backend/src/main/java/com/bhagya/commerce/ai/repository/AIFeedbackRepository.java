package com.bhagya.commerce.ai.repository;

import com.bhagya.commerce.ai.domain.AIFeedback;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class AIFeedbackRepository {

    private final Map<String, AIFeedback> storage = new ConcurrentHashMap<>();

    public Optional<AIFeedback> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<AIFeedback> findByUserId(String userId) {
        return storage.values().stream()
            .filter(f -> Objects.equals(f.getUserId(), userId))
            .sorted(Comparator.comparing(AIFeedback::getCreatedAt).reversed())
            .toList();
    }

    public AIFeedback save(AIFeedback feedback) {
        if (feedback.getId() == null) {
            feedback.setId("fb_" + UUID.randomUUID().toString().substring(0, 8));
        }
        storage.put(feedback.getId(), feedback);
        return feedback;
    }
}
