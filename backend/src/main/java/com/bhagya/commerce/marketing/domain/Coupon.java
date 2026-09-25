package com.bhagya.commerce.marketing.domain;

import java.time.Instant;

public class Coupon {
    private String id;
    private String promotionId;
    private String storeId;
    private String code;
    private Integer usageLimit;
    private Integer perCustomerLimit;
    private int usageCount;
    private Instant startsAt;
    private Instant endsAt;
    private String status;
    private Instant createdAt;

    public Coupon() {
        this.status = "ACTIVE";
        this.perCustomerLimit = 1;
        this.usageCount = 0;
        this.createdAt = Instant.now();
    }

    public Coupon(
        String id,
        String promotionId,
        String storeId,
        String code,
        Integer usageLimit,
        Integer perCustomerLimit,
        Instant startsAt,
        Instant endsAt
    ) {
        this.id = id;
        this.promotionId = promotionId;
        this.storeId = storeId;
        this.code = code != null ? code.trim().toUpperCase() : "";
        this.usageLimit = usageLimit;
        this.perCustomerLimit = perCustomerLimit != null ? perCustomerLimit : 1;
        this.usageCount = 0;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.status = "ACTIVE";
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPromotionId() { return promotionId; }
    public void setPromotionId(String promotionId) { this.promotionId = promotionId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code != null ? code.trim().toUpperCase() : ""; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getPerCustomerLimit() { return perCustomerLimit; }
    public void setPerCustomerLimit(Integer perCustomerLimit) { this.perCustomerLimit = perCustomerLimit; }

    public int getUsageCount() { return usageCount; }
    public void setUsageCount(int usageCount) { this.usageCount = usageCount; }

    public Instant getStartsAt() { return startsAt; }
    public void setStartsAt(Instant startsAt) { this.startsAt = startsAt; }

    public Instant getEndsAt() { return endsAt; }
    public void setEndsAt(Instant endsAt) { this.endsAt = endsAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
