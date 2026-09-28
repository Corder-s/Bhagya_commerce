package com.bhagya.commerce.loyalty.controller;

import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.security.CurrentUser;
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
@RequestMapping("/api/v1/customer/loyalty")
@PreAuthorize("isAuthenticated()")
@Tag(name = "Customer Loyalty", description = "Authoritative loyalty points balance, ledger, reward redemption and referrals")
public class CustomerLoyaltyController {

    private final LoyaltyService loyaltyService;

    public CustomerLoyaltyController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    private String getCustomerId(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("Authentication required to access loyalty features.");
        }
        return principal.getId();
    }

    private String sanitizeBaseUrl(String baseUrl) {
        if (baseUrl == null || baseUrl.isBlank()) return "https://bhagya.commerce";
        String clean = baseUrl.trim();
        if (clean.startsWith("http://localhost:3000") || clean.startsWith("https://bhagya.commerce") || clean.startsWith("https://www.bhagya.commerce")) {
            return clean;
        }
        return "https://bhagya.commerce";
    }

    @GetMapping
    @Operation(summary = "Get loyalty account balance and tier for current customer")
    public ResponseEntity<LoyaltyAccountDto> getLoyaltyAccount(
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId
    ) {
        String customerId = getCustomerId(principal);
        return ResponseEntity.ok(loyaltyService.getCustomerAccount(customerId, storeId));
    }

    @GetMapping("/ledger")
    @Operation(summary = "Get points transaction ledger")
    public ResponseEntity<List<LoyaltyLedgerDto>> getLedger(
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId
    ) {
        String customerId = getCustomerId(principal);
        return ResponseEntity.ok(loyaltyService.getCustomerLedger(customerId, storeId));
    }

    @GetMapping("/rewards")
    @Operation(summary = "Get eligible rewards")
    public ResponseEntity<List<LoyaltyRewardDto>> getRewards(
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId
    ) {
        String customerId = getCustomerId(principal);
        return ResponseEntity.ok(loyaltyService.getActiveCustomerRewards(storeId, customerId));
    }

    @PostMapping("/rewards/{rewardId}/redeem")
    @Operation(summary = "Redeem loyalty reward with points")
    public ResponseEntity<RewardRedemptionDto> redeemReward(
        @PathVariable String rewardId,
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId
    ) {
        String customerId = getCustomerId(principal);
        return ResponseEntity.ok(loyaltyService.redeemReward(customerId, storeId, rewardId));
    }

    @GetMapping("/redemptions")
    @Operation(summary = "Get active and past reward redemptions")
    public ResponseEntity<List<RewardRedemptionDto>> getRedemptions(
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId
    ) {
        String customerId = getCustomerId(principal);
        return ResponseEntity.ok(loyaltyService.getCustomerRedemptions(customerId, storeId));
    }

    @GetMapping("/referral")
    @Operation(summary = "Get or create customer referral code with URL validation")
    public ResponseEntity<CustomerReferralDto> getReferralCode(
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId,
        @RequestParam(defaultValue = "https://bhagya.commerce") String baseUrl
    ) {
        String customerId = getCustomerId(principal);
        String safeBaseUrl = sanitizeBaseUrl(baseUrl);
        return ResponseEntity.ok(loyaltyService.getOrCreateCustomerReferral(customerId, storeId, safeBaseUrl));
    }

    @GetMapping("/referral/history")
    @Operation(summary = "Get referral history")
    public ResponseEntity<List<CustomerReferralDto>> getReferralHistory(
        @CurrentUser UserPrincipal principal,
        @RequestParam(defaultValue = "store_main") String storeId
    ) {
        String customerId = getCustomerId(principal);
        return ResponseEntity.ok(loyaltyService.getCustomerReferralHistory(customerId, storeId));
    }
}
