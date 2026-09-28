package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class DraftMarketingCampaignTool implements AITool {

    @Override
    public String name() {
        return "draftMarketingCampaign";
    }

    @Override
    public String description() {
        return "Generate festive broadcast copy, email newsletters, and WhatsApp messages honoring artisan craft values.";
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
        return "MARKETING_CREATE";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String topic = (String) parameters.getOrDefault("campaignTopic", "Festive Artisan Masterworks Showcase");
        String discount = (String) parameters.getOrDefault("discount", "15% off with code ARTISAN15");

        String whatsapp = String.format(
            "Namaste! ✨ Celebrate this festive season with authentic certified handcrafts directly from master artisan clusters. Enjoy %s on our curated collection: %s. Tap here to discover: https://bhagya.commerce/shop 🪔",
            discount, topic
        );

        String emailSubject = "Authentic Heritage Crafts For Your Home — " + topic;
        String emailBody = String.format(
            "Dear Patron,\n\nWe are delighted to invite you to our latest curation: %s.\nEach piece is hand-selected, GI-certified, and directly benefits indigenous artisan weaver cooperatives.\n\nUse code %s at checkout.\n\nWarm regards,\nThe Artisan Guild & Bhagya Commerce",
            topic, discount
        );

        return AIToolResult.success(Map.of(
            "campaignTopic", topic,
            "whatsappBroadcast", whatsapp,
            "emailSubject", emailSubject,
            "emailBody", emailBody
        ));
    }
}
