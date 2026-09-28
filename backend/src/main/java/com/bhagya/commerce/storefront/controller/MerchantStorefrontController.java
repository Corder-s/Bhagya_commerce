package com.bhagya.commerce.storefront.controller;

import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.storefront.domain.DomainType;
import com.bhagya.commerce.storefront.dto.*;
import com.bhagya.commerce.storefront.service.DomainVerificationService;
import com.bhagya.commerce.storefront.service.StorefrontService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/storefront")
@PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
@Tag(name = "Merchant Storefront", description = "Storefront theme, content blocks, sections, and custom domains with tenant isolation")
public class MerchantStorefrontController {

    private final StorefrontService storefrontService;
    private final DomainVerificationService domainVerificationService;
    private final TenantSecurityService tenantSecurityService;

    public MerchantStorefrontController(
            StorefrontService storefrontService,
            DomainVerificationService domainVerificationService,
            TenantSecurityService tenantSecurityService
    ) {
        this.storefrontService = storefrontService;
        this.domainVerificationService = domainVerificationService;
        this.tenantSecurityService = tenantSecurityService;
    }

    private String resolveStoreId(UserPrincipal principal, String clientStoreId) {
        return tenantSecurityService.resolveAuthoritativeStoreId(principal, clientStoreId);
    }

    // ── Configuration & Branding ──────────────────────────────────────────

    @GetMapping("/config")
    @Operation(summary = "Get storefront configuration for authenticated store")
    public ResponseEntity<StorefrontConfigurationDto> getConfiguration(
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.getConfiguration(storeId));
    }

    @PutMapping("/config")
    @Operation(summary = "Update storefront configuration")
    public ResponseEntity<StorefrontConfigurationDto> updateConfiguration(
            @RequestBody StorefrontConfigurationDto dto,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.updateConfiguration(storeId, dto));
    }

    // ── Sections Management ───────────────────────────────────────────────

    @GetMapping("/sections")
    @Operation(summary = "Get storefront sections for store")
    public ResponseEntity<List<StorefrontSectionDto>> getSections(
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.getSections(storeId, true));
    }

    @PostMapping("/sections")
    @Operation(summary = "Add storefront section")
    public ResponseEntity<StorefrontSectionDto> addSection(
            @RequestBody StorefrontSectionDto dto,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.addSection(storeId, dto));
    }

    @PutMapping("/sections/{sectionId}")
    @Operation(summary = "Update storefront section")
    public ResponseEntity<StorefrontSectionDto> updateSection(
            @PathVariable String sectionId,
            @RequestBody StorefrontSectionDto dto,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.updateSection(storeId, sectionId, dto));
    }

    @DeleteMapping("/sections/{sectionId}")
    @Operation(summary = "Delete storefront section")
    public ResponseEntity<Void> deleteSection(
            @PathVariable String sectionId,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        storefrontService.deleteSection(storeId, sectionId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sections/reorder")
    @Operation(summary = "Reorder storefront sections")
    public ResponseEntity<List<StorefrontSectionDto>> reorderSections(
            @RequestBody SectionReorderRequest req,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.reorderSections(storeId, req.orderedSectionIds()));
    }

    // ── Preview & Publish ─────────────────────────────────────────────────

    @GetMapping("/preview")
    @Operation(summary = "Get draft preview data")
    public ResponseEntity<PublicStorefrontData> getPreview(
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.getDraftPreview(storeId));
    }

    @PostMapping("/publish")
    @Operation(summary = "Publish storefront draft to live storefront")
    public ResponseEntity<StorefrontPublishResponse> publish(
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(storefrontService.publishStorefront(storeId, principal.getId()));
    }

    // ── Custom Domains ────────────────────────────────────────────────────

    @GetMapping("/domains")
    @Operation(summary = "Get custom domains registered for store")
    public ResponseEntity<List<StoreDomainDto>> getDomains(
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(domainVerificationService.getDomainsForStore(storeId));
    }

    @PostMapping("/domains")
    @Operation(summary = "Add custom domain for store")
    public ResponseEntity<StoreDomainDto> addDomain(
            @RequestBody Map<String, String> body,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        String domain = body.get("domain");
        String typeStr = body.getOrDefault("type", "CUSTOM_DOMAIN");
        DomainType type = DomainType.valueOf(typeStr);
        return ResponseEntity.ok(domainVerificationService.addDomain(storeId, domain, type));
    }

    @PostMapping("/domains/{domainId}/verify")
    @Operation(summary = "Initiate and check domain verification")
    public ResponseEntity<DomainVerificationResult> verifyDomain(
            @PathVariable String domainId,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(domainVerificationService.checkVerification(storeId, domainId));
    }

    @PostMapping("/domains/{domainId}/activate")
    @Operation(summary = "Activate verified custom domain")
    public ResponseEntity<StoreDomainDto> activateDomain(
            @PathVariable String domainId,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(domainVerificationService.activateDomain(storeId, domainId));
    }

    @PostMapping("/domains/{domainId}/primary")
    @Operation(summary = "Set primary domain")
    public ResponseEntity<StoreDomainDto> setPrimary(
            @PathVariable String domainId,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(domainVerificationService.setPrimaryDomain(storeId, domainId));
    }

    @PostMapping("/domains/{domainId}/disable")
    @Operation(summary = "Disable custom domain")
    public ResponseEntity<StoreDomainDto> disableDomain(
            @PathVariable String domainId,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        return ResponseEntity.ok(domainVerificationService.disableDomain(storeId, domainId));
    }

    @DeleteMapping("/domains/{domainId}")
    @Operation(summary = "Delete custom domain")
    public ResponseEntity<Void> deleteDomain(
            @PathVariable String domainId,
            @RequestHeader(value = "X-Store-Id", required = false) String clientStoreId,
            @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal, clientStoreId);
        domainVerificationService.deleteDomain(storeId, domainId);
        return ResponseEntity.noContent().build();
    }
}
