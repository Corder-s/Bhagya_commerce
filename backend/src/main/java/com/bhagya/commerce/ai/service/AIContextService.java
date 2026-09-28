package com.bhagya.commerce.ai.service;

import com.bhagya.commerce.ai.domain.AIContextMode;
import com.bhagya.commerce.ai.tool.AIToolContext;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import java.util.*;
import org.springframework.stereotype.Service;

@Service
public class AIContextService {

    private final TenantSecurityService tenantSecurityService;

    public AIContextService(TenantSecurityService tenantSecurityService) {
        this.tenantSecurityService = tenantSecurityService;
    }

    public AIToolContext resolveContext(UserPrincipal principal, String requestedMode, String requestedStoreId) {
        if (principal == null) {
            return new AIToolContext("usr_anonymous", "store_main", AIContextMode.CUSTOMER, false, Collections.emptySet());
        }

        String userId = principal.getId();
        boolean isMerchantPrincipal = principal.getAuthorities() != null &&
            principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("MERCHANT") || a.getAuthority().contains("ROLE_MERCHANT") || a.getAuthority().contains("STORE") || a.getAuthority().contains("ADMIN"));

        AIContextMode mode = "MERCHANT".equalsIgnoreCase(requestedMode) && isMerchantPrincipal
            ? AIContextMode.MERCHANT
            : AIContextMode.CUSTOMER;

        // Authoritative server-side store resolution: never trust client-supplied storeId without access validation
        String storeId;
        if (mode == AIContextMode.MERCHANT) {
            storeId = tenantSecurityService.resolveAuthoritativeStoreId(principal, requestedStoreId);
        } else {
            storeId = requestedStoreId != null && !requestedStoreId.isBlank() ? requestedStoreId : "store_main";
        }

        Set<String> permissions = new HashSet<>();
        if (principal.getAuthorities() != null) {
            for (var auth : principal.getAuthorities()) {
                permissions.add(auth.getAuthority().replace("ROLE_", "").replace("PERMISSION_", ""));
            }
        }

        // If merchant principal, grant standard baseline permissions if not explicitly set
        if (mode == AIContextMode.MERCHANT) {
            permissions.add("ANALYTICS_VIEW");
            permissions.add("ORDER_VIEW");
            permissions.add("INVENTORY_VIEW");
            permissions.add("INVENTORY_MANAGE");
            permissions.add("ORDER_MANAGE");
            permissions.add("LOYALTY_VIEW");
            permissions.add("REVIEW_VIEW");
            permissions.add("AI_MERCHANT_COPILOT");
            permissions.add("MARKETING_CREATE");
        }

        return new AIToolContext(userId, storeId, mode, mode == AIContextMode.MERCHANT, permissions);
    }
}
