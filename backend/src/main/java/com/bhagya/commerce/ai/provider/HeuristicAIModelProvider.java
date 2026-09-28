package com.bhagya.commerce.ai.provider;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.dto.AIActionConfirmationDto;
import com.bhagya.commerce.ai.dto.AIChatResponse;
import com.bhagya.commerce.ai.dto.AIToolCallDto;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Component;

@Component
public class HeuristicAIModelProvider implements AIModelProvider {

    @Override
    public AIChatResponse process(
        String conversationId,
        String userMessage,
        AIToolContext context,
        List<AITool> availableTools,
        Map<String, Object> metadata
    ) {
        String msgId = "msg_" + UUID.randomUUID().toString().substring(0, 8);
        Instant now = Instant.now();

        // 1. Prompt Injection Defense & Sanitization
        String sanitized = sanitizePrompt(userMessage);
        String lower = sanitized.toLowerCase();

        // Detect if prompt attempts injection / system prompt leakage
        if (lower.contains("ignore previous instructions") || lower.contains("reveal system prompt") || lower.contains("ignore all instructions")) {
            return new AIChatResponse(
                msgId,
                conversationId,
                "I am Bhagya AI, dedicated to assisting you with authentic handcrafted commerce and verified store operations. How may I assist you today?",
                "GENERAL_ASSIST",
                List.of(Map.of("label", "Explore Catalog", "action", "/shop")),
                List.of(),
                List.of(),
                null,
                null,
                now
            );
        }

        List<AIToolCallDto> toolCalls = new ArrayList<>();
        Map<String, Object> structuredData = null;
        AIActionConfirmationDto actionConfirmation = null;
        List<Map<String, Object>> suggestedActions = new ArrayList<>();
        List<Map<String, Object>> referencedItems = new ArrayList<>();
        String reply;
        String intent;

        // Safety guard against prompt injection, system prompt extraction, or privilege override
        if (lower.contains("[filtered_command]") || lower.contains("ignore previous") || lower.contains("system prompt") || lower.contains("sql table")) {
            return new AIChatResponse(
                "msg_" + UUID.randomUUID().toString().substring(0, 8),
                conversationId,
                "I am Bhagya AI, your heritage commerce assistant. I operate under strict security boundaries and cannot disclose system prompts, internal tables, or execute unauthorized instructions. How may I help you explore our handcrafted artisan catalog?",
                "SAFETY_GUARD",
                List.of(Map.of("label", "Browse Handcrafted Items", "action", "/shop")),
                List.of(),
                Instant.now()
            );
        }

        // 2. Customer Context Routing
        if (context.isCustomer()) {
            if (lower.contains("order") || lower.contains("track") || lower.contains("package") || lower.contains("delivery") || lower.contains("where is")) {
                intent = "ORDER_LOOKUP";
                Optional<AITool> trackingTool = findTool(availableTools, "getMyShipmentTracking");
                if (trackingTool.isPresent()) {
                    long t0 = System.currentTimeMillis();
                    AIToolResult res = trackingTool.get().execute(context, metadata != null ? metadata : Map.of());
                    long duration = System.currentTimeMillis() - t0;

                    toolCalls.add(new AIToolCallDto(
                        "tc_" + UUID.randomUUID().toString().substring(0, 6),
                        "getMyShipmentTracking",
                        "READ_ONLY",
                        res.success() ? "COMPLETED" : "FAILED",
                        Map.of(),
                        res.success() ? (Map<String, Object>) res.data() : Map.of("error", res.errorMessage()),
                        duration
                    ));

                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        structuredData = Map.of("type", "order_lookup", "data", data);
                        reply = String.format(
                            "Here is your verified delivery tracking for Order **#%s**:\n\n- **Status:** %s\n- **Courier:** %s\n- **Tracking Number:** `%s`\n- **Latest Event:** %s\n\n%s",
                            data.get("orderNumber"),
                            data.get("orderStatus"),
                            data.get("carrier"),
                            data.get("trackingNumber"),
                            data.get("latestCheckpoint"),
                            data.get("statusDescription")
                        );
                        suggestedActions.add(Map.of("label", "Full Tracking Page", "action", "/account/orders"));
                    } else {
                        reply = "I checked your account, but couldn't locate any recent active orders. You can view your purchase history in your Patron Orders page.";
                        suggestedActions.add(Map.of("label", "View All Orders", "action", "/account/orders"));
                    }
                } else {
                    reply = "Order tracking is currently unavailable for guest visitors. Please log in to view your orders.";
                    suggestedActions.add(Map.of("label", "Patron Sign In", "action", "/login"));
                }
            } else if (lower.contains("point") || lower.contains("loyalty") || lower.contains("reward") || lower.contains("tier") || lower.contains("balance")) {
                intent = "LOYALTY_INQUIRY";
                Optional<AITool> balanceTool = findTool(availableTools, "getMyLoyaltyBalance");
                Optional<AITool> rewardsTool = findTool(availableTools, "getAvailableRewards");

                if (balanceTool.isPresent()) {
                    AIToolResult res = balanceTool.get().execute(context, Map.of());
                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        reply = String.format(
                            "You currently have **%s points** available as an **%s** patron!\n\nEvery 100 points can be redeemed for handcrafted discount vouchers. You earn +%s bonus points on your current tier.",
                            data.get("availablePoints"),
                            data.get("tierDisplayName"),
                            data.get("multiplier")
                        );
                        suggestedActions.add(Map.of("label", "Redeem Rewards", "action", "/account/loyalty"));
                        suggestedActions.add(Map.of("label", "Refer Friends (+500 pts)", "action", "/account/referrals"));
                    } else {
                        reply = "Sign up for our Artisan Guild Loyalty Program to start earning points on every purchase!";
                        suggestedActions.add(Map.of("label", "Join Artisan Guild", "action", "/account/loyalty"));
                    }
                } else {
                    reply = "Sign up for our Artisan Guild Loyalty Program to start earning points on every purchase!";
                    suggestedActions.add(Map.of("label", "Join Artisan Guild", "action", "/account/loyalty"));
                }
            } else if (lower.contains("refer") || lower.contains("invite") || lower.contains("friend")) {
                intent = "REFERRAL_INQUIRY";
                Optional<AITool> refTool = findTool(availableTools, "getMyReferralStatus");
                if (refTool.isPresent()) {
                    AIToolResult res = refTool.get().execute(context, Map.of());
                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        reply = String.format(
                            "Your unique referral code is **`%s`**!\n\nShare your link (`%s`) with friends. When they complete their first handcrafted purchase, they get a welcome reward and you receive **+%s bonus points**!",
                            data.get("referralCode"),
                            data.get("referralUrl"),
                            data.get("rewardPerReferral")
                        );
                        suggestedActions.add(Map.of("label", "Open Referral Dashboard", "action", "/account/referrals"));
                    } else {
                        reply = "Share Bhagya Commerce with friends and earn points on their first order!";
                        suggestedActions.add(Map.of("label", "Refer & Earn", "action", "/account/referrals"));
                    }
                } else {
                    reply = "Share Bhagya Commerce with friends and earn points on their first order!";
                    suggestedActions.add(Map.of("label", "Refer & Earn", "action", "/account/referrals"));
                }
            } else if (lower.contains("return") || lower.contains("policy") || lower.contains("authentic") || lower.contains("gi tag") || lower.contains("ship")) {
                intent = "POLICY_INQUIRY";
                reply = "Here are our official Bhagya Commerce patron protection policies:\n\n" +
                        "1. **7-Day Handcrafted Returns:** Hassle-free returns on all non-perishable artisan products with original artisan tags.\n" +
                        "2. **GI Authenticity Guarantee:** Every GI-certified craft includes provenance certification cards.\n" +
                        "3. **Pan-India Delivery:** Insured safe transit within 3-5 business days.";
                suggestedActions.add(Map.of("label", "Read Full Policies", "action", "/faq"));
            } else {
                // Product discovery
                intent = "PRODUCT_DISCOVERY";
                Optional<AITool> searchTool = findTool(availableTools, "searchProducts");
                String q = extractSearchKeywords(userMessage);

                if (searchTool.isPresent()) {
                    long t0 = System.currentTimeMillis();
                    AIToolResult res = searchTool.get().execute(context, Map.of("query", q));
                    long duration = System.currentTimeMillis() - t0;

                    toolCalls.add(new AIToolCallDto(
                        "tc_" + UUID.randomUUID().toString().substring(0, 6),
                        "searchProducts",
                        "READ_ONLY",
                        "COMPLETED",
                        Map.of("query", q),
                        res.success() ? (Map<String, Object>) res.data() : Map.of(),
                        duration
                    ));

                    if (res.success() && res.data() instanceof Map<?, ?> data && data.get("products") instanceof List<?> list && !list.isEmpty()) {
                        for (Object o : list) {
                            if (o instanceof Map<?, ?> p) {
                                referencedItems.add(Map.of(
                                    "productId", p.get("productId"),
                                    "name", p.get("name"),
                                    "slug", p.get("slug"),
                                    "price", p.get("price"),
                                    "inStock", p.get("inStock"),
                                    "imageSrc", p.get("imageSrc")
                                ));
                            }
                        }
                        structuredData = Map.of("type", "product_recommendations", "data", referencedItems);
                        reply = String.format("I found %d verified handcrafted items matching '%s' directly from master artisan clusters:", referencedItems.size(), q);
                        suggestedActions.add(Map.of("label", "Browse All Handcrafted Items", "action", "/shop"));
                    } else {
                        reply = "Here are some of our most celebrated GI-certified handloom and organic artisan pieces:";
                        suggestedActions.add(Map.of("label", "Explore Catalog", "action", "/shop"));
                    }
                } else {
                    reply = "Welcome to Bhagya Commerce! How can I assist you with authentic handcrafted products, GI-tagged weaves, or order tracking today?";
                    suggestedActions.add(Map.of("label", "Explore Catalog", "action", "/shop"));
                }
            }
        } else {
            // 3. Merchant Context Routing
            if (lower.contains("sales") || lower.contains("revenue") || lower.contains("gross") || lower.contains("turnover") || lower.contains("how are sales")) {
                intent = "MERCHANT_ANALYTICS";
                Optional<AITool> salesTool = findTool(availableTools, "getSalesSummary");
                if (salesTool.isPresent()) {
                    long t0 = System.currentTimeMillis();
                    AIToolResult res = salesTool.get().execute(context, Map.of("period", "30d"));
                    long duration = System.currentTimeMillis() - t0;

                    toolCalls.add(new AIToolCallDto(
                        "tc_" + UUID.randomUUID().toString().substring(0, 6),
                        "getSalesSummary",
                        "READ_ONLY",
                        res.success() ? "COMPLETED" : "FAILED",
                        Map.of("period", "30d"),
                        res.success() ? (Map<String, Object>) res.data() : Map.of(),
                        duration
                    ));

                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        structuredData = Map.of("type", "merchant_sales_summary", "data", data);
                        reply = String.format(
                            "Here is your 30-day verified store performance for **%s**:\n\n- **Gross Sales:** ₹%s\n- **Net Sales:** ₹%s\n- **Total Verified Orders:** %s\n- **Average Order Value (AOV):** ₹%s",
                            data.get("storeId"),
                            data.get("grossSales"),
                            data.get("netSales"),
                            data.get("totalOrders"),
                            data.get("averageOrderValue")
                        );
                        suggestedActions.add(Map.of("label", "View Detailed Analytics", "action", "/merchant/analytics"));
                        suggestedActions.add(Map.of("label", "Inspect Recent Orders", "action", "/merchant/orders"));
                    } else {
                        reply = "Could not calculate sales analytics. Please verify your team permissions for ANALYTICS_VIEW.";
                    }
                } else {
                    reply = "You do not have the required `ANALYTICS_VIEW` permission to inspect store financial analytics.";
                }
            } else if (lower.contains("stock") && (lower.contains("update") || lower.contains("adjust") || lower.contains("set stock"))) {
                intent = "STOCK_ADJUSTMENT";
                Optional<AITool> prepStockTool = findTool(availableTools, "prepareStockAdjustment");
                if (prepStockTool.isPresent()) {
                    String pid = (String) (metadata != null ? metadata.getOrDefault("productId", "prod_1") : "prod_1");
                    int newStock = 25;
                    AIToolResult res = prepStockTool.get().execute(context, Map.of("productId", pid, "newStock", newStock));

                    if (res.pendingAction() != null) {
                        var pa = res.pendingAction();
                        actionConfirmation = new AIActionConfirmationDto(
                            pa.getId(),
                            pa.getActionType(),
                            pa.getStatus().name(),
                            pa.getSummary(),
                            pa.getActionPayload(),
                            pa.getExpiresAt()
                        );
                        structuredData = Map.of("type", "write_action_confirmation", "data", actionConfirmation);
                        reply = "I have prepared the inventory stock adjustment. Because this mutates your live catalogue, please confirm the action below:";
                    } else {
                        reply = "Unable to prepare stock adjustment: " + res.errorMessage();
                    }
                } else {
                    reply = "You do not have the required `INVENTORY_MANAGE` permission to adjust product inventory.";
                }
            } else if (lower.contains("inventory") || lower.contains("low stock") || lower.contains("restock") || lower.contains("out of stock")) {
                intent = "INVENTORY_INTELLIGENCE";
                Optional<AITool> invTool = findTool(availableTools, "getInventoryStatus");
                if (invTool.isPresent()) {
                    AIToolResult res = invTool.get().execute(context, Map.of());
                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        structuredData = Map.of("type", "inventory_warning", "data", data);
                        reply = String.format(
                            "You have **%s products** currently at or below the safety inventory threshold (10 units). Restocking recommended to prevent lost orders.",
                            data.get("lowStockCount")
                        );
                        suggestedActions.add(Map.of("label", "Open Inventory Table", "action", "/merchant/inventory"));
                    } else {
                        reply = "All products currently maintain healthy inventory levels.";
                    }
                } else {
                    reply = "Inventory monitoring requires `INVENTORY_VIEW` permission.";
                }
            } else if (lower.contains("cancel") && lower.contains("order")) {
                intent = "ORDER_CANCELLATION";
                Optional<AITool> cancelTool = findTool(availableTools, "prepareOrderCancellation");
                if (cancelTool.isPresent()) {
                    String ordNum = (String) (metadata != null ? metadata.getOrDefault("orderNumber", "ORD-2026-9812") : "ORD-2026-9812");
                    AIToolResult res = cancelTool.get().execute(context, Map.of("orderNumber", ordNum));
                    if (res.pendingAction() != null) {
                        var pa = res.pendingAction();
                        actionConfirmation = new AIActionConfirmationDto(
                            pa.getId(),
                            pa.getActionType(),
                            pa.getStatus().name(),
                            pa.getSummary(),
                            pa.getActionPayload(),
                            pa.getExpiresAt()
                        );
                        structuredData = Map.of("type", "write_action_confirmation", "data", actionConfirmation);
                        reply = "I have prepared the order cancellation and points reversal. Please review the details and confirm:";
                    } else {
                        reply = "Could not prepare order cancellation: " + res.errorMessage();
                    }
                } else {
                    reply = "Order cancellation requires `ORDER_MANAGE` permission.";
                }
            } else if (lower.contains("review") || lower.contains("feedback") || lower.contains("customer rating")) {
                intent = "REVIEW_INTELLIGENCE";
                Optional<AITool> reviewTool = findTool(availableTools, "getReviewInsights");
                if (reviewTool.isPresent()) {
                    AIToolResult res = reviewTool.get().execute(context, Map.of());
                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        reply = String.format(
                            "Your store holds an average rating of **%s / 5.0** across **%s verified reviews** (%s).\n\n**Key Patron Highlights:**\n- Handloom luster and genuine zari certified provenance\n- Responsive courier updates and museum-grade packaging",
                            data.get("averageRating"),
                            data.get("totalReviews"),
                            data.get("sentiment")
                        );
                        suggestedActions.add(Map.of("label", "Manage Reviews & Moderation", "action", "/merchant/reviews"));
                    } else {
                        reply = "Could not calculate review insights.";
                    }
                } else {
                    reply = "Review insights require `REVIEW_VIEW` permission.";
                }
            } else if (lower.contains("draft") || lower.contains("description") || lower.contains("listing") || lower.contains("campaign") || lower.contains("whatsapp")) {
                intent = "CONTENT_DRAFTING";
                Optional<AITool> descTool = findTool(availableTools, "draftProductDescription");
                if (descTool.isPresent()) {
                    AIToolResult res = descTool.get().execute(context, Map.of("title", "Katan Silk Handloom Sari"));
                    if (res.success() && res.data() instanceof Map<?, ?> data) {
                        reply = String.format(
                            "Here is an artisan storytelling draft ready for your catalog:\n\n> \"%s\"\n\n**Care Notes:** %s",
                            data.get("storytellingBlurb"),
                            data.get("careInstructions")
                        );
                        suggestedActions.add(Map.of("label", "Apply to Product Listing", "action", "/merchant/products"));
                    } else {
                        reply = "Unable to draft content at this time.";
                    }
                } else {
                    reply = "Content generation tools require `AI_MERCHANT_COPILOT` permission.";
                }
            } else {
                intent = "MERCHANT_GENERAL";
                reply = "Namaste! I am your Bhagya Merchant Copilot. I can summarize today's revenue, flag low-stock items, analyze customer reviews, or draft marketing copy. How can I assist your store?";
                suggestedActions.add(Map.of("label", "30-Day Sales Report", "action", "/merchant/analytics"));
                suggestedActions.add(Map.of("label", "Low Stock Products", "action", "/merchant/inventory"));
            }
        }

        return new AIChatResponse(
            msgId,
            conversationId,
            reply,
            intent,
            suggestedActions,
            referencedItems,
            toolCalls,
            structuredData,
            actionConfirmation,
            now
        );
    }

    private Optional<AITool> findTool(List<AITool> tools, String name) {
        if (tools == null) return Optional.empty();
        return tools.stream().filter(t -> t.name().equalsIgnoreCase(name)).findFirst();
    }

    private String sanitizePrompt(String input) {
        if (input == null) return "";
        return input.trim()
            .replaceAll("(?i)<script.*?>.*?</script>", "")
            .replaceAll("(?i)<.*?javascript:.*?>", "");
    }

    private String extractSearchKeywords(String msg) {
        String cleaned = msg.toLowerCase()
            .replaceAll("(show me|find|recommend|looking for|under|rupees|rs|inr|please|help me buy)", "")
            .trim();
        return cleaned.isBlank() ? "handloom" : cleaned;
    }
}
