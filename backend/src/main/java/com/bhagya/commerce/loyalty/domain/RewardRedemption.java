package com.bhagya.commerce.loyalty.domain;

import java.time.Instant;

public class RewardRedemption {
    private String id;
    private String storeId;
    private String customerId;
    private String rewardId;
    private int pointsSpent;
    private RedemptionStatus status;
    private String referenceCode; // Coupon code issued, e.g. BG-REW-9482
    private String couponId;
    private String orderId;
    private Instant expiresAt;
    private Instant redeemedAt;
    private Instant createdAt;

    public RewardRedemption() {}

    public RewardRedemption(
        String id,
        String storeId,
        String customerId,
        String rewardId,
        int pointsSpent,
        RedemptionStatus status,
        String referenceCode,
        String couponId,
        String orderId,
        Instant expiresAt,
        Instant redeemedAt,
        Instant createdAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.customerId = customerId;
        this.rewardId = rewardId;
        this.pointsSpent = pointsSpent;
        this.status = status != null ? status : RedemptionStatus.ISSUED;
        this.referenceCode = referenceCode;
        this.couponId = couponId;
        this.orderId = orderId;
        this.expiresAt = expiresAt;
        this.redeemedAt = redeemedAt;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getRewardId() { return rewardId; }
    public void setRewardId(String rewardId) { this.rewardId = rewardId; }

    public int getPointsSpent() { return pointsSpent; }
    public void setPointsSpent(int pointsSpent) { this.pointsSpent = pointsSpent; }

    public RedemptionStatus getStatus() { return status; }
    public void setStatus(RedemptionStatus status) { this.status = status; }

    public String getReferenceCode() { return referenceCode; }
    public void setReferenceCode(String referenceCode) { this.referenceCode = referenceCode; }

    public String getCouponId() { return couponId; }
    public void setCouponId(String couponId) { this.couponId = couponId; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Instant getRedeemedAt() { return redeemedAt; }
    public void setRedeemedAt(Instant redeemedAt) { this.redeemedAt = redeemedAt; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
