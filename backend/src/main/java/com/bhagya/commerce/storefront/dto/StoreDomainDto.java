package com.bhagya.commerce.storefront.dto;

import com.bhagya.commerce.storefront.domain.DomainStatus;
import com.bhagya.commerce.storefront.domain.DomainType;
import java.time.Instant;

public record StoreDomainDto(
    String id,
    String storeId,
    String domain,
    DomainType type,
    DomainStatus status,
    boolean isPrimary,
    String verificationToken,
    String verificationMethod,
    Instant verifiedAt,
    String sslStatus,
    Instant createdAt
) {}
