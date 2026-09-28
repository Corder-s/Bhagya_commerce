package com.bhagya.commerce.loyalty.domain;

import java.time.Instant;

public class CustomerReferral {
    private String id;
    private String storeId;
    private String referrerCustomerId;
    private String referredCustomerId;
    private String referralCode;
    private ReferralStatus status;
    private String qualifiedOrderId;
    private String fraudFlagReason;
    private Instant createdAt;
    private Instant qualifiedAt;
    private Instant rewardedAt;

    public CustomerReferral() {}

    public CustomerReferral(
        String id,
        String storeId,
        String referrerCustomerId,
        String referredCustomerId,
        String referralCode,
        ReferralStatus status,
        String qualifiedOrderId,
        String fraudFlagReason,
        Instant createdAt,
        Instant qualifiedAt,
        Instant rewardedAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.referrerCustomerId = referrerCustomerId;
        this.referredCustomerId = referredCustomerId;
        this.referralCode = referralCode;
        this.status = status != null ? status : ReferralStatus.CREATED;
        this.qualifiedOrderId = qualifiedOrderId;
        this.fraudFlagReason = fraudFlagReason;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.qualifiedAt = qualifiedAt;
        this.rewardedAt = rewardedAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getReferrerCustomerId() { return referrerCustomerId; }
    public void setReferrerCustomerId(String referrerCustomerId) { this.referrerCustomerId = referrerCustomerId; }

    public String getReferredCustomerId() { return referredCustomerId; }
    public void setReferredCustomerId(String referredCustomerId) { this.referredCustomerId = referredCustomerId; }

    public String getReferralCode() { return referralCode; }
    public void setReferralCode(String referralCode) { this.referralCode = referralCode; }

    public ReferralStatus getStatus() { return status; }
    public void setStatus(ReferralStatus status) { this.status = status; }

    public String getQualifiedOrderId() { return qualifiedOrderId; }
    public void setQualifiedOrderId(String qualifiedOrderId) { this.qualifiedOrderId = qualifiedOrderId; }

    public String getFraudFlagReason() { return fraudFlagReason; }
    public void setFraudFlagReason(String fraudFlagReason) { this.fraudFlagReason = fraudFlagReason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getQualifiedAt() { return qualifiedAt; }
    public void setQualifiedAt(Instant qualifiedAt) { this.qualifiedAt = qualifiedAt; }

    public Instant getRewardedAt() { return rewardedAt; }
    public void setRewardedAt(Instant rewardedAt) { this.rewardedAt = rewardedAt; }
}
