package com.bhagya.commerce.common.redis;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class CacheServiceTest {

    private CacheService cacheService;

    @BeforeEach
    void setUp() {
        // Initializes with local in-memory fallback for isolated testing
        cacheService = new CacheService(null);
    }

    @Test
    @DisplayName("Should set, get, and delete cached values with TTL")
    void testSetGetDeleteCache() {
        String key = "test:product:prod_1";
        String value = "GI Handloom Silk Saree";

        cacheService.set(key, value, Duration.ofMinutes(5));
        assertTrue(cacheService.hasKey(key));

        Optional<String> cached = cacheService.get(key, String.class);
        assertTrue(cached.isPresent());
        assertEquals("GI Handloom Silk Saree", cached.get());

        cacheService.delete(key);
        assertFalse(cacheService.hasKey(key));
    }

    @Test
    @DisplayName("Should invalidate keys by prefix")
    void testInvalidateByPrefix() {
        cacheService.set("catalog:search:saree", "data_1", Duration.ofMinutes(5));
        cacheService.set("catalog:search:craft", "data_2", Duration.ofMinutes(5));
        cacheService.set("product:prod_1", "data_3", Duration.ofMinutes(5));

        cacheService.deleteByPrefix("catalog:search");

        assertFalse(cacheService.hasKey("catalog:search:saree"));
        assertFalse(cacheService.hasKey("catalog:search:craft"));
        assertTrue(cacheService.hasKey("product:prod_1"));
    }
}
