package com.bhagya.commerce.ai.domain;

import java.time.Instant;

public class AIFeedback {
    private String id;
    private String messageId;
    private String userId;
    private AIFeedbackRating rating;
    private String feedbackText;
    private Instant createdAt;

    public AIFeedback() {}

    public AIFeedback(
        String id,
        String messageId,
        String userId,
        AIFeedbackRating rating,
        String feedbackText,
        Instant createdAt
    ) {
        this.id = id;
        this.messageId = messageId;
        this.userId = userId;
        this.rating = rating != null ? rating : AIFeedbackRating.HELPFUL;
        this.feedbackText = feedbackText;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public AIFeedbackRating getRating() { return rating; }
    public void setRating(AIFeedbackRating rating) { this.rating = rating; }

    public String getFeedbackText() { return feedbackText; }
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
