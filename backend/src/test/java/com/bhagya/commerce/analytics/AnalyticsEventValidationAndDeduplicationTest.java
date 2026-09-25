package com.bhagya.commerce.analytics;

import static org.junit.jupiter.api.Assertions.*;

import com.bhagya.commerce.analytics.domain.AnalyticsEvent;
import com.bhagya.commerce.analytics.domain.AnalyticsEventType;
import com.bhagya.commerce.analytics.domain.AnalyticsSource;
import com.bhagya.commerce.analytics.dto.AnalyticsEventIngestRequest;
import com.bhagya.commerce.analytics.repository.AnalyticsEventRepository;
import com.bhagya.commerce.analytics.service.AnalyticsEventTracker;
import java.time.Instant;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AnalyticsEventValidationAndDeduplicationTest {

    private AnalyticsEventRepository repository;
    private AnalyticsEventTracker tracker;

    @BeforeEach
    void setUp() {
        repository = new AnalyticsEventRepository();
        tracker = new AnalyticsEventTracker(repository, null);
    }

    @Test
    @DisplayName("Should sanitize sensitive keys from analytics properties and store safely")
    void testPropertySanitization() {
        AnalyticsEventIngestRequest request = new AnalyticsEventIngestRequest(
            "evt_sec_101",
            AnalyticsEventType.PRODUCT_VIEWED,
            "store_varanasi_silk",
            "sess_999",
            "PRODUCT",
            "prod_01",
            Map.of(
                "category", "Sarees",
                "password", "secret_pass123",
                "token", "bearer_jwt_99",
                "cvv", "123",
                "validKey", "authentic_handloom"
            ),
            Instant.now(),
            AnalyticsSource.WEB
        );

        AnalyticsEvent saved = tracker.ingestClientEvent(request, "usr_cust_1", "store_varanasi_silk");
        assertNotNull(saved);
        assertEquals("evt_sec_101", saved.getId());
        assertEquals(AnalyticsEventType.PRODUCT_VIEWED, saved.getEventType());

        // Sensitive keys must be stripped
        assertFalse(saved.getProperties().containsKey("password"));
        assertFalse(saved.getProperties().containsKey("token"));
        assertFalse(saved.getProperties().containsKey("cvv"));

        // Safe keys must be preserved
        assertTrue(saved.getProperties().containsKey("category"));
        assertTrue(saved.getProperties().containsKey("validKey"));
        assertEquals("authentic_handloom", saved.getProperties().get("validKey"));
    }
}
