package com.bhagya.commerce.analytics.domain;

import java.time.Instant;

public class IntelligenceInsight {
    private String id;
    private String storeId;
    private String insightType; // PERFORMANCE, INVENTORY, CUSTOMER, MARKETING, LOYALTY, REVIEW, SHIPPING, PAYMENT, ANOMALY, FORECAST
    private String severity; // INFO, WARNING, CRITICAL
    private String title;
    private String summary; // WHAT happened
    private String evidence; // WHY / Based on what authoritative data
    private String metricName;
    private String suggestedAction; // WHAT could be considered
    private Instant detectedAt;
    private Instant expiresAt;
    private String status; // ACTIVE, DISMISSED, ARCHIVED

    public IntelligenceInsight() {
        this.status = "ACTIVE";
        this.detectedAt = Instant.now();
    }

    public IntelligenceInsight(
        String id,
        String storeId,
        String insightType,
        String severity,
        String title,
        String summary,
        String evidence,
        String metricName,
        String suggestedAction
    ) {
        this.id = id;
        this.storeId = storeId;
        this.insightType = insightType;
        this.severity = severity;
        this.title = title;
        this.summary = summary;
        this.evidence = evidence;
        this.metricName = metricName;
        this.suggestedAction = suggestedAction;
        this.status = "ACTIVE";
        this.detectedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getInsightType() { return insightType; }
    public void setInsightType(String insightType) { this.insightType = insightType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }

    public Instant getDetectedAt() { return detectedAt; }
    public void setDetectedAt(Instant detectedAt) { this.detectedAt = detectedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
