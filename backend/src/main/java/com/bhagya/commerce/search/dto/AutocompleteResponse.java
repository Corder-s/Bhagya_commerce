package com.bhagya.commerce.search.dto;

import java.util.List;

public class AutocompleteResponse {
    private String query;
    private List<ProductSuggestion> products;
    private List<BrandSuggestion> brands;
    private List<CategorySuggestion> categories;
    private List<CollectionSuggestion> collections;
    private List<String> popularSearches;

    public AutocompleteResponse() {}

    public static class ProductSuggestion {
        private String id;
        private String name;
        private String slug;
        private String categoryName;
        private String brandName;
        private String priceInr;
        private String imageUrl;

        public ProductSuggestion() {}

        public ProductSuggestion(String id, String name, String slug, String categoryName, String brandName, String priceInr, String imageUrl) {
            this.id = id;
            this.name = name;
            this.slug = slug;
            this.categoryName = categoryName;
            this.brandName = brandName;
            this.priceInr = priceInr;
            this.imageUrl = imageUrl;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }

        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

        public String getBrandName() { return brandName; }
        public void setBrandName(String brandName) { this.brandName = brandName; }

        public String getPriceInr() { return priceInr; }
        public void setPriceInr(String priceInr) { this.priceInr = priceInr; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    public static class BrandSuggestion {
        private String slug;
        private String name;
        private String location;
        private int productCount;

        public BrandSuggestion() {}

        public BrandSuggestion(String slug, String name, String location, int productCount) {
            this.slug = slug;
            this.name = name;
            this.location = location;
            this.productCount = productCount;
        }

        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public int getProductCount() { return productCount; }
        public void setProductCount(int productCount) { this.productCount = productCount; }
    }

    public static class CategorySuggestion {
        private String slug;
        private String name;
        private int productCount;

        public CategorySuggestion() {}

        public CategorySuggestion(String slug, String name, int productCount) {
            this.slug = slug;
            this.name = name;
            this.productCount = productCount;
        }

        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getProductCount() { return productCount; }
        public void setProductCount(int productCount) { this.productCount = productCount; }
    }

    public static class CollectionSuggestion {
        private String slug;
        private String title;
        private String description;

        public CollectionSuggestion() {}

        public CollectionSuggestion(String slug, String title, String description) {
            this.slug = slug;
            this.title = title;
            this.description = description;
        }

        public String getSlug() { return slug; }
        public void setSlug(String slug) { this.slug = slug; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public List<ProductSuggestion> getProducts() { return products; }
    public void setProducts(List<ProductSuggestion> products) { this.products = products; }

    public List<BrandSuggestion> getBrands() { return brands; }
    public void setBrands(List<BrandSuggestion> brands) { this.brands = brands; }

    public List<CategorySuggestion> getCategories() { return categories; }
    public void setCategories(List<CategorySuggestion> categories) { this.categories = categories; }

    public List<CollectionSuggestion> getCollections() { return collections; }
    public void setCollections(List<CollectionSuggestion> collections) { this.collections = collections; }

    public List<String> getPopularSearches() { return popularSearches; }
    public void setPopularSearches(List<String> popularSearches) { this.popularSearches = popularSearches; }
}
