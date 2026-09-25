package com.bhagya.commerce.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.order.repository.InMemoryOrderRepository;
import com.bhagya.commerce.order.repository.OrderRepository;
import com.bhagya.commerce.order.service.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class OrderOwnershipTest {

    private OrderRepository orderRepository;
    private InventoryService inventoryService;
    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderRepository = new InMemoryOrderRepository();
        inventoryService = new InventoryService();
        orderService = new OrderService(orderRepository, inventoryService);
    }

    @Test
    @DisplayName("Customer A should be able to view their own order")
    void testCustomerAccessOwnOrder() {
        // ord_101 belongs to usr_cust_1
        OrderResponse response = orderService.getOrderById("ord_101", "usr_cust_1");
        assertNotNull(response);
        assertEquals("ord_101", response.id());
    }

    @Test
    @DisplayName("Customer B should be forbidden from accessing Customer A's order")
    void testCustomerBForbiddenFromCustomerAOrder() {
        // ord_101 belongs to usr_cust_1, usr_cust_attacker should get ForbiddenException
        ForbiddenException ex = assertThrows(ForbiddenException.class, () -> {
            orderService.getOrderById("ord_101", "usr_cust_attacker");
        });
        assertEquals("You are not authorized to view this order.", ex.getMessage());
    }

    @Test
    @DisplayName("Accessing non-existent order should throw ResourceNotFoundException")
    void testNonExistentOrderThrowsNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            orderService.getOrderById("ord_non_existent", "usr_cust_1");
        });
    }
}
