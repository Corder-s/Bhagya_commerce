package com.bhagya.commerce.search.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductSearchItemDto {
    private String id;
    private String name;
    private String slug;
    private String categoryId;
    private String categoryName;
    private String brandName;
    private String blurb;
    private BigDecimal priceInr;
    private BigDecimal mrpInr;
    private Integer discountPercent;
    private String imageUrl;
    private Double ratingValue;
    private Integer reviewCount;
    private Boolean inStock;
    private Double relevanceScore;
    private String matchType; // EXACT, PREFIX, WORD, CATEGORY, BRAND, TAG, DESCRIPTION

    public ProductSearchItemDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getBrandName() { return brandName; }
    public void setBrandName(String brandName) { this.brandName = brandName; }

    public String getBlurb() { return blurb; }
    public void setBlurb(String blurb) { this.blurb = blurb; }

    public BigDecimal getPriceInr() { return priceInr; }
    public void setPriceInr(BigDecimal priceInr) { this.priceInr = priceInr; }

    public BigDecimal getMrpInr() { return mrpInr; }
    public void setMrpInr(BigDecimal mrpInr) { this.mrpInr = mrpInr; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getRatingValue() { return ratingValue; }
    public void setRatingValue(Double ratingValue) { this.ratingValue = ratingValue; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Double getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(Double relevanceScore) { this.relevanceScore = relevanceScore; }

    public String getMatchType() { return matchType; }
    public void setMatchType(String matchType) { this.matchType = matchType; }
}
