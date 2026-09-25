package com.bhagya.commerce.merchant.controller;

import com.bhagya.commerce.catalog.product.dto.ProductResponse;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.merchant.dto.MerchantCustomerResponse;
import com.bhagya.commerce.merchant.dto.MerchantDashboardOverviewResponse;
import com.bhagya.commerce.merchant.dto.MerchantInventoryItemResponse;
import com.bhagya.commerce.merchant.dto.MerchantOnboardingRequest;
import com.bhagya.commerce.merchant.dto.MerchantOnboardingResponse;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.order.dto.OrderResponse;
import com.bhagya.commerce.store.dto.StoreResponse;
import com.bhagya.commerce.store.dto.StoreUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/merchant")
@Tag(name = "Merchant Workspace", description = "Merchant dashboard, orders, inventory, customers, store and onboarding APIs")
public class MerchantController {

    private final MerchantService merchantService;

    public MerchantController(MerchantService merchantService) {
        this.merchantService = merchantService;
    }

    @GetMapping("/dashboard/overview")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Get merchant dashboard overview", description = "Provides KPIs, today sales, low stock alerts, and revenue trends")
    public ResponseEntity<ApiResponse<MerchantDashboardOverviewResponse>> getDashboardOverview(
        @CurrentUser UserPrincipal principal
    ) {
        MerchantDashboardOverviewResponse overview = merchantService.getDashboardOverview(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(overview, "Dashboard overview retrieved"));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Get merchant store orders", description = "Returns all orders placed against merchant's store")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getMerchantOrders(
        @CurrentUser UserPrincipal principal
    ) {
        List<OrderResponse> orders = merchantService.getMerchantOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders, "Merchant orders retrieved"));
    }

    @GetMapping("/products")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Get merchant store catalog", description = "Returns catalog products owned by merchant's store")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMerchantProducts(
        @CurrentUser UserPrincipal principal
    ) {
        List<ProductResponse> products = merchantService.getMerchantProducts(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(products, "Merchant products retrieved"));
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Get merchant inventory status", description = "Returns stock quantities, reserved counts, and low-stock alerts")
    public ResponseEntity<ApiResponse<List<MerchantInventoryItemResponse>>> getMerchantInventory(
        @CurrentUser UserPrincipal principal
    ) {
        List<MerchantInventoryItemResponse> items = merchantService.getMerchantInventory(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(items, "Inventory retrieved"));
    }

    @GetMapping("/customers")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Get merchant customers", description = "Returns list of customers who have purchased from this store")
    public ResponseEntity<ApiResponse<List<MerchantCustomerResponse>>> getMerchantCustomers(
        @CurrentUser UserPrincipal principal
    ) {
        List<MerchantCustomerResponse> customers = merchantService.getMerchantCustomers(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(customers, "Store customers retrieved"));
    }

    @GetMapping("/store")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Get current merchant store", description = "Returns full private settings and details for current merchant store")
    public ResponseEntity<ApiResponse<StoreResponse>> getMerchantStore(
        @CurrentUser UserPrincipal principal
    ) {
        StoreResponse store = merchantService.getMerchantStore(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(store, "Store settings retrieved"));
    }

    @PatchMapping("/store")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Update merchant store settings", description = "Updates store name, description, address, or contact info")
    public ResponseEntity<ApiResponse<StoreResponse>> updateMerchantStore(
        @Valid @RequestBody StoreUpdateRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        StoreResponse updated = merchantService.updateMerchantStore(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Store settings updated successfully"));
    }

    @GetMapping("/onboarding")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get merchant onboarding status", description = "Returns progress of merchant onboarding process")
    public ResponseEntity<ApiResponse<MerchantOnboardingResponse>> getOnboardingStatus(
        @CurrentUser UserPrincipal principal
    ) {
        MerchantOnboardingResponse status = merchantService.getOnboardingStatus(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(status, "Onboarding status retrieved"));
    }

    @PostMapping("/onboarding")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit merchant onboarding", description = "Submits business KYC and creates Organization + Store")
    public ResponseEntity<ApiResponse<MerchantOnboardingResponse>> submitOnboarding(
        @Valid @RequestBody MerchantOnboardingRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        MerchantOnboardingResponse response = merchantService.submitOnboarding(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Merchant application submitted successfully"));
    }

    @PatchMapping("/onboarding")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update merchant onboarding progress", description = "Updates onboarding step details")
    public ResponseEntity<ApiResponse<MerchantOnboardingResponse>> updateOnboarding(
        @Valid @RequestBody MerchantOnboardingRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        MerchantOnboardingResponse response = merchantService.submitOnboarding(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(response, "Merchant application updated"));
    }
}
