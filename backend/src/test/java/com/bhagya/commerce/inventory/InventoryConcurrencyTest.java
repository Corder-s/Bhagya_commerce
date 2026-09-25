package com.bhagya.commerce.inventory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.inventory.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class InventoryConcurrencyTest {

    private InventoryService inventoryService;

    @BeforeEach
    void setUp() {
        inventoryService = new InventoryService(null);
    }

    @Test
    @DisplayName("Should reserve available stock successfully")
    void testReserveAvailableStock() {
        // prod_1 has 45 units initial
        assertTrue(inventoryService.checkAvailability("prod_1", 10));
        assertTrue(inventoryService.reserveInventory("prod_1", 10));
        assertEquals(35, inventoryService.getAvailableStock("prod_1"));

        // Commit reservation
        inventoryService.commitInventory("prod_1", 10);
        assertEquals(35, inventoryService.getAvailableStock("prod_1"));
    }

    @Test
    @DisplayName("Should prevent overselling when requested quantity exceeds available stock")
    void testPreventOverselling() {
        // prod_4 has 15 units initial
        assertTrue(inventoryService.reserveInventory("prod_4", 15));
        assertEquals(0, inventoryService.getAvailableStock("prod_4"));

        // Attempting to reserve even 1 more unit should fail
        assertFalse(inventoryService.reserveInventory("prod_4", 1));

        // Release 5 units
        inventoryService.releaseInventory("prod_4", 5);
        assertEquals(5, inventoryService.getAvailableStock("prod_4"));
        assertTrue(inventoryService.reserveInventory("prod_4", 2));
    }
}
