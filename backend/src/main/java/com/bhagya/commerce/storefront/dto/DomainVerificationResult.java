package com.bhagya.commerce.storefront.dto;

import com.bhagya.commerce.storefront.domain.DomainStatus;

public record DomainVerificationResult(
    String domainId,
    String domain,
    DomainStatus status,
    boolean verified,
    String message,
    String expectedRecordType,
    String expectedHost,
    String expectedValue
) {}
