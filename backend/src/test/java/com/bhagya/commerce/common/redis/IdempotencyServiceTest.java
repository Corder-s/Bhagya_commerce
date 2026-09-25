package com.bhagya.commerce.common.redis;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class IdempotencyServiceTest {

    private IdempotencyService idempotencyService;

    @BeforeEach
    void setUp() {
        CacheService cacheService = new CacheService(null);
        idempotencyService = new IdempotencyService(cacheService);
    }

    @Test
    @DisplayName("Should store and retrieve idempotency results to prevent duplicate operations")
    void testIdempotencyStorage() {
        String idempotencyKey = "idem_key_9941";
        Map<String, String> paymentResult = Map.of("orderId", "ord_101", "paymentId", "pay_8841", "status", "CAPTURED");

        // Initially no record
        assertFalse(idempotencyService.getProcessedResult(idempotencyKey, Map.class).isPresent());

        // Store result
        idempotencyService.storeResult(idempotencyKey, paymentResult);

        // Retrieve result
        Optional<Map> retrieved = idempotencyService.getProcessedResult(idempotencyKey, Map.class);
        assertTrue(retrieved.isPresent());
        assertEquals("CAPTURED", retrieved.get().get("status"));
        assertEquals("pay_8841", retrieved.get().get("paymentId"));
    }
}
