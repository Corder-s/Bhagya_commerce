package com.bhagya.commerce.performance;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.inventory.service.InventoryService;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class InventoryConcurrencyTest {

    private InventoryService inventoryService;

    @BeforeEach
    void setUp() {
        inventoryService = new InventoryService();
    }

    @Test
    @DisplayName("[CONCURRENCY] 50 concurrent reservations on 20-stock product prevents overselling")
    void testConcurrentReservationsOnSingleProduct() throws InterruptedException {
        String productId = "prod_3"; // seeded with initial stock = 20
        int concurrentThreads = 50;
        ExecutorService executor = Executors.newFixedThreadPool(concurrentThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(concurrentThreads);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        for (int i = 0; i < concurrentThreads; i++) {
            executor.submit(() -> {
                try {
                    startLatch.await(); // Thundering herd synchronization
                    boolean reserved = inventoryService.reserveInventory(productId, 1);
                    if (reserved) {
                        successCount.incrementAndGet();
                    } else {
                        failCount.incrementAndGet();
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    finishLatch.countDown();
                }
            });
        }

        startLatch.countDown(); // Release all threads at once
        finishLatch.await();
        executor.shutdown();

        // Exactly 20 reservations should succeed, 30 must be rejected
        assertEquals(20, successCount.get(), "Expected exactly 20 successful reservations");
        assertEquals(30, failCount.get(), "Expected exactly 30 rejected reservations");
        assertEquals(0, inventoryService.getAvailableStock(productId), "Available stock must be 0, no negative inventory");
    }

    @Test
    @DisplayName("[CONCURRENCY] Concurrent reservations on distinct products run in parallel with 0 contention")
    void testConcurrentReservationsOnDistinctProducts() throws InterruptedException {
        int threadCount = 20;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch finishLatch = new CountDownLatch(threadCount);

        AtomicInteger successCount = new AtomicInteger(0);

        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    startLatch.await();
                    // Each thread reserves on its own distinct product ID
                    boolean reserved = inventoryService.reserveInventory("prod_distinct_" + index, 2);
                    if (reserved) {
                        successCount.incrementAndGet();
                    }
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

        assertEquals(threadCount, successCount.get(), "All distinct product reservations must succeed concurrently");
    }
}
