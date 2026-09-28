package com.bhagya.commerce.review.domain;

import java.time.Instant;

public class ReviewMedia {
    private String id;
    private String reviewId;
    private String storageProvider;
    private String bucket;
    private String objectKey;
    private String url;
    private String thumbnailUrl;
    private String mimeType;
    private Long sizeBytes;
    private Integer width;
    private Integer height;
    private int sortOrder;
    private Instant createdAt;

    public ReviewMedia() {
        this.storageProvider = "R2";
        this.bucket = "bhagya-reviews";
        this.mimeType = "image/jpeg";
        this.createdAt = Instant.now();
    }

    public ReviewMedia(String id, String reviewId, String objectKey, String url, String thumbnailUrl) {
        this();
        this.id = id;
        this.reviewId = reviewId;
        this.objectKey = objectKey;
        this.url = url;
        this.thumbnailUrl = thumbnailUrl;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getReviewId() { return reviewId; }
    public void setReviewId(String reviewId) { this.reviewId = reviewId; }

    public String getStorageProvider() { return storageProvider; }
    public void setStorageProvider(String storageProvider) { this.storageProvider = storageProvider; }

    public String getBucket() { return bucket; }
    public void setBucket(String bucket) { this.bucket = bucket; }

    public String getObjectKey() { return objectKey; }
    public void setObjectKey(String objectKey) { this.objectKey = objectKey; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }

    public Long getSizeBytes() { return sizeBytes; }
    public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }

    public Integer getWidth() { return width; }
    public void setWidth(Integer width) { this.width = width; }

    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
