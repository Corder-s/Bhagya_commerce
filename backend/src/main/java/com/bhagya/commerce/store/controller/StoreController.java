package com.bhagya.commerce.store.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.store.dto.PublicStoreResponse;
import com.bhagya.commerce.store.dto.StoreCreateRequest;
import com.bhagya.commerce.store.dto.StoreResponse;
import com.bhagya.commerce.store.dto.StoreUpdateRequest;
import com.bhagya.commerce.store.service.StoreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stores")
@Tag(name = "Stores", description = "Public Storefronts & Merchant Store Management")
public class StoreController {

    private final StoreService storeService;

    public StoreController(StoreService storeService) {
        this.storeService = storeService;
    }

    @GetMapping("/{storeId}")
    @Operation(summary = "Get merchant store management details (requires store membership)")
    public ResponseEntity<ApiResponse<StoreResponse>> getStore(
        @PathVariable String storeId,
        @CurrentUser UserPrincipal principal
    ) {
        StoreResponse store = storeService.getStore(storeId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(store));
    }

    @GetMapping("/{storeId}/public")
    @Operation(summary = "Get public storefront branding and story (unauthenticated)")
    public ResponseEntity<ApiResponse<PublicStoreResponse>> getPublicStore(@PathVariable String storeId) {
        PublicStoreResponse store = storeService.getPublicStore(storeId);
        return ResponseEntity.ok(ApiResponse.ok(store));
    }

    @GetMapping("/by-slug/{slug}")
    @Operation(summary = "Get public storefront by slug (unauthenticated)")
    public ResponseEntity<ApiResponse<PublicStoreResponse>> getPublicStoreBySlug(@PathVariable String slug) {
        PublicStoreResponse store = storeService.getPublicStoreBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(store));
    }

    @PostMapping
    @Operation(summary = "Create a new artisan store")
    public ResponseEntity<ApiResponse<StoreResponse>> createStore(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody StoreCreateRequest request
    ) {
        StoreResponse store = storeService.createStore(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(store, "Store created successfully"));
    }

    @PatchMapping("/{storeId}")
    @Operation(summary = "Update store identity, branding, or status")
    public ResponseEntity<ApiResponse<StoreResponse>> updateStore(
        @PathVariable String storeId,
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody StoreUpdateRequest request
    ) {
        StoreResponse store = storeService.updateStore(storeId, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok(store, "Store updated successfully"));
    }
}
