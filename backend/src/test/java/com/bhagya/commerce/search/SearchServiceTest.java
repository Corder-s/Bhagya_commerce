package com.bhagya.commerce.search;

import com.bhagya.commerce.search.dto.SearchRequest;
import com.bhagya.commerce.search.dto.SearchResponse;
import com.bhagya.commerce.search.provider.SearchProvider;
import com.bhagya.commerce.search.service.SearchAnalyticsService;
import com.bhagya.commerce.search.service.SearchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class SearchServiceTest {

    private SearchProvider searchProvider;
    private SearchAnalyticsService analyticsService;
    private SearchService searchService;

    @BeforeEach
    void setUp() {
        searchProvider = Mockito.mock(SearchProvider.class);
        analyticsService = Mockito.mock(SearchAnalyticsService.class);
        searchService = new SearchService(searchProvider, analyticsService);
    }

    @Test
    void testQueryNormalizationAndTypoCorrection() {
        SearchResponse mockResponse = new SearchResponse();
        mockResponse.setTotal(0);
        mockResponse.setItems(Collections.emptyList());

        when(searchProvider.search(any(SearchRequest.class))).thenReturn(mockResponse);
        when(searchProvider.getPopularSearches(5)).thenReturn(Collections.singletonList("Organic Cotton"));

        SearchRequest request = new SearchRequest();
        request.setQuery("   oragnic   soap   ");

        SearchResponse result = searchService.search(request);

        assertNotNull(result);
        assertEquals("organic soap", result.getDidYouMean());
        assertEquals("organic soap", request.getQuery());
    }

    @Test
    void testSearchWithResultsNoTypoNeeded() {
        SearchResponse mockResponse = new SearchResponse();
        mockResponse.setTotal(5);
        mockResponse.setItems(Collections.emptyList());

        when(searchProvider.search(any(SearchRequest.class))).thenReturn(mockResponse);
        when(searchProvider.getPopularSearches(5)).thenReturn(Collections.singletonList("Organic Cotton"));

        SearchRequest request = new SearchRequest();
        request.setQuery("Handloom");

        SearchResponse result = searchService.search(request);

        assertNotNull(result);
        assertNull(result.getDidYouMean());
        assertEquals(5, result.getTotal());
    }
}
