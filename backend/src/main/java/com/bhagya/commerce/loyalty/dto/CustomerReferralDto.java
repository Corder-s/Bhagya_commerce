package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.CustomerReferral;
import java.time.Instant;

public record CustomerReferralDto(
    String id,
    String storeId,
    String referrerCustomerId,
    String referredCustomerId,
    String referralCode,
    String referralUrl,
    String status,
    String qualifiedOrderId,
    Instant createdAt,
    Instant qualifiedAt,
    Instant rewardedAt
) {
    public static CustomerReferralDto fromDomain(CustomerReferral r, String baseUrl) {
        String url = (baseUrl != null ? baseUrl : "") + "/ref/" + r.getReferralCode();
        return new CustomerReferralDto(
            r.getId(),
            r.getStoreId(),
            r.getReferrerCustomerId(),
            r.getReferredCustomerId(),
            r.getReferralCode(),
            url,
            r.getStatus().name(),
            r.getQualifiedOrderId(),
            r.getCreatedAt(),
            r.getQualifiedAt(),
            r.getRewardedAt()
        );
    }
}
