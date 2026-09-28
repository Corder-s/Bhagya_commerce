package com.bhagya.commerce.invoice.domain;

import java.math.BigDecimal;
import java.time.Instant;

public class CreditNote {
    private String id;
    private String creditNoteNumber;
    private String invoiceId;
    private String orderId;
    private String reason;
    private BigDecimal amount;
    private BigDecimal taxAdjustment;
    private String status;
    private Instant issuedAt;

    public CreditNote() {}

    public CreditNote(String id, String creditNoteNumber, String invoiceId, String orderId, String reason, BigDecimal amount, BigDecimal taxAdjustment) {
        this.id = id;
        this.creditNoteNumber = creditNoteNumber;
        this.invoiceId = invoiceId;
        this.orderId = orderId;
        this.reason = reason;
        this.amount = amount;
        this.taxAdjustment = taxAdjustment;
        this.status = "ISSUED";
        this.issuedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCreditNoteNumber() { return creditNoteNumber; }
    public void setCreditNoteNumber(String creditNoteNumber) { this.creditNoteNumber = creditNoteNumber; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getTaxAdjustment() { return taxAdjustment; }
    public void setTaxAdjustment(BigDecimal taxAdjustment) { this.taxAdjustment = taxAdjustment; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }
}
