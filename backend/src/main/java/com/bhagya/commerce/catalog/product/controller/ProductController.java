package com.bhagya.commerce.catalog.product.controller;

import com.bhagya.commerce.catalog.product.dto.ProductCreateRequest;
import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.catalog.product.dto.ProductUpdateRequest;
import com.bhagya.commerce.catalog.product.service.ProductService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.api.PageResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Products", description = "Public Product Discovery & Merchant Catalog Management")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    @Operation(summary = "Search and filter published catalogue products (public)")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> searchProducts(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice,
        @RequestParam(required = false) String sort,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        PageResponse<ProductResponse> result = productService.searchProducts(
            query, category, minPrice, maxPrice, sort, page, size
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/products/{idOrSlug}")
    @Operation(summary = "Get single product detail by ID or slug (public)")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable String idOrSlug) {
        ProductResponse product = productService.getProductByIdOrSlug(idOrSlug);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @GetMapping("/stores/{storeId}/products")
    @Operation(summary = "List all products for a specific store (public)")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getStoreProducts(@PathVariable String storeId) {
        List<ProductResponse> products = productService.getStoreProducts(storeId);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }

    @PostMapping("/stores/{storeId}/products")
    @Operation(summary = "Add a new product to store catalogue (requires merchant ownership)")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
        @PathVariable String storeId,
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody ProductCreateRequest request
    ) {
        ProductResponse created = productService.createProduct(storeId, principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(created, "Product created successfully"));
    }

    @PatchMapping("/stores/{storeId}/products/{productId}")
    @Operation(summary = "Update product details or inventory (requires merchant ownership)")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
        @PathVariable String storeId,
        @PathVariable String productId,
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody ProductUpdateRequest request
    ) {
        ProductResponse updated = productService.updateProduct(storeId, productId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Product updated successfully"));
    }

    @DeleteMapping("/stores/{storeId}/products/{productId}")
    @Operation(summary = "Delete or archive product (requires merchant ownership)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
        @PathVariable String storeId,
        @PathVariable String productId,
        @CurrentUser UserPrincipal principal
    ) {
        productService.deleteProduct(storeId, productId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(null, "Product deleted successfully"));
    }
}
