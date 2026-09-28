package com.bhagya.commerce.review.domain;

import java.time.Instant;

public class ReviewReport {
    private String id;
    private String reviewId;
    private String reporterUserId;
    private String reason; // SPAM, ABUSE, HARASSMENT, FAKE_CONTENT, OFF_TOPIC, OTHER
    private String description;
    private String status; // PENDING, RESOLVED, DISMISSED
    private Instant createdAt;
    private Instant updatedAt;

    public ReviewReport() {
        this.status = "PENDING";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public ReviewReport(String id, String reviewId, String reporterUserId, String reason, String description) {
        this();
        this.id = id;
        this.reviewId = reviewId;
        this.reporterUserId = reporterUserId;
        this.reason = reason;
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getReporterUserId() { return reporterUserId; }
    public void setReporterUserId(String reporterUserId) { this.reporterUserId = reporterUserId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
