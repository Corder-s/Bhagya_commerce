package com.bhagya.commerce.catalog.product.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public class Product {
    private String id;
    private String storeId;
    private String categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String blurb;
    private String description;
    private BigDecimal priceInr;
    private BigDecimal mrpInr;
    private int stockQuantity;
    private String sku;
    private ProductStatus status;
    private String imageUrl;
    private List<String> tags;
    private String shippingInfo;
    private String careInstructions;
    private double ratingValue;
    private int reviewCount;
    private Instant createdAt;
    private Instant updatedAt;

    public Product() {}

    public Product(
        String id,
        String storeId,
        String categoryId,
        String name,
        String slug,
        BigDecimal priceInr,
        int stockQuantity
    ) {
        this.id = id;
        this.storeId = storeId;
        this.categoryId = categoryId;
        this.name = name;
        this.slug = slug;
        this.priceInr = priceInr;
        this.stockQuantity = stockQuantity;
        this.status = ProductStatus.PUBLISHED;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getBlurb() { return blurb; }
    public void setBlurb(String blurb) { this.blurb = blurb; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPriceInr() { return priceInr; }
    public void setPriceInr(BigDecimal priceInr) { this.priceInr = priceInr; }

    public BigDecimal getMrpInr() { return mrpInr; }
    public void setMrpInr(BigDecimal mrpInr) { this.mrpInr = mrpInr; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getShippingInfo() { return shippingInfo; }
    public void setShippingInfo(String shippingInfo) { this.shippingInfo = shippingInfo; }

    public String getCareInstructions() { return careInstructions; }
    public void setCareInstructions(String careInstructions) { this.careInstructions = careInstructions; }

    public double getRatingValue() { return ratingValue; }
    public void setRatingValue(double ratingValue) { this.ratingValue = ratingValue; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
