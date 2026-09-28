package com.bhagya.commerce.catalog;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.bhagya.commerce.catalog.category.repository.InMemoryCategoryRepository;
import com.bhagya.commerce.catalog.product.dto.ProductCreateRequest;
import com.bhagya.commerce.catalog.product.repository.InMemoryProductRepository;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.organization.repository.InMemoryOrganizationRepository;
import com.bhagya.commerce.store.repository.InMemoryStoreRepository;
import com.bhagya.commerce.store.service.StoreService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ProductStoreIsolationTest {

    private ProductService productService;

    @BeforeEach
    void setUp() {
        InMemoryStoreRepository storeRepo = new InMemoryStoreRepository();
        InMemoryOrganizationRepository orgRepo = new InMemoryOrganizationRepository();

        orgRepo.save(new com.bhagya.commerce.organization.domain.Organization("org_1", "Test Org", "Test Legal", "PAN123", "GST123"));
        orgRepo.saveMember(new com.bhagya.commerce.organization.domain.OrganizationMember("mem_1", "org_1", "usr_merch_1", com.bhagya.commerce.organization.domain.OrganizationRole.STORE_OWNER));

        com.bhagya.commerce.store.domain.Store s1 = new com.bhagya.commerce.store.domain.Store("store_1", "org_1", "Store One", "store-1");
        storeRepo.save(s1);

        com.bhagya.commerce.common.redis.CacheService cacheService = new com.bhagya.commerce.common.redis.CacheService(null);
        productService = new ProductService(
            new InMemoryProductRepository(),
            storeRepo,
            orgRepo,
            cacheService
        );
    }

    @Test
    @DisplayName("Merchant belonging to store_1 can create products for store_1")
    void testMerchantCanCreateProductForOwnStore() {
        ProductCreateRequest request = new ProductCreateRequest(
            "GI Handcrafted Chanderi Silk Dupatta",
            "cat_1",
            "Sarees",
            "gi-chanderi-silk-dupatta",
            "Authentic handloom",
            "Chanderi silk with golden zari borders",
            BigDecimal.valueOf(3499),
            BigDecimal.valueOf(4999),
            30,
            "SKU-CHAN-1",
            com.bhagya.commerce.catalog.product.domain.ProductStatus.PUBLISHED,
            "https://cdn.bhagya.commerce/products/chanderi.jpg",
            List.of("GI-Certified", "Silk"),
            "Ships in 24 hours",
            "Dry clean only"
        );

        assertDoesNotThrow(() -> {
            productService.createProduct("store_1", "usr_merch_1", request);
        });
    }

    @Test
    @DisplayName("Merchant cannot create products for a store they do not own")
    void testMerchantCannotCreateProductForForeignStore() {
        ProductCreateRequest request = new ProductCreateRequest(
            "Counterfeit Silk Saree",
            "cat_1",
            "Sarees",
            "counterfeit-silk-saree",
            "Fake product",
            "Fake description",
            BigDecimal.valueOf(1000),
            BigDecimal.valueOf(2000),
            10,
            "SKU-FAKE-1",
            com.bhagya.commerce.catalog.product.domain.ProductStatus.PUBLISHED,
            null,
            List.of(),
            "No shipping info",
            "None"
        );

        // usr_other_user does not own store_1
        assertThrows(ForbiddenException.class, () -> {
            productService.createProduct("store_1", "usr_other_user", request);
        });
    }
}
