package com.bhagya.commerce.merchant;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.bhagya.commerce.catalog.category.repository.InMemoryCategoryRepository;
import com.bhagya.commerce.catalog.product.repository.InMemoryProductRepository;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.inventory.service.InventoryService;
import com.bhagya.commerce.merchant.dto.MerchantDashboardOverviewResponse;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.order.repository.InMemoryOrderRepository;
import com.bhagya.commerce.order.service.OrderService;
import com.bhagya.commerce.organization.repository.InMemoryOrganizationRepository;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.repository.InMemoryStoreRepository;
import com.bhagya.commerce.store.repository.StoreRepository;
import com.bhagya.commerce.store.service.StoreService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class MerchantAuthorizationTest {

    private OrganizationRepository organizationRepository;
    private StoreRepository storeRepository;
    private StoreService storeService;
    private ProductService productService;
    private OrderService orderService;
    private MerchantService merchantService;

    @BeforeEach
    void setUp() {
        organizationRepository = new InMemoryOrganizationRepository();
        storeRepository = new InMemoryStoreRepository();
        storeService = new StoreService(storeRepository, organizationRepository);
        com.bhagya.commerce.common.redis.CacheService cacheService = new com.bhagya.commerce.common.redis.CacheService(null);
        productService = new ProductService(new InMemoryProductRepository(), storeRepository, organizationRepository, cacheService);
        orderService = new OrderService(new InMemoryOrderRepository(), new InventoryService());
        merchantService = new MerchantService(organizationRepository, storeRepository, storeService, productService, orderService);
    }

    @Test
    @DisplayName("Merchant user with valid organization and store can access merchant dashboard")
    void testValidMerchantAccessDashboard() {
        // usr_merch_1 belongs to org_1 which owns store_1
        MerchantDashboardOverviewResponse overview = merchantService.getDashboardOverview("usr_merch_1");
        assertNotNull(overview);
        assertNotNull(overview.storeId());
    }

    @Test
    @DisplayName("User without merchant organization membership is forbidden from merchant workspace")
    void testUserWithoutMembershipIsForbidden() {
        // usr_cust_1 is only a customer, has no organization
        assertThrows(ForbiddenException.class, () -> {
            merchantService.getDashboardOverview("usr_cust_1");
        });
    }
}
