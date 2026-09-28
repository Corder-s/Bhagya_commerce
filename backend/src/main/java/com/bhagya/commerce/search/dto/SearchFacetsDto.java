package com.bhagya.commerce.search.dto;

import java.util.List;
import java.util.Map;

public class SearchFacetsDto {
    private List<FacetItem> categories;
    private List<FacetItem> brands;
    private List<FacetItem> priceRanges;
    private List<FacetItem> ratings;
    private long inStockCount;
    private long discountedCount;

    public SearchFacetsDto() {}

    public static class FacetItem {
        private String id;
        private String label;
        private long count;

        public FacetItem() {}

        public FacetItem(String id, String label, long count) {
            this.id = id;
            this.label = label;
            this.count = count;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    public List<FacetItem> getCategories() { return categories; }
    public void setCategories(List<FacetItem> categories) { this.categories = categories; }

    public List<FacetItem> getBrands() { return brands; }
    public void setBrands(List<FacetItem> brands) { this.brands = brands; }

    public List<FacetItem> getPriceRanges() { return priceRanges; }
    public void setPriceRanges(List<FacetItem> priceRanges) { this.priceRanges = priceRanges; }

    public List<FacetItem> getRatings() { return ratings; }
    public void setRatings(List<FacetItem> ratings) { this.ratings = ratings; }

    public long getInStockCount() { return inStockCount; }
    public void setInStockCount(long inStockCount) { this.inStockCount = inStockCount; }

    public long getDiscountedCount() { return discountedCount; }
    public void setDiscountedCount(long discountedCount) { this.discountedCount = discountedCount; }
}
