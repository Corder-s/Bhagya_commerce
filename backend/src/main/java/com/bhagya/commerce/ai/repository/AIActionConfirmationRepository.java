package com.bhagya.commerce.ai.repository;

import com.bhagya.commerce.ai.domain.AIActionConfirmation;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class AIActionConfirmationRepository {

    private final Map<String, AIActionConfirmation> storage = new ConcurrentHashMap<>();

    public Optional<AIActionConfirmation> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<AIActionConfirmation> findByUserId(String userId) {
        return storage.values().stream()
            .filter(a -> Objects.equals(a.getUserId(), userId))
            .sorted(Comparator.comparing(AIActionConfirmation::getCreatedAt).reversed())
            .toList();
    }

    public AIActionConfirmation save(AIActionConfirmation action) {
        if (action.getId() == null) {
            action.setId("act_" + UUID.randomUUID().toString().substring(0, 8));
        }
        storage.put(action.getId(), action);
        return action;
    }
}
