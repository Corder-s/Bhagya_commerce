package com.bhagya.commerce.performance;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.bhagya.commerce.common.redis.CacheService;
import java.time.Duration;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class CacheStampedeTest {

    private CacheService cacheService;

    @BeforeEach
    void setUp() {
        cacheService = new CacheService(null);
    }

    @Test
    @DisplayName("[STAMPEDE PROTECTION] 50 concurrent requests on a cold key execute compute loader exactly ONCE")
    void testRequestCoalescingOnColdCache() throws InterruptedException {
        String key = "expensive_store_catalogue:store_jaipur_crafts";
        int concurrentThreads = 50;
        ExecutorService executor = Executors.newFixedThreadPool(concurrentThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(concurrentThreads);

        AtomicInteger loaderExecutionCount = new AtomicInteger(0);

        for (int i = 0; i < concurrentThreads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await();
                    String result = cacheService.getOrCompute(key, String.class, Duration.ofMinutes(5), () -> {
                        loaderExecutionCount.incrementAndGet();
                        try {
                            Thread.sleep(20); // Simulate database computation latency
                        } catch (InterruptedException e) {
                            Thread.currentThread().interrupt();
                        }
                        return "LOADED_CATALOGUE_DATA";
                    });
                    assertEquals("LOADED_CATALOGUE_DATA", result);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        startLatch.countDown();
        finishLatch.await();
        executor.shutdown();

        // Exactly 1 compute execution should occur despite 50 concurrent cold callers
        assertEquals(1, loaderExecutionCount.get(), "Loader should have been executed exactly once via request coalescing");
    }
}
