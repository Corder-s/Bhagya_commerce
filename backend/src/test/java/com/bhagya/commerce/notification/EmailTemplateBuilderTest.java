package com.bhagya.commerce.notification;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.notification.template.EmailTemplateBuilder;
import java.math.BigDecimal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class EmailTemplateBuilderTest {

    @Test
    @DisplayName("Should generate responsive HTML email with Bhagya branding and order parameters")
    void testEmailTemplateGeneration() {
        String html = EmailTemplateBuilder.buildOrderConfirmedHtml(
            "Priya Nair",
            "BG-20260926-774102",
            BigDecimal.valueOf(8499),
            "https://bhagya.commerce/orders/BG-20260926-774102"
        );

        assertNotNull(html);
        assertTrue(html.contains("BHAGYA COMMERCE"));
        assertTrue(html.contains("Priya Nair"));
        assertTrue(html.contains("BG-20260926-774102"));
        assertTrue(html.contains("8499"));
        assertTrue(html.contains("#D4AF37")); // Gold accent color
        assertTrue(html.contains("#1E1E1E")); // Dark charcoal
    }
}
