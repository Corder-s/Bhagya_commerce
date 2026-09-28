package com.bhagya.commerce.loyalty.dto;

import com.bhagya.commerce.loyalty.domain.LoyaltyLedgerEntry;
import java.time.Instant;

public record LoyaltyLedgerDto(
    String id,
    String storeId,
    String customerId,
    String type,
    int points,
    int balanceAfter,
    String referenceType,
    String referenceId,
    String description,
    Instant expiresAt,
    Instant createdAt
) {
    public static LoyaltyLedgerDto fromDomain(LoyaltyLedgerEntry e) {
        return new LoyaltyLedgerDto(
            e.getId(),
            e.getStoreId(),
            e.getCustomerId(),
            e.getType().name(),
            e.getPoints(),
            e.getBalanceAfter(),
            e.getReferenceType(),
            e.getReferenceId(),
            e.getDescription(),
            e.getExpiresAt(),
            e.getCreatedAt()
        );
    }
}
