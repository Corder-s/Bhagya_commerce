package com.bhagya.commerce.tax.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class TaxRule {
    private String id;
    private String name;
    private TaxType taxType;
    private BigDecimal rate; // e.g. 0.05 for 5%, 0.18 for 18%
    private String jurisdiction; // e.g. "IN"
    private String productCategory;
    private Instant effectiveFrom;
    private Instant effectiveTo;
    private String status;

    public TaxRule() {}

    public TaxRule(String id, String name, TaxType taxType, BigDecimal rate, String jurisdiction, String productCategory) {
        this.id = id;
        this.name = name;
        this.taxType = taxType;
        this.rate = rate;
        this.jurisdiction = jurisdiction;
        this.productCategory = productCategory;
        this.effectiveFrom = Instant.now();
        this.status = "ACTIVE";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public TaxType getTaxType() { return taxType; }
    public void setTaxType(TaxType taxType) { this.taxType = taxType; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }

    public String getJurisdiction() { return jurisdiction; }
    public void setJurisdiction(String jurisdiction) { this.jurisdiction = jurisdiction; }

    public String getProductCategory() { return productCategory; }
    public void setProductCategory(String productCategory) { this.productCategory = productCategory; }

    public Instant getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(Instant effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public Instant getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(Instant effectiveTo) { this.effectiveTo = effectiveTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
