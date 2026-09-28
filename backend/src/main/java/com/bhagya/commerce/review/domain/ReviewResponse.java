package com.bhagya.commerce.review.domain;

import java.time.Instant;

public class ReviewResponse {
    private String id;
    private String reviewId;
    private String storeId;
    private String authorUserId;
    private String authorName;
    private String body;
    private String status; // PUBLISHED, HIDDEN
    private Instant createdAt;
    private Instant updatedAt;

    public ReviewResponse() {
        this.status = "PUBLISHED";
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public ReviewResponse(String id, String reviewId, String storeId, String authorUserId, String authorName, String body) {
        this();
        this.id = id;
        this.reviewId = reviewId;
        this.storeId = storeId;
        this.authorUserId = authorUserId;
        this.authorName = authorName;
        this.body = body;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getAuthorUserId() { return authorUserId; }
    public void setAuthorUserId(String authorUserId) { this.authorUserId = authorUserId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getBody() { return body; }
    public void setBody(String body) {
        this.body = body;
        this.updatedAt = Instant.now();
    }

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
