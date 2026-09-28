package com.bhagya.commerce.loyalty.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class LoyaltyProgram {
    private String id;
    private String storeId;
    private boolean enabled;
    private String programName;
    private BigDecimal pointsPerSpent; // e.g. 0.05 => 1 pt per ₹20
    private BigDecimal currencyRatio;  // e.g. 1.00 => 1 pt = ₹1 credit
    private int signupBonusPoints;
    private int firstOrderBonusPoints;
    private int reviewBonusPoints;
    private int referralSenderPoints;
    private int referralReceiverPoints;
    private BigDecimal minOrderForPoints;
    private BigDecimal minOrderForReferral;
    private int pointsExpiryDays;
    private int expiryNotificationDays;
    private Instant createdAt;
    private Instant updatedAt;

    public LoyaltyProgram() {}

    public LoyaltyProgram(
        String id,
        String storeId,
        boolean enabled,
        String programName,
        BigDecimal pointsPerSpent,
        BigDecimal currencyRatio,
        int signupBonusPoints,
        int firstOrderBonusPoints,
        int reviewBonusPoints,
        int referralSenderPoints,
        int referralReceiverPoints,
        BigDecimal minOrderForPoints,
        BigDecimal minOrderForReferral,
        int pointsExpiryDays,
        int expiryNotificationDays,
        Instant createdAt,
        Instant updatedAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.enabled = enabled;
        this.programName = programName;
        this.pointsPerSpent = pointsPerSpent;
        this.currencyRatio = currencyRatio;
        this.signupBonusPoints = signupBonusPoints;
        this.firstOrderBonusPoints = firstOrderBonusPoints;
        this.reviewBonusPoints = reviewBonusPoints;
        this.referralSenderPoints = referralSenderPoints;
        this.referralReceiverPoints = referralReceiverPoints;
        this.minOrderForPoints = minOrderForPoints;
        this.minOrderForReferral = minOrderForReferral;
        this.pointsExpiryDays = pointsExpiryDays;
        this.expiryNotificationDays = expiryNotificationDays;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static LoyaltyProgram createDefault(String storeId) {
        Instant now = Instant.now();
        return new LoyaltyProgram(
            "prog_" + storeId,
            storeId,
            true,
            "Artisan Guild Rewards",
            new BigDecimal("0.05"),
            new BigDecimal("1.00"),
            100,
            150,
            50,
            300,
            150,
            new BigDecimal("100.00"),
            new BigDecimal("500.00"),
            365,
            14,
            now,
            now
        );
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getProgramName() { return programName; }
    public void setProgramName(String programName) { this.programName = programName; }

    public BigDecimal getPointsPerSpent() { return pointsPerSpent; }
    public void setPointsPerSpent(BigDecimal pointsPerSpent) { this.pointsPerSpent = pointsPerSpent; }

    public BigDecimal getCurrencyRatio() { return currencyRatio; }
    public void setCurrencyRatio(BigDecimal currencyRatio) { this.currencyRatio = currencyRatio; }

    public int getSignupBonusPoints() { return signupBonusPoints; }
    public void setSignupBonusPoints(int signupBonusPoints) { this.signupBonusPoints = signupBonusPoints; }

    public int getFirstOrderBonusPoints() { return firstOrderBonusPoints; }
    public void setFirstOrderBonusPoints(int firstOrderBonusPoints) { this.firstOrderBonusPoints = firstOrderBonusPoints; }

    public int getReviewBonusPoints() { return reviewBonusPoints; }
    public void setReviewBonusPoints(int reviewBonusPoints) { this.reviewBonusPoints = reviewBonusPoints; }

    public int getReferralSenderPoints() { return referralSenderPoints; }
    public void setReferralSenderPoints(int referralSenderPoints) { this.referralSenderPoints = referralSenderPoints; }

    public int getReferralReceiverPoints() { return referralReceiverPoints; }
    public void setReferralReceiverPoints(int referralReceiverPoints) { this.referralReceiverPoints = referralReceiverPoints; }

    public BigDecimal getMinOrderForPoints() { return minOrderForPoints; }
    public void setMinOrderForPoints(BigDecimal minOrderForPoints) { this.minOrderForPoints = minOrderForPoints; }

    public BigDecimal getMinOrderForReferral() { return minOrderForReferral; }
    public void setMinOrderForReferral(BigDecimal minOrderForReferral) { this.minOrderForReferral = minOrderForReferral; }

    public int getPointsExpiryDays() { return pointsExpiryDays; }
    public void setPointsExpiryDays(int pointsExpiryDays) { this.pointsExpiryDays = pointsExpiryDays; }

    public int getExpiryNotificationDays() { return expiryNotificationDays; }
    public void setExpiryNotificationDays(int expiryNotificationDays) { this.expiryNotificationDays = expiryNotificationDays; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
