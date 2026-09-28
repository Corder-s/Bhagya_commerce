package com.bhagya.commerce.review.domain;

import java.time.Instant;

public class ReviewModerationAudit {
    private String id;
    private String reviewId;
    private String actorUserId;
    private String action; // APPROVED, REJECTED, HIDDEN
    private String reason;
    private Instant createdAt;

    public ReviewModerationAudit() {
        this.createdAt = Instant.now();
    }

    public ReviewModerationAudit(String id, String reviewId, String actorUserId, String action, String reason) {
        this();
        this.id = id;
        this.reviewId = reviewId;
        this.actorUserId = actorUserId;
        this.action = action;
        this.reason = reason;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getActorUserId() { return actorUserId; }
    public void setActorUserId(String actorUserId) { this.actorUserId = actorUserId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
