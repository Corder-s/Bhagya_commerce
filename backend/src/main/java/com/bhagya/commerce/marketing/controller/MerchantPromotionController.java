package com.bhagya.commerce.marketing.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.dto.PromotionCalculationResult;
import com.bhagya.commerce.marketing.dto.PromotionCreateRequest;
import com.bhagya.commerce.marketing.dto.PromotionResponse;
import com.bhagya.commerce.marketing.dto.PromotionValidateRequest;
import com.bhagya.commerce.marketing.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/promotions")
@PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
@Tag(name = "Merchant Promotions", description = "Merchant promotional discount and coupon management with tenant isolation")
public class MerchantPromotionController {

    private final PromotionService promotionService;
    private final TenantSecurityService tenantSecurityService;

    public MerchantPromotionController(PromotionService promotionService, TenantSecurityService tenantSecurityService) {
        this.promotionService = promotionService;
        this.tenantSecurityService = tenantSecurityService;
    }

    private String resolveStoreId(UserPrincipal principal, String clientSuppliedStoreId) {
        return tenantSecurityService.resolveAuthoritativeStoreId(principal, clientSuppliedStoreId);
    }

    @GetMapping
    @Operation(summary = "Get all promotions and coupons for the authenticated merchant store")
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> getPromotions(@CurrentUser UserPrincipal principal) {
        String storeId = resolveStoreId(principal, null);
        List<PromotionResponse> promotions = promotionService.getStorePromotions(storeId);
        return ResponseEntity.ok(ApiResponse.success(promotions, "Store promotions retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get promotion details by ID")
    public ResponseEntity<ApiResponse<PromotionResponse>> getPromotion(@PathVariable String id, @CurrentUser UserPrincipal principal) {
        String storeId = resolveStoreId(principal, null);
        PromotionResponse promotion = promotionService.getPromotionById(id, storeId);
        return ResponseEntity.ok(ApiResponse.success(promotion, "Promotion retrieved"));
    }

    @PostMapping
    @Operation(summary = "Create a new promotion and coupon code")
    public ResponseEntity<ApiResponse<PromotionResponse>> createPromotion(
        @Valid @RequestBody PromotionCreateRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, null);
        PromotionResponse created = promotionService.createPromotion(storeId, request);
        return ResponseEntity.ok(ApiResponse.success(created, "Promotion created successfully"));
    }

    @PostMapping("/{id}/pause")
    @Operation(summary = "Pause an active promotion")
    public ResponseEntity<ApiResponse<PromotionResponse>> pausePromotion(@PathVariable String id, @CurrentUser UserPrincipal principal) {
        String storeId = resolveStoreId(principal, null);
        PromotionResponse updated = promotionService.togglePromotionStatus(id, storeId, PromotionStatus.PAUSED);
        return ResponseEntity.ok(ApiResponse.success(updated, "Promotion paused"));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a drafted or paused promotion")
    public ResponseEntity<ApiResponse<PromotionResponse>> activatePromotion(@PathVariable String id, @CurrentUser UserPrincipal principal) {
        String storeId = resolveStoreId(principal, null);
        PromotionResponse updated = promotionService.togglePromotionStatus(id, storeId, PromotionStatus.ACTIVE);
        return ResponseEntity.ok(ApiResponse.success(updated, "Promotion activated"));
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate and calculate discount for a coupon code")
    public ResponseEntity<ApiResponse<PromotionCalculationResult>> validateCoupon(
        @Valid @RequestBody PromotionValidateRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, request.storeId());
        PromotionValidateRequest scopedRequest = new PromotionValidateRequest(
            storeId,
            request.code(),
            request.subtotal(),
            request.customerId(),
            request.productIds(),
            request.categoryIds()
        );
        PromotionCalculationResult result = promotionService.validateAndCalculate(scopedRequest);
        return ResponseEntity.ok(ApiResponse.success(result, result.message()));
    }
}
