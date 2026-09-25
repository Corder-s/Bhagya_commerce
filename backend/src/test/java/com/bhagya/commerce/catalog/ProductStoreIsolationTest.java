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
        StoreService storeService = new StoreService(new InMemoryStoreRepository(), new InMemoryOrganizationRepository());
        productService = new ProductService(
            new InMemoryProductRepository(),
            new InMemoryCategoryRepository(),
            storeService
        );
    }

    @Test
    @DisplayName("Merchant belonging to store_1 can create products for store_1")
    void testMerchantCanCreateProductForOwnStore() {
        ProductCreateRequest request = new ProductCreateRequest(
            "GI Handcrafted Chanderi Silk Dupatta",
            "Chanderi silk with golden zari borders",
            "cat_1",
            "Chanderi Heritage",
            BigDecimal.valueOf(3499),
            BigDecimal.valueOf(4999),
            List.of("GI-Certified", "Silk"),
            List.of(),
            List.of(),
            30
        );

        assertDoesNotThrow(() -> {
            productService.createProduct("store_1", request, "usr_merch_1");
        });
    }

    @Test
    @DisplayName("Merchant cannot create products for a store they do not own")
    void testMerchantCannotCreateProductForForeignStore() {
        ProductCreateRequest request = new ProductCreateRequest(
            "Counterfeit Silk Saree",
            "Fake product",
            "cat_1",
            "FakeBrand",
            BigDecimal.valueOf(1000),
            BigDecimal.valueOf(2000),
            List.of(),
            List.of(),
            List.of(),
            10
        );

        // usr_other_user does not own store_1
        assertThrows(ForbiddenException.class, () -> {
            productService.createProduct("store_1", request, "usr_other_user");
        });
    }
}
