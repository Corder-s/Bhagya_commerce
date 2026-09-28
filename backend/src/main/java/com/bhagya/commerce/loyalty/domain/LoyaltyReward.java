package com.bhagya.commerce.loyalty.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class LoyaltyReward {
    private String id;
    private String storeId;
    private String name;
    private String description;
    private RewardType type;
    private int pointsCost;
    private BigDecimal value;
    private BigDecimal minimumOrderValue;
    private BigDecimal maximumDiscount;
    private Integer usageLimit;
    private int perCustomerLimit;
    private Instant startsAt;
    private Instant endsAt;
    private boolean enabled;
    private Instant createdAt;
    private Instant updatedAt;

    public LoyaltyReward() {}

    public LoyaltyReward(
        String id,
        String storeId,
        String name,
        String description,
        RewardType type,
        int pointsCost,
        BigDecimal value,
        BigDecimal minimumOrderValue,
        BigDecimal maximumDiscount,
        Integer usageLimit,
        int perCustomerLimit,
        Instant startsAt,
        Instant endsAt,
        boolean enabled,
        Instant createdAt,
        Instant updatedAt
    ) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.description = description;
        this.type = type;
        this.pointsCost = pointsCost;
        this.value = value;
        this.minimumOrderValue = minimumOrderValue != null ? minimumOrderValue : BigDecimal.ZERO;
        this.maximumDiscount = maximumDiscount;
        this.usageLimit = usageLimit;
        this.perCustomerLimit = perCustomerLimit > 0 ? perCustomerLimit : 1;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.enabled = enabled;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.updatedAt = updatedAt != null ? updatedAt : Instant.now();
    }

    public boolean isCurrentlyActive() {
        if (!enabled) return false;
        Instant now = Instant.now();
        if (startsAt != null && now.isBefore(startsAt)) return false;
        if (endsAt != null && now.isAfter(endsAt)) return false;
        return true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public RewardType getType() { return type; }
    public void setType(RewardType type) { this.type = type; }

    public int getPointsCost() { return pointsCost; }
    public void setPointsCost(int pointsCost) { this.pointsCost = pointsCost; }

    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }

    public BigDecimal getMinimumOrderValue() { return minimumOrderValue; }
    public void setMinimumOrderValue(BigDecimal minimumOrderValue) { this.minimumOrderValue = minimumOrderValue; }

    public BigDecimal getMaximumDiscount() { return maximumDiscount; }
    public void setMaximumDiscount(BigDecimal maximumDiscount) { this.maximumDiscount = maximumDiscount; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public int getPerCustomerLimit() { return perCustomerLimit; }
    public void setPerCustomerLimit(int perCustomerLimit) { this.perCustomerLimit = perCustomerLimit; }

    public Instant getStartsAt() { return startsAt; }
    public void setStartsAt(Instant startsAt) { this.startsAt = startsAt; }

    public Instant getEndsAt() { return endsAt; }
    public void setEndsAt(Instant endsAt) { this.endsAt = endsAt; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
