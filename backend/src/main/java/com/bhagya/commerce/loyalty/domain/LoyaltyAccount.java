package com.bhagya.commerce.loyalty.domain;

import com.bhagya.commerce.common.error.ValidationException;
import java.time.Instant;

public class LoyaltyAccount {
    private String id;
    private String storeId;
    private String customerId;
    private String status; // ACTIVE, SUSPENDED, CLOSED
    private int availablePoints;
    private int lifetimeEarnedPoints;
    private int lifetimeRedeemedPoints;
    private int lifetimeExpiredPoints;
    private LoyaltyTier tier;
    private int version;
    private Instant createdAt;
    private Instant updatedAt;

    public LoyaltyAccount() {}

    public LoyaltyAccount(
        String id,
        String storeId,
        String customerId,
        String status,
        int availablePoints,
        int lifetimeEarnedPoints,
        int lifetimeRedeemedPoints,
        int lifetimeExpiredPoints,
        LoyaltyTier tier,
        int version,
        Instant createdAt,
        Instant updatedAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.customerId = customerId;
        this.status = status != null ? status : "ACTIVE";
        this.availablePoints = Math.max(0, availablePoints);
        this.lifetimeEarnedPoints = Math.max(0, lifetimeEarnedPoints);
        this.lifetimeRedeemedPoints = Math.max(0, lifetimeRedeemedPoints);
        this.lifetimeExpiredPoints = Math.max(0, lifetimeExpiredPoints);
        this.tier = tier != null ? tier : LoyaltyTier.fromLifetimePoints(lifetimeEarnedPoints);
        this.version = version;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public synchronized void creditPoints(int points) {
        if (points <= 0) {
            throw new ValidationException("Points to credit must be strictly positive.");
        }
        this.availablePoints += points;
        this.lifetimeEarnedPoints += points;
        this.tier = LoyaltyTier.fromLifetimePoints(this.lifetimeEarnedPoints);
        this.version++;
        this.updatedAt = Instant.now();
    }

    public synchronized void debitPoints(int points) {
        if (points <= 0) {
            throw new ValidationException("Points to debit must be strictly positive.");
        }
        if (this.availablePoints < points) {
            throw new ValidationException("Insufficient points balance. Available: " + this.availablePoints + ", Requested: " + points);
        }
        this.availablePoints -= points;
        this.lifetimeRedeemedPoints += points;
        this.version++;
        this.updatedAt = Instant.now();
    }

    public synchronized void reversePoints(int points) {
        if (points <= 0) {
            throw new ValidationException("Points to reverse must be strictly positive.");
        }
        this.availablePoints = Math.max(0, this.availablePoints - points);
        this.version++;
        this.updatedAt = Instant.now();
    }

    public synchronized void expirePoints(int points) {
        if (points <= 0) return;
        int pointsToExpire = Math.min(this.availablePoints, points);
        this.availablePoints -= pointsToExpire;
        this.lifetimeExpiredPoints += pointsToExpire;
        this.version++;
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getAvailablePoints() { return availablePoints; }
    public void setAvailablePoints(int availablePoints) { this.availablePoints = availablePoints; }

    public int getLifetimeEarnedPoints() { return lifetimeEarnedPoints; }
    public void setLifetimeEarnedPoints(int lifetimeEarnedPoints) { this.lifetimeEarnedPoints = lifetimeEarnedPoints; }

    public int getLifetimeRedeemedPoints() { return lifetimeRedeemedPoints; }
    public void setLifetimeRedeemedPoints(int lifetimeRedeemedPoints) { this.lifetimeRedeemedPoints = lifetimeRedeemedPoints; }

    public int getLifetimeExpiredPoints() { return lifetimeExpiredPoints; }
    public void setLifetimeExpiredPoints(int lifetimeExpiredPoints) { this.lifetimeExpiredPoints = lifetimeExpiredPoints; }

    public LoyaltyTier getTier() { return tier; }
    public void setTier(LoyaltyTier tier) { this.tier = tier; }

    public int getVersion() { return version; }
    public void setVersion(int version) { this.version = version; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
