package com.bhagya.commerce.ai.tool.customer;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class GetStorePoliciesTool implements AITool {

    @Override
    public String name() {
        return "getStorePolicies";
    }

    @Override
    public String description() {
        return "Retrieve official Bhagya Commerce policies on 7-day handcrafted returns, GI authenticity, and pan-India delivery SLAs.";
    }

    @Override
    public AIToolCategory category() {
        return AIToolCategory.READ_ONLY;
    }

    @Override
    public boolean requiresConfirmation() {
        return false;
    }

    @Override
    public String requiredPermission() {
        return null;
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String topic = (String) parameters.getOrDefault("topic", "general");
        return AIToolResult.success(Map.of(
            "returnPolicy", "7-day hassle-free returns on all non-perishable handcrafted goods. Must retain original artisan tags and GI certification cards.",
            "shippingSLA", "Standard insured delivery within 3-5 business days across India. Express fragile handling available for brass and glass masterworks.",
            "authenticity", "100% verified GI-tagged provenance with direct blockchain-compatible artisan weaver guild certificates.",
            "payments", "Safe 256-bit encrypted checkout via UPI, NetBanking, Credit/Debit cards, and Cash on Delivery (COD)."
        ));
    }
}
