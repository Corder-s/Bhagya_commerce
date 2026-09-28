package com.bhagya.commerce.ai.repository;

import com.bhagya.commerce.ai.domain.AIMessage;
import com.bhagya.commerce.ai.domain.AIMessageRole;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class AIMessageRepository {

    private final Map<String, AIMessage> storage = new ConcurrentHashMap<>();

    public AIMessageRepository() {
        seedInitialMessages();
    }

    private void seedInitialMessages() {
        Instant now = Instant.now();
        AIMessage m1 = new AIMessage(
            "msg_init_01",
            "conv_customer_01",
            AIMessageRole.USER,
            "Where is my latest order?",
            "ORDER_INQUIRY",
            null,
            now.minusSeconds(86400 * 2)
        );
        storage.put(m1.getId(), m1);

        AIMessage m2 = new AIMessage(
            "msg_init_02",
            "conv_customer_01",
            AIMessageRole.ASSISTANT,
            "Your order #ORD-2026-9812 has shipped via BlueDart Express and is currently in transit to New Delhi.",
            "ORDER_INQUIRY",
            Map.of("orderNumber", "ORD-2026-9812", "status", "SHIPPED"),
            now.minusSeconds(86400 * 2 - 2)
        );
        storage.put(m2.getId(), m2);
    }

    public List<AIMessage> findByConversationId(String conversationId) {
        return storage.values().stream()
            .filter(m -> Objects.equals(m.getConversationId(), conversationId))
            .sorted(Comparator.comparing(AIMessage::getCreatedAt))
            .toList();
    }

    public Optional<AIMessage> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public AIMessage save(AIMessage message) {
        if (message.getId() == null) {
            message.setId("msg_" + UUID.randomUUID().toString().substring(0, 8));
        }
        storage.put(message.getId(), message);
        return message;
    }

    public void deleteByConversationId(String conversationId) {
        storage.entrySet().removeIf(e -> Objects.equals(e.getValue().getConversationId(), conversationId));
    }
}
