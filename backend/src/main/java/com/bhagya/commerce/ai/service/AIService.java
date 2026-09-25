package com.bhagya.commerce.ai.service;

import com.bhagya.commerce.ai.dto.AIChatRequest;
import com.bhagya.commerce.ai.dto.AIChatResponse;
import com.bhagya.commerce.ai.dto.AICreateConversationRequest;
import com.bhagya.commerce.ai.dto.AIConversationResponse;
import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ProductService productService;
    private final com.bhagya.commerce.analytics.service.AnalyticsAggregationService analyticsService;
    private final Map<String, AIConversationRecord> conversations = new ConcurrentHashMap<>();

    public AIService(
        ProductService productService,
        com.bhagya.commerce.analytics.service.AnalyticsAggregationService analyticsService
    ) {
        this.productService = productService;
        this.analyticsService = analyticsService;
        seedSampleConversation();
    }

    private void seedSampleConversation() {
        String convId = "conv_sample_1";
        AIConversationRecord rec = new AIConversationRecord(
            convId,
            "usr_cust_1",
            "Banarasi Silk Inquiry",
            "CUSTOMER",
            new ArrayList<>(List.of(
                Map.of("role", "user", "text", "Looking for pure handloom Banarasi saree for wedding", "time", Instant.now().minusSeconds(120).toString()),
                Map.of("role", "assistant", "text", "I recommend our GI-tagged Handloom Banarasi Katan Silk Saree in Crimson Red with zari weaving.", "time", Instant.now().minusSeconds(110).toString())
            )),
            Instant.now()
        );
        conversations.put(convId, rec);
    }

    public AIChatResponse processChat(AIChatRequest request, String userId) {
        String convId = request.conversationId();
        if (convId == null || !conversations.containsKey(convId)) {
            convId = "conv_" + UUID.randomUUID().toString().substring(0, 8);
            conversations.put(convId, new AIConversationRecord(
                convId,
                userId,
                "Conversation " + convId,
                request.contextMode() != null ? request.contextMode() : "CUSTOMER",
                new ArrayList<>(),
                Instant.now()
            ));
        }

        AIConversationRecord record = conversations.get(convId);
        record.messages().add(Map.of(
            "role", "user",
            "text", request.message(),
            "time", Instant.now().toString()
        ));

        // Intelligent safe assistant dispatch
        String lower = request.message().toLowerCase();
        String reply;
        String intent;
        List<Map<String, Object>> suggestedActions = new ArrayList<>();
        List<Map<String, Object>> referencedItems = new ArrayList<>();

        if (lower.contains("saree") || lower.contains("silk") || lower.contains("banarasi") || lower.contains("recommend")) {
            intent = "PRODUCT_DISCOVERY";
            reply = "Here are our most authentic GI-certified handloom silk selections crafted by master artisans:";
            List<ProductResponse> products = productService.getProducts(null, null, null, null, null, "popular", 0, 3).items();
            for (ProductResponse p : products) {
                referencedItems.add(Map.of(
                    "id", p.id(),
                    "name", p.name(),
                    "price", p.price(),
                    "mrp", p.mrp(),
                    "rating", 4.9
                ));
            }
            suggestedActions.add(Map.of("label", "View Banarasi Collection", "action", "/shop?category=sarees"));
            suggestedActions.add(Map.of("label", "Check GI-Certificate", "action", "/about#gi-tag"));
        } else if (lower.contains("order") || lower.contains("track") || lower.contains("where is")) {
            intent = "ORDER_INQUIRY";
            reply = "I found your active order BG-20260925-884102. It has been dispatched via Delhivery Express and is currently out for delivery.";
            suggestedActions.add(Map.of("label", "Track Order", "action", "/orders/ord_101/tracking"));
        } else if (lower.contains("sales") || lower.contains("inventory") || lower.contains("merchant") || lower.contains("revenue") || lower.contains("analytics")) {
            intent = "MERCHANT_ANALYTICS";
            var sales = analyticsService.calculateSalesSummary("store_varanasi_silk", "30d", null, null);
            reply = String.format("Your store has recorded ₹%s in gross sales (₹%s net) across %d verified orders in the last 30 days. Average Order Value is ₹%s.",
                sales.grossSales().toPlainString(),
                sales.netSales().toPlainString(),
                sales.totalOrders(),
                sales.averageOrderValue().toPlainString()
            );
            suggestedActions.add(Map.of("label", "Open Analytics", "action", "/merchant/analytics"));
            suggestedActions.add(Map.of("label", "Open Dashboard", "action", "/merchant/dashboard"));
            suggestedActions.add(Map.of("label", "Restock Inventory", "action", "/merchant/inventory"));
        } else {
            intent = "GENERAL_ASSIST";
            reply = "Namaste! I am Bhagya AI, your companion for verified Indian handcrafts and artisan heritage. How may I assist you today?";
            suggestedActions.add(Map.of("label", "Explore Shop", "action", "/shop"));
            suggestedActions.add(Map.of("label", "Explore GI Crafts", "action", "/categories"));
        }

        record.messages().add(Map.of(
            "role", "assistant",
            "text", reply,
            "time", Instant.now().toString()
        ));
        record.setLastMessageAt(Instant.now());

        return new AIChatResponse(
            "msg_" + UUID.randomUUID().toString().substring(0, 8),
            convId,
            reply,
            intent,
            suggestedActions,
            referencedItems,
            Instant.now()
        );
    }

    public List<AIConversationResponse> getConversationsForUser(String userId) {
        return conversations.values().stream()
            .filter(c -> c.userId().equals(userId))
            .map(c -> new AIConversationResponse(
                c.id(),
                c.title(),
                c.mode(),
                c.messages().size(),
                c.lastMessageAt(),
                c.messages()
            ))
            .toList();
    }

    public AIConversationResponse getConversation(String id, String userId) {
        AIConversationRecord rec = conversations.get(id);
        if (rec == null || !rec.userId().equals(userId)) {
            throw new ResourceNotFoundException("Conversation not found: " + id);
        }
        return new AIConversationResponse(
            rec.id(),
            rec.title(),
            rec.mode(),
            rec.messages().size(),
            rec.lastMessageAt(),
            rec.messages()
        );
    }

    public AIConversationResponse createConversation(AICreateConversationRequest request, String userId) {
        String id = "conv_" + UUID.randomUUID().toString().substring(0, 8);
        String title = request.title() != null && !request.title().isBlank() ? request.title() : "New Conversation";
        String mode = request.mode() != null ? request.mode() : "CUSTOMER";

        AIConversationRecord rec = new AIConversationRecord(id, userId, title, mode, new ArrayList<>(), Instant.now());
        conversations.put(id, rec);

        return new AIConversationResponse(id, title, mode, 0, Instant.now(), List.of());
    }

    public void deleteConversation(String id, String userId) {
        AIConversationRecord rec = conversations.get(id);
        if (rec != null && rec.userId().equals(userId)) {
            conversations.remove(id);
        }
    }

    public static class AIConversationRecord {
        private final String id;
        private final String userId;
        private final String title;
        private final String mode;
        private final List<Map<String, Object>> messages;
        private Instant lastMessageAt;

        public AIConversationRecord(String id, String userId, String title, String mode, List<Map<String, Object>> messages, Instant lastMessageAt) {
            this.id = id;
            this.userId = userId;
            this.title = title;
            this.mode = mode;
            this.messages = messages;
            this.lastMessageAt = lastMessageAt;
        }

        public String id() { return id; }
        public String userId() { return userId; }
        public String title() { return title; }
        public String mode() { return mode; }
        public List<Map<String, Object>> messages() { return messages; }
        public Instant lastMessageAt() { return lastMessageAt; }
        public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    }
}
