package com.bhagya.commerce.loyalty.domain;

import java.time.Instant;

public class LoyaltyLedgerEntry {
    private String id;
    private String storeId;
    private String customerId;
    private String loyaltyAccountId;
    private LedgerEntryType type;
    private int points; // + for credit, - for debit
    private int balanceAfter;
    private String referenceType;
    private String referenceId;
    private String description;
    private Instant expiresAt;
    private String createdBy;
    private Instant createdAt;

    public LoyaltyLedgerEntry() {}

    public LoyaltyLedgerEntry(
        String id,
        String storeId,
        String customerId,
        String loyaltyAccountId,
        LedgerEntryType type,
        int points,
        int balanceAfter,
        String referenceType,
        String referenceId,
        String description,
        Instant expiresAt,
        String createdBy,
        Instant createdAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.customerId = customerId;
        this.loyaltyAccountId = loyaltyAccountId;
        this.type = type;
        this.points = points;
        this.balanceAfter = balanceAfter;
        this.referenceType = referenceType;
        this.referenceId = referenceId;
        this.description = description;
        this.expiresAt = expiresAt;
        this.createdBy = createdBy;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getLoyaltyAccountId() { return loyaltyAccountId; }
    public void setLoyaltyAccountId(String loyaltyAccountId) { this.loyaltyAccountId = loyaltyAccountId; }

    public LedgerEntryType getType() { return type; }
    public void setType(LedgerEntryType type) { this.type = type; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public int getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(int balanceAfter) { this.balanceAfter = balanceAfter; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }

    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
