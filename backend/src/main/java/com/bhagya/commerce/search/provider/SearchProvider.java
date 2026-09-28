package com.bhagya.commerce.search.provider;

import com.bhagya.commerce.search.dto.AutocompleteResponse;
import com.bhagya.commerce.search.dto.SearchFacetsDto;
import com.bhagya.commerce.search.dto.SearchRequest;
import com.bhagya.commerce.search.dto.SearchResponse;

import java.util.List;

public interface SearchProvider {
    SearchResponse search(SearchRequest request);
    AutocompleteResponse autocomplete(String query, String storeId);
    SearchFacetsDto getFacets(SearchRequest request);
    List<String> getPopularSearches(int limit);
    List<String> getTrendingSearches(int limit);
}
