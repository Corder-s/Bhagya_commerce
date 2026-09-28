package com.bhagya.commerce.ai.repository;

import com.bhagya.commerce.ai.domain.AIContextMode;
import com.bhagya.commerce.ai.domain.AIConversation;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Repository;

@Repository
public class AIConversationRepository {

    private final Map<String, AIConversation> storage = new ConcurrentHashMap<>();

    public AIConversationRepository() {
        seedInitialConversations();
    }

    private void seedInitialConversations() {
        Instant now = Instant.now();
        AIConversation c1 = new AIConversation(
            "conv_customer_01",
            "usr_dev_customer_01",
            "store_main",
            AIContextMode.CUSTOMER,
            "Banarasi Silk & Shipping Inquiry",
            now.minusSeconds(86400 * 2),
            now.minusSeconds(86400 * 2)
        );
        storage.put(c1.getId(), c1);

        AIConversation c2 = new AIConversation(
            "conv_merchant_01",
            "usr_dev_merchant_01",
            "store_main",
            AIContextMode.MERCHANT,
            "Store Sales & Inventory Analysis",
            now.minusSeconds(86400),
            now.minusSeconds(86400)
        );
        storage.put(c2.getId(), c2);
    }

    public Optional<AIConversation> findById(String id) {
        return Optional.ofNullable(storage.get(id));
    }

    public List<AIConversation> findByUserId(String userId) {
        return storage.values().stream()
            .filter(c -> Objects.equals(c.getUserId(), userId))
            .sorted(Comparator.comparing(AIConversation::getUpdatedAt).reversed())
            .toList();
    }

    public List<AIConversation> findByUserIdAndStoreId(String userId, String storeId) {
        return storage.values().stream()
            .filter(c -> Objects.equals(c.getUserId(), userId) && (storeId == null || Objects.equals(c.getStoreId(), storeId)))
            .sorted(Comparator.comparing(AIConversation::getUpdatedAt).reversed())
            .toList();
    }

    public AIConversation save(AIConversation conversation) {
        if (conversation.getId() == null) {
            conversation.setId("conv_" + UUID.randomUUID().toString().substring(0, 8));
        }
        conversation.setUpdatedAt(Instant.now());
        storage.put(conversation.getId(), conversation);
        return conversation;
    }

    public void deleteById(String id) {
        storage.remove(id);
    }
}
