package com.bhagya.commerce.inventory.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/**
 * Service boundary for inventory management.
 * In Step 11, provides reservation, commit, and release lifecycle.
 * In Step 12, connects to PostgreSQL and distributed locks via Redis.
 */
@Service
public class InventoryService {

    // ProductId -> [available, reserved]
    private final Map<String, int[]> inventoryMap = new ConcurrentHashMap<>();

    public InventoryService() {
        inventoryMap.put("prod_1", new int[]{45, 0});
        inventoryMap.put("prod_2", new int[]{30, 0});
        inventoryMap.put("prod_3", new int[]{20, 0});
        inventoryMap.put("prod_4", new int[]{15, 0});
        inventoryMap.put("prod_5", new int[]{50, 0});
        inventoryMap.put("prod_6", new int[]{25, 0});
    }

    public synchronized boolean checkAvailability(String productId, int quantity) {
        int[] stock = inventoryMap.getOrDefault(productId, new int[]{20, 0});
        return stock[0] >= quantity;
    }

    public synchronized boolean reserveInventory(String productId, int quantity) {
        int[] stock = inventoryMap.getOrDefault(productId, new int[]{20, 0});
        if (stock[0] < quantity) {
            return false;
        }
        stock[0] -= quantity;
        stock[1] += quantity;
        inventoryMap.put(productId, stock);
        return true;
    }

    public synchronized void commitInventory(String productId, int quantity) {
        int[] stock = inventoryMap.getOrDefault(productId, new int[]{20, 0});
        stock[1] = Math.max(0, stock[1] - quantity);
        inventoryMap.put(productId, stock);
    }

    public synchronized void releaseInventory(String productId, int quantity) {
        int[] stock = inventoryMap.getOrDefault(productId, new int[]{20, 0});
        stock[1] = Math.max(0, stock[1] - quantity);
        stock[0] += quantity;
        inventoryMap.put(productId, stock);
    }

    public int getAvailableStock(String productId) {
        return inventoryMap.getOrDefault(productId, new int[]{20, 0})[0];
    }
}
