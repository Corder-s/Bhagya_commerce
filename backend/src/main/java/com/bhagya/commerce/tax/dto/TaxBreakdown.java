package com.bhagya.commerce.tax.dto;

import java.math.BigDecimal;
import java.util.List;

public class TaxBreakdown {
    private BigDecimal taxableAmount;
    private BigDecimal cgstAmount;
    private BigDecimal sgstAmount;
    private BigDecimal igstAmount;
    private BigDecimal totalTax;
    private BigDecimal effectiveRate;
    private boolean isInterState;
    private String jurisdiction;
    private List<LineTaxBreakdown> lineBreakdowns;

    public TaxBreakdown() {}

    public static class LineTaxBreakdown {
        private String itemId;
        private String productName;
        private BigDecimal taxableAmount;
        private BigDecimal taxAmount;
        private BigDecimal rate;

        public LineTaxBreakdown() {}

        public LineTaxBreakdown(String itemId, String productName, BigDecimal taxableAmount, BigDecimal taxAmount, BigDecimal rate) {
            this.itemId = itemId;
            this.productName = productName;
            this.taxableAmount = taxableAmount;
            this.taxAmount = taxAmount;
            this.rate = rate;
        }

        public String getItemId() { return itemId; }
        public void setItemId(String itemId) { this.itemId = itemId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public BigDecimal getTaxableAmount() { return taxableAmount; }
        public void setTaxableAmount(BigDecimal taxableAmount) { this.taxableAmount = taxableAmount; }

        public BigDecimal getTaxAmount() { return taxAmount; }
        public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

        public BigDecimal getRate() { return rate; }
        public void setRate(BigDecimal rate) { this.rate = rate; }
    }

    public BigDecimal getTaxableAmount() { return taxableAmount; }
    public void setTaxableAmount(BigDecimal taxableAmount) { this.taxableAmount = taxableAmount; }

    public BigDecimal getCgstAmount() { return cgstAmount; }
    public void setCgstAmount(BigDecimal cgstAmount) { this.cgstAmount = cgstAmount; }

    public BigDecimal getSgstAmount() { return sgstAmount; }
    public void setSgstAmount(BigDecimal sgstAmount) { this.sgstAmount = sgstAmount; }

    public BigDecimal getIgstAmount() { return igstAmount; }
    public void setIgstAmount(BigDecimal igstAmount) { this.igstAmount = igstAmount; }

    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal totalTax) { this.totalTax = totalTax; }

    public BigDecimal getEffectiveRate() { return effectiveRate; }
    public void setEffectiveRate(BigDecimal effectiveRate) { this.effectiveRate = effectiveRate; }

    public boolean isInterState() { return isInterState; }
    public void setInterState(boolean interState) { isInterState = interState; }

    public String getJurisdiction() { return jurisdiction; }
    public void setJurisdiction(String jurisdiction) { this.jurisdiction = jurisdiction; }

    public List<LineTaxBreakdown> getLineBreakdowns() { return lineBreakdowns; }
    public void setLineBreakdowns(List<LineTaxBreakdown> lineBreakdowns) { this.lineBreakdowns = lineBreakdowns; }
}
