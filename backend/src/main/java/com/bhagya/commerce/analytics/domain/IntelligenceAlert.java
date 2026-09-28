package com.bhagya.commerce.analytics.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class IntelligenceAlert {
    private String id;
    private String storeId;
    private String alertType; // LOW_STOCK, OUT_OF_STOCK, SALES_DROP, SALES_SPIKE, REFUND_SPIKE, CANCELLATION_SPIKE, PAYMENT_FAILURE_SPIKE, REVIEW_RATING_DROP, SHIPPING_DELAY_SPIKE, DEMAND_INCREASE
    private String severity; // INFO, WARNING, CRITICAL
    private String metricName;
    private BigDecimal currentValue;
    private BigDecimal baselineValue;
    private String title;
    private String message;
    private AlertStatus status;
    private Instant detectedAt;
    private Instant acknowledgedAt;
    private Instant resolvedAt;
    private Map<String, Object> metadata = new HashMap<>();

    public IntelligenceAlert() {
        this.status = AlertStatus.NEW;
        this.detectedAt = Instant.now();
    }

    public IntelligenceAlert(
        String id,
        String storeId,
        String alertType,
        String severity,
        String metricName,
        BigDecimal currentValue,
        BigDecimal baselineValue,
        String title,
        String message
    ) {
        this.id = id;
        this.storeId = storeId;
        this.alertType = alertType;
        this.severity = severity;
        this.metricName = metricName;
        this.currentValue = currentValue;
        this.baselineValue = baselineValue;
        this.title = title;
        this.message = message;
        this.status = AlertStatus.NEW;
        this.detectedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

    public BigDecimal getBaselineValue() { return baselineValue; }
    public void setBaselineValue(BigDecimal baselineValue) { this.baselineValue = baselineValue; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public AlertStatus getStatus() { return status; }
    public void setStatus(AlertStatus status) { this.status = status; }

    public Instant getDetectedAt() { return detectedAt; }
    public void setDetectedAt(Instant detectedAt) { this.detectedAt = detectedAt; }

    public Instant getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(Instant acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }

    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }

    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
}
