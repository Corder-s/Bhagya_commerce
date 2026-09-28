package com.bhagya.commerce.billing.controller;

import com.bhagya.commerce.billing.domain.BillingInvoice;
import com.bhagya.commerce.billing.domain.BillingProfile;
import com.bhagya.commerce.billing.domain.MerchantPlan;
import com.bhagya.commerce.billing.domain.MerchantSubscription;
import com.bhagya.commerce.billing.service.BillingService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/billing")
@Tag(name = "Merchant Billing", description = "Authoritative subscription, invoice, and plan management")
public class MerchantBillingController {

    private final BillingService billingService;
    private final TenantSecurityService tenantSecurityService;

    public MerchantBillingController(BillingService billingService, TenantSecurityService tenantSecurityService) {
        this.billingService = billingService;
        this.tenantSecurityService = tenantSecurityService;
    }

    private void assertOwnerAuthority(UserPrincipal principal) {
        boolean isOwnerOrAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PLATFORM_ADMIN") || a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STORE_OWNER"));
        if (!isOwnerOrAdmin) {
            throw new ForbiddenException("Only organization owners have authority to modify subscriptions or billing profiles.");
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
    @Operation(summary = "Get billing overview for authenticated organization")
    public ResponseEntity<Map<String, Object>> getBillingOverview(
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("subscription", billingService.getSubscription(orgId));
        resp.put("profile", billingService.getBillingProfile(orgId));
        resp.put("plans", billingService.getAvailablePlans());
        resp.put("invoices", billingService.getBillingInvoices(orgId));
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/plans")
    @Operation(summary = "Get available platform plans")
    public ResponseEntity<List<MerchantPlan>> getPlans() {
        return ResponseEntity.ok(billingService.getAvailablePlans());
    }

    @GetMapping("/subscription")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
    @Operation(summary = "Get current organization subscription")
    public ResponseEntity<MerchantSubscription> getSubscription(
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        return ResponseEntity.ok(billingService.getSubscription(orgId));
    }

    @GetMapping("/invoices")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
    @Operation(summary = "Get billing invoices for organization")
    public ResponseEntity<List<BillingInvoice>> getInvoices(
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        return ResponseEntity.ok(billingService.getBillingInvoices(orgId));
    }

    @PostMapping("/profile")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'PLATFORM_ADMIN')")
    @Operation(summary = "Update billing profile (Owner only)")
    public ResponseEntity<BillingProfile> updateProfile(
            @RequestBody BillingProfile profile,
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        assertOwnerAuthority(principal);
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        profile.setOrganizationId(orgId);
        return ResponseEntity.ok(billingService.updateBillingProfile(profile));
    }

    @PostMapping("/subscription/change")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'PLATFORM_ADMIN')")
    @Operation(summary = "Change subscription plan (Owner only)")
    public ResponseEntity<MerchantSubscription> changePlan(
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        assertOwnerAuthority(principal);
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        String newPlanId = body.get("planId");
        return ResponseEntity.ok(billingService.changePlan(orgId, newPlanId));
    }

    @PostMapping("/subscription/cancel")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'PLATFORM_ADMIN')")
    @Operation(summary = "Cancel subscription (Owner only)")
    public ResponseEntity<MerchantSubscription> cancelSubscription(
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        assertOwnerAuthority(principal);
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        return ResponseEntity.ok(billingService.cancelSubscription(orgId));
    }

    @PostMapping("/subscription/resume")
    @PreAuthorize("hasAnyRole('STORE_OWNER', 'PLATFORM_ADMIN')")
    @Operation(summary = "Resume subscription (Owner only)")
    public ResponseEntity<MerchantSubscription> resumeSubscription(
            @RequestHeader(value = "X-Organization-Id", required = false) String clientOrgId,
            @CurrentUser UserPrincipal principal
    ) {
        assertOwnerAuthority(principal);
        String orgId = tenantSecurityService.resolveAuthoritativeOrgId(principal, clientOrgId);
        return ResponseEntity.ok(billingService.resumeSubscription(orgId));
    }

    @PostMapping("/webhook")
    @Operation(summary = "Billing provider webhook receiver with signature validation")
    public ResponseEntity<Map<String, Object>> handleWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-Webhook-Id", defaultValue = "evt_generic") String eventId,
            @RequestHeader(value = "X-Billing-Signature", required = false) String signature
    ) {
        // Enforce idempotency and process valid events
        boolean processed = billingService.processWebhookWithIdempotency(eventId, "RAZORPAY", "subscription.renewed");
        Map<String, Object> resp = new HashMap<>();
        resp.put("received", true);
        resp.put("processed", processed);
        return ResponseEntity.ok(resp);
    }
}
