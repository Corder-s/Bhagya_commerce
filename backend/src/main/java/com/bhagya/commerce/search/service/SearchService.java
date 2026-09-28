package com.bhagya.commerce.search.service;

import com.bhagya.commerce.search.dto.AutocompleteResponse;
import com.bhagya.commerce.search.dto.SearchFacetsDto;
import com.bhagya.commerce.search.dto.SearchRequest;
import com.bhagya.commerce.search.dto.SearchResponse;
import com.bhagya.commerce.search.provider.SearchProvider;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SearchService {

    private final SearchProvider searchProvider;
    private final SearchAnalyticsService analyticsService;

    private static final Map<String, String> COMMON_TYPOS = new HashMap<>();
    static {
        COMMON_TYPOS.put("oragnic", "organic");
        COMMON_TYPOS.put("organik", "organic");
        COMMON_TYPOS.put("shmapoo", "shampoo");
        COMMON_TYPOS.put("handlom", "handloom");
        COMMON_TYPOS.put("teracota", "terracotta");
        COMMON_TYPOS.put("terracota", "terracotta");
        COMMON_TYPOS.put("ayurvadic", "ayurvedic");
        COMMON_TYPOS.put("ayurweda", "ayurvedic");
        COMMON_TYPOS.put("milet", "millet");
        COMMON_TYPOS.put("millets", "millet");
        COMMON_TYPOS.put("cotten", "cotton");
        COMMON_TYPOS.put("potery", "pottery");
    }

    public SearchService(SearchProvider searchProvider, SearchAnalyticsService analyticsService) {
        this.searchProvider = searchProvider;
        this.analyticsService = analyticsService;
    }

    public SearchResponse search(SearchRequest request) {
        // Safe query sanitization
        String raw = request.getQuery() != null ? request.getQuery() : "";
        if (raw.length() > 100) {
            raw = raw.substring(0, 100);
        }
        String normalized = raw.trim().replaceAll("\\s+", " ");
        request.setQuery(normalized);

        // Execute search via Provider
        SearchResponse response = searchProvider.search(request);

        // Check for typos / Did you mean
        String lowerNorm = normalized.toLowerCase();
        if (response.getTotal() == 0 && !lowerNorm.isEmpty()) {
            for (Map.Entry<String, String> typo : COMMON_TYPOS.entrySet()) {
                if (lowerNorm.contains(typo.getKey())) {
                    String corrected = lowerNorm.replace(typo.getKey(), typo.getValue());
                    response.setDidYouMean(corrected);
                    request.setQuery(corrected);
                    break;
                }
            }
        }

        // Popular search keywords
        response.setPopularSearches(searchProvider.getPopularSearches(5));
        response.setRelatedCategories(Arrays.asList("Textiles", "Pottery", "Ayurvedic Wellness", "Natural Foods"));

        // Log analytics event asynchronously
        analyticsService.logSearchEvent(
                raw,
                normalized,
                (int) response.getTotal(),
                request.getUserId(),
                request.getStoreId(),
                buildFilterSummary(request),
                response.getExecutionTimeMs()
        );

        return response;
    }

    public AutocompleteResponse autocomplete(String query, String storeId) {
        String clean = query != null ? query.trim().replaceAll("\\s+", " ") : "";
        if (clean.length() > 50) {
            clean = clean.substring(0, 50);
        }
        return searchProvider.autocomplete(clean, storeId);
    }

    public SearchFacetsDto getFacets(SearchRequest request) {
        return searchProvider.getFacets(request);
    }

    public List<String> getTrendingSearches(int limit) {
        return searchProvider.getTrendingSearches(limit > 0 ? limit : 5);
    }

    public List<String> getPopularSearches(int limit) {
        return searchProvider.getPopularSearches(limit > 0 ? limit : 6);
    }

    private String buildFilterSummary(SearchRequest req) {
        StringBuilder sb = new StringBuilder();
        if (req.getCategoryIds() != null && !req.getCategoryIds().isEmpty()) {
            sb.append("cat=").append(String.join(",", req.getCategoryIds())).append(";");
        }
        if (req.getMinPrice() != null || req.getMaxPrice() != null) {
            sb.append("price=").append(req.getMinPrice()).append("-").append(req.getMaxPrice()).append(";");
        }
        if (req.getSort() != null) {
            sb.append("sort=").append(req.getSort()).append(";");
        }
        return sb.toString();
    }
}
