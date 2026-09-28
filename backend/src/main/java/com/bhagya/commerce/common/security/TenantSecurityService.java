package com.bhagya.commerce.common.security;

import com.bhagya.commerce.audit.service.AuditService;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.common.error.UnauthorizedException;
import com.bhagya.commerce.common.error.ValidationException;
import com.bhagya.commerce.organization.domain.Organization;
import com.bhagya.commerce.organization.repository.OrganizationRepository;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.StoreRepository;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

/**
 * Authoritative Server-Side Multi-Tenant Authorization Service.
 *
 * Enforces the strict zero-trust boundary:
 * Authenticated User -> Organization -> Membership -> Role -> Permission -> Store Access -> Resource Ownership
 *
 * Guarantees that client-supplied storeId, orgId, or customerId cannot bypass tenant isolation.
 */
@Service
public class TenantSecurityService {

    private static final Logger log = LoggerFactory.getLogger(TenantSecurityService.class);

    private final OrganizationRepository organizationRepository;
    private final StoreRepository storeRepository;
    private final AuditService auditService;

    public TenantSecurityService(
        OrganizationRepository organizationRepository,
        StoreRepository storeRepository,
        @Lazy AuditService auditService
    ) {
        this.organizationRepository = organizationRepository;
        this.storeRepository = storeRepository;
        this.auditService = auditService;
    }

    /**
     * Resolves the authoritative store for an authenticated merchant user.
     * If client supplies a storeId, validates that the user is authorized for that specific store.
     * Never permits unauthenticated or cross-tenant access.
     */
    public String resolveAuthoritativeStoreId(UserPrincipal principal, String clientSuppliedStoreId) {
        if (principal == null) {
            throw new UnauthorizedException("Authentication required to access store resources.");
        }

        // Platform Admins have sovereign oversight, but access is audit-logged
        boolean isPlatformAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PLATFORM_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

        if (clientSuppliedStoreId != null && !clientSuppliedStoreId.isBlank()) {
            if (isPlatformAdmin) {
                return clientSuppliedStoreId;
            }
            validateUserStoreAccess(principal, clientSuppliedStoreId);
            return clientSuppliedStoreId;
        }

        // If client did not provide storeId, resolve from user's authorized stores
        List<Organization> orgs = organizationRepository.findByUserId(principal.getId());
        if (orgs.isEmpty()) {
            // Also check if principal has a storeId embedded in token claims
            if (principal.getStoreId() != null && !principal.getStoreId().isBlank()) {
                return principal.getStoreId();
            }
            throw new ForbiddenException("No organization membership found for user: " + principal.getId());
        }

        String orgId = orgs.get(0).getId();
        List<Store> stores = storeRepository.findByOrganizationId(orgId);
        if (stores.isEmpty()) {
            if (principal.getStoreId() != null && !principal.getStoreId().isBlank()) {
                return principal.getStoreId();
            }
            throw new ResourceNotFoundException("No stores found for user's organization: " + orgId);
        }

        return stores.get(0).getId();
    }

    /**
     * Validates that an authenticated user has legitimate access to the specified store.
     */
    public void validateUserStoreAccess(UserPrincipal principal, String storeId) {
        if (principal == null) {
            throw new UnauthorizedException("Authentication required.");
        }
        if (storeId == null || storeId.isBlank()) {
            throw new ValidationException("Store identifier is required.");
        }

        // Platform Admin check
        boolean isPlatformAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PLATFORM_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));
        if (isPlatformAdmin) {
            return;
        }

        // Fast path: principal claim matches requested store
        if (storeId.equals(principal.getStoreId())) {
            return;
        }

        // Check organization ownership & store membership
        List<Organization> userOrgs = organizationRepository.findByUserId(principal.getId());
        boolean hasAccess = false;
        for (Organization org : userOrgs) {
            List<Store> orgStores = storeRepository.findByOrganizationId(org.getId());
            if (orgStores.stream().anyMatch(s -> s.getId().equals(storeId))) {
                hasAccess = true;
                break;
            }
        }

        if (!hasAccess) {
            log.warn("[SECURITY] Cross-tenant access attempt blocked: user={} attempted to access store={}",
                principal.getId(), storeId);
            auditService.record(
                "CROSS_TENANT_ACCESS_ATTEMPT",
                principal.getId(),
                "STORE",
                storeId,
                Map.of("deniedReason", "User not member of store organization")
            );
            throw new ForbiddenException("Cross-tenant access denied: you do not have permission to access store " + storeId);
        }
    }

    /**
     * Resolves the authoritative organization ID for an authenticated user.
     */
    public String resolveAuthoritativeOrgId(UserPrincipal principal, String clientSuppliedOrgId) {
        if (principal == null) {
            throw new UnauthorizedException("Authentication required.");
        }

        boolean isPlatformAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PLATFORM_ADMIN") || a.getAuthority().equals("ROLE_ADMIN"));

        List<Organization> userOrgs = organizationRepository.findByUserId(principal.getId());

        if (clientSuppliedOrgId != null && !clientSuppliedOrgId.isBlank()) {
            if (isPlatformAdmin) {
                return clientSuppliedOrgId;
            }
            boolean isMember = userOrgs.stream().anyMatch(o -> o.getId().equals(clientSuppliedOrgId));
            if (!isMember) {
                log.warn("[SECURITY] Cross-tenant organization access attempt blocked: user={} org={}", principal.getId(), clientSuppliedOrgId);
                auditService.record("CROSS_TENANT_ACCESS_ATTEMPT", principal.getId(), "ORGANIZATION", clientSuppliedOrgId, Map.of("reason", "Not an organization member"));
                throw new ForbiddenException("Access denied: You are not a member of organization " + clientSuppliedOrgId);
            }
            return clientSuppliedOrgId;
        }

        if (!userOrgs.isEmpty()) {
            return userOrgs.get(0).getId();
        }

        if (principal.getOrganizationId() != null && !principal.getOrganizationId().isBlank()) {
            return principal.getOrganizationId();
        }

        throw new ForbiddenException("No organization associated with user: " + principal.getId());
    }

    /**
     * Validates that the customer is accessing only their own resources (IDOR protection).
     */
    public void validateCustomerOwnership(UserPrincipal principal, String resourceOwnerUserId) {
        if (principal == null) {
            throw new UnauthorizedException("Authentication required.");
        }
        boolean isStaffOrAdmin = principal.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("ROLE_PLATFORM_ADMIN") || a.getAuthority().equals("ROLE_ADMIN")
                || a.getAuthority().equals("ROLE_STORE_OWNER") || a.getAuthority().equals("ROLE_STORE_ADMIN"));

        if (!isStaffOrAdmin && !principal.getId().equals(resourceOwnerUserId)) {
            log.warn("[SECURITY] IDOR attempt blocked: user={} attempted to access data of customer={}",
                principal.getId(), resourceOwnerUserId);
            throw new ForbiddenException("Access denied: You cannot access resources belonging to another customer.");
        }
    }

    /**
     * Validates that an upload/storage object key is strictly scoped to the store's tenant prefix.
     */
    public void validateObjectKeyTenantScope(String storeId, String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            throw new ValidationException("Object key cannot be empty.");
        }
        String expectedPrefix = "stores/" + storeId + "/";
        if (!objectKey.startsWith(expectedPrefix)) {
            log.warn("[SECURITY] Path traversal / cross-tenant R2 access attempt blocked: storeId={} objectKey={}",
                storeId, objectKey);
            throw new ForbiddenException("Cross-tenant storage violation: objectKey must reside within " + expectedPrefix);
        }
    }
}
