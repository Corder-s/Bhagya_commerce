package com.bhagya.commerce.loyalty.controller;

import com.bhagya.commerce.auth.domain.SecurityUser;
import com.bhagya.commerce.loyalty.dto.CustomerReferralDto;
import com.bhagya.commerce.loyalty.dto.ReferralAttributionRequest;
import com.bhagya.commerce.loyalty.service.LoyaltyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/public/ref")
public class PublicReferralController {

    private final LoyaltyService loyaltyService;

    public PublicReferralController(LoyaltyService loyaltyService) {
        this.loyaltyService = loyaltyService;
    }

    @PostMapping("/attribute")
    public ResponseEntity<CustomerReferralDto> recordAttribution(
        @RequestBody ReferralAttributionRequest req,
        @AuthenticationPrincipal SecurityUser user
    ) {
        String referredId = user != null ? user.getId() : "usr_referred_guest";
        String storeId = req.storeId() != null ? req.storeId() : "store_main";
        return ResponseEntity.ok(loyaltyService.recordAttribution(req.referralCode(), storeId, referredId));
    }
}
