package com.bhagya.commerce.organization.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.organization.domain.OrganizationMember;
import com.bhagya.commerce.organization.dto.OrganizationCreateRequest;
import com.bhagya.commerce.organization.dto.OrganizationResponse;
import com.bhagya.commerce.organization.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/organizations")
@Tag(name = "Organizations", description = "Merchant Business Organizations & Membership Management")
public class OrganizationController {

    private final OrganizationService organizationService;

    public OrganizationController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping("/{organizationId}")
    @Operation(summary = "Get organization details (requires membership)")
    public ResponseEntity<ApiResponse<OrganizationResponse>> getOrganization(
        @PathVariable String organizationId,
        @CurrentUser UserPrincipal principal
    ) {
        OrganizationResponse org = organizationService.getOrganization(organizationId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(org));
    }

    @PostMapping
    @Operation(summary = "Create a new seller organization")
    public ResponseEntity<ApiResponse<OrganizationResponse>> createOrganization(
        @CurrentUser UserPrincipal principal,
        @Valid @RequestBody OrganizationCreateRequest request
    ) {
        OrganizationResponse org = organizationService.createOrganization(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(org, "Organization created successfully"));
    }

    @GetMapping("/{organizationId}/members")
    @Operation(summary = "List organization team members")
    public ResponseEntity<ApiResponse<List<OrganizationMember>>> getMembers(
        @PathVariable String organizationId,
        @CurrentUser UserPrincipal principal
    ) {
        List<OrganizationMember> members = organizationService.getMembers(organizationId, principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(members));
    }
}
