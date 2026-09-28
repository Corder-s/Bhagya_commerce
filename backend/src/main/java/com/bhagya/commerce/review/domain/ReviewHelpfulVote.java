package com.bhagya.commerce.review.domain;

import java.time.Instant;

public class ReviewHelpfulVote {
    private String id;
    private String reviewId;
    private String userId;
    private Instant createdAt;

    public ReviewHelpfulVote() {
        this.createdAt = Instant.now();
    }

    public ReviewHelpfulVote(String id, String reviewId, String userId) {
        this.id = id;
        this.reviewId = reviewId;
        this.userId = userId;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
