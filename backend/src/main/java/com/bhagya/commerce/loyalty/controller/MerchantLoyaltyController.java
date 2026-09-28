package com.bhagya.commerce.loyalty.controller;

import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.loyalty.dto.*;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/loyalty")
@PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
@Tag(name = "Merchant Loyalty", description = "Authoritative merchant loyalty configuration and reward management with tenant isolation")
public class MerchantLoyaltyController {

    private final LoyaltyService loyaltyService;
    private final TenantSecurityService tenantSecurityService;

    public MerchantLoyaltyController(LoyaltyService loyaltyService, TenantSecurityService tenantSecurityService) {
        this.loyaltyService = loyaltyService;
        this.tenantSecurityService = tenantSecurityService;
    }

    private String resolveStoreId(UserPrincipal principal, String clientStoreId) {
        return tenantSecurityService.resolveAuthoritativeStoreId(principal, clientStoreId);
    }

    @GetMapping("/overview")
    @Operation(summary = "Get loyalty program overview for store")
    public ResponseEntity<LoyaltyOverviewDto> getOverview(
        @RequestParam(required = false) String storeId,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.getMerchantOverview(authorizedStoreId));
    }

    @GetMapping("/program")
    @Operation(summary = "Get loyalty program rules and tiers")
    public ResponseEntity<LoyaltyProgramDto> getProgram(
        @RequestParam(required = false) String storeId,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.getProgram(authorizedStoreId));
    }

    @PutMapping("/program")
    @Operation(summary = "Update loyalty program settings")
    public ResponseEntity<LoyaltyProgramDto> updateProgram(
        @RequestParam(required = false) String storeId,
        @RequestBody LoyaltyProgramUpdateRequest req,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.updateProgram(authorizedStoreId, req));
    }

    @GetMapping("/rewards")
    @Operation(summary = "Get rewards for store")
    public ResponseEntity<List<LoyaltyRewardDto>> getRewards(
        @RequestParam(required = false) String storeId,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.getStoreRewards(authorizedStoreId));
    }

    @PostMapping("/rewards")
    @Operation(summary = "Create a new loyalty reward")
    public ResponseEntity<LoyaltyRewardDto> createReward(
        @RequestParam(required = false) String storeId,
        @RequestBody RewardCreateRequest req,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.createReward(authorizedStoreId, req));
    }

    @PatchMapping("/rewards/{id}")
    @Operation(summary = "Update reward details")
    public ResponseEntity<LoyaltyRewardDto> updateReward(
        @PathVariable String id,
        @RequestParam(required = false) String storeId,
        @RequestBody RewardUpdateRequest req,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.updateReward(id, authorizedStoreId, req));
    }

    @DeleteMapping("/rewards/{id}")
    @Operation(summary = "Delete reward")
    public ResponseEntity<Void> deleteReward(
        @PathVariable String id,
        @RequestParam(required = false) String storeId,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        loyaltyService.deleteReward(id, authorizedStoreId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/members")
    @Operation(summary = "Get loyalty program customer members")
    public ResponseEntity<List<LoyaltyAccountDto>> getMembers(
        @RequestParam(required = false) String storeId,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        return ResponseEntity.ok(loyaltyService.getMerchantMembers(authorizedStoreId));
    }

    @PostMapping("/adjustments")
    @Operation(summary = "Manual point adjustment with actor logging")
    public ResponseEntity<LoyaltyLedgerDto> manualAdjust(
        @RequestParam(required = false) String storeId,
        @RequestBody PointAdjustmentRequest req,
        @CurrentUser UserPrincipal principal
    ) {
        String authorizedStoreId = resolveStoreId(principal, storeId);
        String actor = principal.getEmail() != null ? principal.getEmail() : principal.getId();
        return ResponseEntity.ok(loyaltyService.manualAdjustPoints(actor, authorizedStoreId, req));
    }
}
