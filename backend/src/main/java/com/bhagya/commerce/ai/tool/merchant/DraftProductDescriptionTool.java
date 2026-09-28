package com.bhagya.commerce.ai.tool.merchant;

import com.bhagya.commerce.ai.domain.AIToolCategory;
import com.bhagya.commerce.ai.tool.AITool;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.ai.tool.AIToolResult;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class DraftProductDescriptionTool implements AITool {

    @Override
    public String name() {
        return "draftProductDescription";
    }

    @Override
    public String description() {
        return "Draft high-converting artisan storytelling copy, craft care guidelines, and SEO bullet points for an authentic Indian product.";
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
        return "AI_MERCHANT_COPILOT";
    }

    @Override
    public AIToolResult execute(AIToolContext context, Map<String, Object> parameters) {
        String title = (String) parameters.getOrDefault("title", "Handcrafted Heritage Art Piece");
        String materials = (String) parameters.getOrDefault("materials", "Pure mulberry silk, natural vegetable dye, electroplated silver zari");
        String technique = (String) parameters.getOrDefault("technique", "Centuries-old pit-loom hand-weaving");

        String storytellingBlurb = String.format(
            "Meticulously woven over 18 days by master weaver families in Varanasi, this %s represents the pinnacle of Indian handloom heritage. Crafted with %s utilizing %s, each motif is individually hand-guided without mechanical jacquards.",
            title, materials, technique
        );

        String careInstructions = "Dry clean only. Store wrapped in unbleached muslin fabric in a cedar trunk away from direct tropical sunlight. Avoid synthetic deodorants directly on the zari.";

        return AIToolResult.success(Map.of(
            "title", title,
            "storytellingBlurb", storytellingBlurb,
            "materials", materials,
            "technique", technique,
            "careInstructions", careInstructions,
            "seoKeywords", "handloom, GI-certified, Varanasi silk, authentic artisan craft, Bhagya verified"
        ));
    }
}
