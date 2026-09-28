package com.bhagya.commerce.billing.domain;

import java.math.BigDecimal;
import java.util.List;

public class MerchantPlan {
    private String id;
    private String name;
    private String description;
    private BigDecimal monthlyPriceInr;
    private BigDecimal yearlyPriceInr;
    private double commissionPercent;
    private int maxProducts;
    private boolean customDomainEnabled;
    private String aiTier; // NONE, STANDARD, ADVANCED, UNLIMITED
    private int storageLimitGb;
    private List<String> features;

    public MerchantPlan() {}

    public MerchantPlan(String id, String name, String description, BigDecimal monthlyPriceInr, BigDecimal yearlyPriceInr, double commissionPercent, int maxProducts, boolean customDomainEnabled, String aiTier, int storageLimitGb, List<String> features) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.monthlyPriceInr = monthlyPriceInr;
        this.yearlyPriceInr = yearlyPriceInr;
        this.commissionPercent = commissionPercent;
        this.maxProducts = maxProducts;
        this.customDomainEnabled = customDomainEnabled;
        this.aiTier = aiTier;
        this.storageLimitGb = storageLimitGb;
        this.features = features;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getMonthlyPriceInr() { return monthlyPriceInr; }
    public void setMonthlyPriceInr(BigDecimal monthlyPriceInr) { this.monthlyPriceInr = monthlyPriceInr; }

    public BigDecimal getYearlyPriceInr() { return yearlyPriceInr; }
    public void setYearlyPriceInr(BigDecimal yearlyPriceInr) { this.yearlyPriceInr = yearlyPriceInr; }

    public double getCommissionPercent() { return commissionPercent; }
    public void setCommissionPercent(double commissionPercent) { this.commissionPercent = commissionPercent; }

    public int getMaxProducts() { return maxProducts; }
    public void setMaxProducts(int maxProducts) { this.maxProducts = maxProducts; }

    public boolean isCustomDomainEnabled() { return customDomainEnabled; }
    public void setCustomDomainEnabled(boolean customDomainEnabled) { this.customDomainEnabled = customDomainEnabled; }

    public String getAiTier() { return aiTier; }
    public void setAiTier(String aiTier) { this.aiTier = aiTier; }

    public int getStorageLimitGb() { return storageLimitGb; }
    public void setStorageLimitGb(int storageLimitGb) { this.storageLimitGb = storageLimitGb; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
}
