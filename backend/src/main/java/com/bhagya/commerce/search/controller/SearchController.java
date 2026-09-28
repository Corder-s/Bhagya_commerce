package com.bhagya.commerce.search.controller;

import com.bhagya.commerce.search.dto.AutocompleteResponse;
import com.bhagya.commerce.search.dto.SearchFacetsDto;
import com.bhagya.commerce.search.dto.SearchRequest;
import com.bhagya.commerce.search.dto.SearchResponse;
import com.bhagya.commerce.search.service.SearchService;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.InputSanitizer;
import com.bhagya.commerce.common.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;
    private final InputSanitizer inputSanitizer;

    public SearchController(SearchService searchService, InputSanitizer inputSanitizer) {
        this.searchService = searchService;
        this.inputSanitizer = inputSanitizer;
    }

    private String cleanQuery(String q) {
        if (q == null) return null;
        String clean = inputSanitizer.sanitizeText(q);
        if (clean.length() > 200) {
            clean = clean.substring(0, 200);
        }
        return clean;
    }

    @GetMapping
    public ResponseEntity<SearchResponse> search(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "categories", required = false) List<String> categories,
            @RequestParam(value = "brands", required = false) List<String> brands,
            @RequestParam(value = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(value = "maxPrice", required = false) BigDecimal maxPrice,
            @RequestParam(value = "minRating", required = false) Double minRating,
            @RequestParam(value = "inStockOnly", required = false) Boolean inStockOnly,
            @RequestParam(value = "discountOnly", required = false) Boolean discountOnly,
            @RequestParam(value = "sort", defaultValue = "recommended") String sort,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "20") Integer size,
            @RequestParam(value = "storeId", required = false) String storeId,
            @CurrentUser UserPrincipal principal
    ) {
        int boundedPage = Math.max(0, page != null ? page : 0);
        int boundedSize = Math.min(100, Math.max(1, size != null ? size : 20));

        SearchRequest request = new SearchRequest();
        request.setQuery(cleanQuery(query));
        request.setCategoryIds(categories);
        request.setBrandIds(brands);
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setMinRating(minRating);
        request.setInStockOnly(inStockOnly);
        request.setDiscountOnly(discountOnly);
        request.setSort(cleanQuery(sort));
        request.setPage(boundedPage);
        request.setSize(boundedSize);
        request.setStoreId(storeId);
        request.setUserId(principal != null ? principal.getId() : null);

        SearchResponse response = searchService.search(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<AutocompleteResponse> autocomplete(
            @RequestParam("q") String query,
            @RequestParam(value = "storeId", required = false) String storeId
    ) {
        AutocompleteResponse response = searchService.autocomplete(cleanQuery(query), storeId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/facets")
    public ResponseEntity<SearchFacetsDto> getFacets(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "storeId", required = false) String storeId
    ) {
        SearchRequest request = new SearchRequest();
        request.setQuery(cleanQuery(query));
        request.setStoreId(storeId);
        SearchFacetsDto facets = searchService.getFacets(request);
        return ResponseEntity.ok(facets);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<String>> getTrending(
            @RequestParam(value = "limit", defaultValue = "5") int limit
    ) {
        int boundedLimit = Math.min(50, Math.max(1, limit));
        return ResponseEntity.ok(searchService.getTrendingSearches(boundedLimit));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<String>> getPopular(
            @RequestParam(value = "limit", defaultValue = "6") int limit
    ) {
        int boundedLimit = Math.min(50, Math.max(1, limit));
        return ResponseEntity.ok(searchService.getPopularSearches(boundedLimit));
    }
}
