package com.bhagya.commerce.marketing.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.marketing.domain.PromotionStatus;
import com.bhagya.commerce.marketing.dto.*;
import com.bhagya.commerce.marketing.service.PromotionService;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.store.domain.Store;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/promotions")
@Tag(name = "Merchant Promotions", description = "Merchant promotional discount and coupon management")
public class MerchantPromotionController {

    private final PromotionService promotionService;
    private final MerchantService merchantService;

    public MerchantPromotionController(PromotionService promotionService, MerchantService merchantService) {
        this.promotionService = promotionService;
        this.merchantService = merchantService;
    }

    private String resolveStoreId(Principal principal) {
        String userId = principal != null ? principal.getName() : "usr_merch_1";
        Store store = merchantService.getStoreForUser(userId);
        return store.getId();
    }

    @GetMapping
    @Operation(summary = "Get all promotions and coupons for the authenticated merchant store")
    public ResponseEntity<ApiResponse<List<PromotionResponse>>> getPromotions(Principal principal) {
        String storeId = resolveStoreId(principal);
        List<PromotionResponse> promotions = promotionService.getStorePromotions(storeId);
        return ResponseEntity.ok(ApiResponse.success(promotions, "Store promotions retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get promotion details by ID")
    public ResponseEntity<ApiResponse<PromotionResponse>> getPromotion(@PathVariable String id, Principal principal) {
        String storeId = resolveStoreId(principal);
        PromotionResponse promotion = promotionService.getPromotionById(id, storeId);
        return ResponseEntity.ok(ApiResponse.success(promotion, "Promotion retrieved"));
    }

    @PostMapping
    @Operation(summary = "Create a new promotion and coupon code")
    public ResponseEntity<ApiResponse<PromotionResponse>> createPromotion(
        @Valid @RequestBody PromotionCreateRequest request,
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        PromotionResponse created = promotionService.createPromotion(storeId, request);
        return ResponseEntity.ok(ApiResponse.success(created, "Promotion created successfully"));
    }

    @PostMapping("/{id}/pause")
    @Operation(summary = "Pause an active promotion")
    public ResponseEntity<ApiResponse<PromotionResponse>> pausePromotion(@PathVariable String id, Principal principal) {
        String storeId = resolveStoreId(principal);
        PromotionResponse updated = promotionService.togglePromotionStatus(id, storeId, PromotionStatus.PAUSED);
        return ResponseEntity.ok(ApiResponse.success(updated, "Promotion paused"));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate a drafted or paused promotion")
    public ResponseEntity<ApiResponse<PromotionResponse>> activatePromotion(@PathVariable String id, Principal principal) {
        String storeId = resolveStoreId(principal);
        PromotionResponse updated = promotionService.togglePromotionStatus(id, storeId, PromotionStatus.ACTIVE);
        return ResponseEntity.ok(ApiResponse.success(updated, "Promotion activated"));
    }

    @PostMapping("/validate")
    @Operation(summary = "Validate and calculate discount for a coupon code")
    public ResponseEntity<ApiResponse<PromotionCalculationResult>> validateCoupon(
        @Valid @RequestBody PromotionValidateRequest request,
        Principal principal
    ) {
        String storeId = request.storeId() != null ? request.storeId() : resolveStoreId(principal);
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
