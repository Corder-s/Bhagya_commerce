package com.bhagya.commerce.marketing.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Promotion {
    private String id;
    private String storeId;
    private String name;
    private String description;
    private PromotionType type;
    private PromotionStatus status;
    private BigDecimal value;
    private String currency;
    private BigDecimal minimumOrderValue;
    private BigDecimal maximumDiscount;
    private Instant startsAt;
    private Instant endsAt;
    private Integer usageLimit;
    private Integer perCustomerLimit;
    private int usageCount;
    private List<String> eligibleCategoryIds = new ArrayList<>();
    private List<String> eligibleProductIds = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public Promotion() {
        this.status = PromotionStatus.DRAFT;
        this.currency = "INR";
        this.minimumOrderValue = BigDecimal.ZERO;
        this.perCustomerLimit = 1;
        this.usageCount = 0;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Promotion(
        String id,
        String storeId,
        String name,
        String description,
        PromotionType type,
        PromotionStatus status,
        BigDecimal value,
        String currency,
        BigDecimal minimumOrderValue,
        BigDecimal maximumDiscount,
        Instant startsAt,
        Instant endsAt,
        Integer usageLimit,
        Integer perCustomerLimit
    ) {
        this.id = id;
        this.storeId = storeId;
        this.name = name;
        this.description = description;
        this.type = type;
        this.status = status != null ? status : PromotionStatus.DRAFT;
        this.value = value;
        this.currency = currency != null ? currency : "INR";
        this.minimumOrderValue = minimumOrderValue != null ? minimumOrderValue : BigDecimal.ZERO;
        this.maximumDiscount = maximumDiscount;
        this.startsAt = startsAt;
        this.endsAt = endsAt;
        this.usageLimit = usageLimit;
        this.perCustomerLimit = perCustomerLimit != null ? perCustomerLimit : 1;
        this.usageCount = 0;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public PromotionType getType() { return type; }
    public void setType(PromotionType type) { this.type = type; }

    public PromotionStatus getStatus() { return status; }
    public void setStatus(PromotionStatus status) { this.status = status; }

    public BigDecimal getValue() { return value; }
    public void setValue(BigDecimal value) { this.value = value; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getMinimumOrderValue() { return minimumOrderValue; }
    public void setMinimumOrderValue(BigDecimal minimumOrderValue) { this.minimumOrderValue = minimumOrderValue; }

    public BigDecimal getMaximumDiscount() { return maximumDiscount; }
    public void setMaximumDiscount(BigDecimal maximumDiscount) { this.maximumDiscount = maximumDiscount; }

    public Instant getStartsAt() { return startsAt; }
    public void setStartsAt(Instant startsAt) { this.startsAt = startsAt; }

    public Instant getEndsAt() { return endsAt; }
    public void setEndsAt(Instant endsAt) { this.endsAt = endsAt; }

    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }

    public Integer getPerCustomerLimit() { return perCustomerLimit; }
    public void setPerCustomerLimit(Integer perCustomerLimit) { this.perCustomerLimit = perCustomerLimit; }

    public int getUsageCount() { return usageCount; }
    public void setUsageCount(int usageCount) { this.usageCount = usageCount; }

    public List<String> getEligibleCategoryIds() { return eligibleCategoryIds; }
    public void setEligibleCategoryIds(List<String> eligibleCategoryIds) { this.eligibleCategoryIds = eligibleCategoryIds; }

    public List<String> getEligibleProductIds() { return eligibleProductIds; }
    public void setEligibleProductIds(List<String> eligibleProductIds) { this.eligibleProductIds = eligibleProductIds; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
