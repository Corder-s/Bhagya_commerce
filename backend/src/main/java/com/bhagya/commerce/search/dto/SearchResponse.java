package com.bhagya.commerce.search.dto;

import java.util.List;

public class SearchResponse {
    private String query;
    private String normalizedQuery;
    private List<ProductSearchItemDto> items;
    private long total;
    private int page;
    private int size;
    private int totalPages;
    private String didYouMean;
    private SearchFacetsDto facets;
    private List<String> relatedCategories;
    private List<String> popularSearches;
    private long executionTimeMs;

    public SearchResponse() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getNormalizedQuery() { return normalizedQuery; }
    public void setNormalizedQuery(String normalizedQuery) { this.normalizedQuery = normalizedQuery; }

    public List<ProductSearchItemDto> getItems() { return items; }
    public void setItems(List<ProductSearchItemDto> items) { this.items = items; }

    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public String getDidYouMean() { return didYouMean; }
    public void setDidYouMean(String didYouMean) { this.didYouMean = didYouMean; }

    public SearchFacetsDto getFacets() { return facets; }
    public void setFacets(SearchFacetsDto facets) { this.facets = facets; }

    public List<String> getRelatedCategories() { return relatedCategories; }
    public void setRelatedCategories(List<String> relatedCategories) { this.relatedCategories = relatedCategories; }

    public List<String> getPopularSearches() { return popularSearches; }
    public void setPopularSearches(List<String> popularSearches) { this.popularSearches = popularSearches; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }
}
