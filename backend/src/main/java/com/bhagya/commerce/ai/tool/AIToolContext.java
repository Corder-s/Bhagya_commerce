package com.bhagya.commerce.ai.tool;

import com.bhagya.commerce.ai.domain.AIContextMode;
import java.util.Collections;
import java.util.Set;

public record AIToolContext(
    String userId,
    String storeId,
    AIContextMode contextMode,
    boolean isMerchant,
    Set<String> permissions
) {
    public AIToolContext(String userId, String storeId, AIContextMode contextMode, boolean isMerchant) {
        this(userId, storeId, contextMode, isMerchant, Collections.emptySet());
    }

    public boolean hasPermission(String permissionCode) {
        if (permissionCode == null) return true;
        return permissions != null && permissions.contains(permissionCode);
    }

    public boolean isCustomer() {
        return contextMode == AIContextMode.CUSTOMER;
    }
}
