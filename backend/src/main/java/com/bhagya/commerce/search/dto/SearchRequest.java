package com.bhagya.commerce.search.dto;

import java.math.BigDecimal;
import java.util.List;

public class SearchRequest {
    private String query;
    private List<String> categoryIds;
    private List<String> brandIds;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minRating;
    private Boolean inStockOnly;
    private Boolean discountOnly;
    private String sort; // recommended, newest, price_asc, price_desc, top_rated
    private Integer page = 0;
    private Integer size = 20;
    private String storeId;
    private String userId;

    public SearchRequest() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public List<String> getCategoryIds() { return categoryIds; }
    public void setCategoryIds(List<String> categoryIds) { this.categoryIds = categoryIds; }

    public List<String> getBrandIds() { return brandIds; }
    public void setBrandIds(List<String> brandIds) { this.brandIds = brandIds; }

    public BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(BigDecimal minPrice) { this.minPrice = minPrice; }

    public BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(BigDecimal maxPrice) { this.maxPrice = maxPrice; }

    public Double getMinRating() { return minRating; }
    public void setMinRating(Double minRating) { this.minRating = minRating; }

    public Boolean getInStockOnly() { return inStockOnly; }
    public void setInStockOnly(Boolean inStockOnly) { this.inStockOnly = inStockOnly; }

    public Boolean getDiscountOnly() { return discountOnly; }
    public void setDiscountOnly(Boolean discountOnly) { this.discountOnly = discountOnly; }

    public String getSort() { return sort != null ? sort : "recommended"; }
    public void setSort(String sort) { this.sort = sort; }

    public Integer getPage() { return page != null && page >= 0 ? page : 0; }
    public void setPage(Integer page) { this.page = page; }

    public Integer getSize() { return size != null && size > 0 && size <= 50 ? size : 20; }
    public void setSize(Integer size) { this.size = size; }

    public String getStoreId() { return storeId; }
    public void setStoreId(String storeId) { this.storeId = storeId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
