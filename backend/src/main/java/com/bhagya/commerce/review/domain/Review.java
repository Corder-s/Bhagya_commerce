package com.bhagya.commerce.review.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Review {
    private String id;
    private String productId;
    private String variantId;
    private String userId;
    private String authorDisplayName;
    private String orderId;
    private String orderItemId;
    private int rating;
    private String title;
    private String comment;
    private boolean isVerifiedPurchase;
    private ReviewStatus status;
    private String rejectionReason;
    private int helpfulCount;
    private List<ReviewMedia> media = new ArrayList<>();
    private ReviewResponse merchantResponse;
    private Instant createdAt;
    private Instant updatedAt;

    public Review() {
        this.status = ReviewStatus.PUBLISHED;
        this.isVerifiedPurchase = true;
        this.helpfulCount = 0;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public Review(String id, String productId, String userId, String authorDisplayName, int rating, String title, String comment, boolean isVerifiedPurchase) {
        this();
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.authorDisplayName = authorDisplayName;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.isVerifiedPurchase = isVerifiedPurchase;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getVariantId() { return variantId; }
    public void setVariantId(String variantId) { this.variantId = variantId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAuthorDisplayName() { return authorDisplayName; }
    public void setAuthorDisplayName(String authorDisplayName) { this.authorDisplayName = authorDisplayName; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getOrderItemId() { return orderItemId; }
    public void setOrderItemId(String orderItemId) { this.orderItemId = orderItemId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) {
        this.comment = comment;
        this.updatedAt = Instant.now();
    }

    public boolean isVerifiedPurchase() { return isVerifiedPurchase; }
    public void setVerifiedPurchase(boolean verifiedPurchase) { isVerifiedPurchase = verifiedPurchase; }

    public ReviewStatus getStatus() { return status; }
    public void setStatus(ReviewStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }

    public List<ReviewMedia> getMedia() { return media; }
    public void setMedia(List<ReviewMedia> media) { this.media = media != null ? media : new ArrayList<>(); }

    public ReviewResponse getMerchantResponse() { return merchantResponse; }
    public void setMerchantResponse(ReviewResponse merchantResponse) { this.merchantResponse = merchantResponse; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
