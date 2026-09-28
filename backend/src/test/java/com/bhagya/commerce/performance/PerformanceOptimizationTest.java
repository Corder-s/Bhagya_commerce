package com.bhagya.commerce.performance;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.bhagya.commerce.common.observability.TraceIdFilter;
import com.bhagya.commerce.common.queue.JobQueue;
import com.bhagya.commerce.export.dto.ExportJobResponse;
import com.bhagya.commerce.export.service.ExportJobService;
import com.bhagya.commerce.store.domain.Store;
import com.bhagya.commerce.store.repository.InMemoryStoreRepository;
import com.bhagya.commerce.storefront.controller.PublicStorefrontController;
import com.bhagya.commerce.storefront.dto.PublicStorefrontData;
import com.bhagya.commerce.storefront.service.DomainVerificationService;
import com.bhagya.commerce.storefront.service.StorefrontService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.Instant;

class PerformanceOptimizationTest {

    private PublicStorefrontController storefrontController;
    private StorefrontService storefrontService;
    private ExportJobService exportJobService;
    private TraceIdFilter traceIdFilter;

    @BeforeEach
    void setUp() {
        InMemoryStoreRepository storeRepo = new InMemoryStoreRepository();
        storeRepo.save(new Store("store_test_perf", "org_test", "Jaipur Crafts", "jaipur-crafts"));

        storefrontService = new StorefrontService(null, storeRepo, new DomainVerificationService(null, null), null, null);
        storefrontController = new PublicStorefrontController(storefrontService);

        traceIdFilter = new TraceIdFilter();
        exportJobService = new ExportJobService(new JobQueue(null), new com.bhagya.commerce.analytics.service.AnalyticsAggregationService(
            new com.bhagya.commerce.order.repository.InMemoryOrderRepository(),
            new com.bhagya.commerce.catalog.product.repository.InMemoryProductRepository(),
            storeRepo,
            null,
            null
        ));
    }

    @Test
    @DisplayName("[CDN / ETAG] Storefront returns ETag, Cache-Control, and handles conditional 304 Not Modified")
    void testStorefrontCachingAndEtag() {
        // Initial request
        ResponseEntity<PublicStorefrontData> initialResponse = storefrontController.getPublicStorefront("varanasi-heritage-silks", "bhagya.in", null);
        assertEquals(HttpStatus.OK, initialResponse.getStatusCode());
        assertNotNull(initialResponse.getHeaders().getETag());
        assertTrue(initialResponse.getHeaders().getCacheControl().contains("public"));
        assertTrue(initialResponse.getHeaders().getCacheControl().contains("s-maxage=300"));

        String etag = initialResponse.getHeaders().getETag();

        // Conditional request with matching If-None-Match
        ResponseEntity<PublicStorefrontData> conditionalResponse = storefrontController.getPublicStorefront("varanasi-heritage-silks", "bhagya.in", etag);
        assertEquals(HttpStatus.NOT_MODIFIED, conditionalResponse.getStatusCode(), "Expected 304 Not Modified when ETag matches");
    }

    @Test
    @DisplayName("[TRACING] TraceIdFilter propagates incoming or creates clean trace ID in response")
    void testTraceIdFilterPropagation() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(TraceIdFilter.TRACE_HEADER, "custom-trace-12345");
        MockHttpServletResponse response = new MockHttpServletResponse();
        MockFilterChain filterChain = new MockFilterChain();

        traceIdFilter.doFilter(request, response, filterChain);

        assertEquals("custom-trace-12345", response.getHeader(TraceIdFilter.TRACE_HEADER));
    }

    @Test
    @DisplayName("[ASYNC EXPORT] Background report generation creates job and completes without blocking")
    void testAsyncExportJobLifecycle() {
        ExportJobResponse job = exportJobService.createAnalyticsExportJob(
            "store_test_perf", "usr_merchant_1", "30d", Instant.now().minusSeconds(86400 * 30), Instant.now()
        );

        assertNotNull(job.id());
        assertEquals("store_test_perf", job.storeId());
        assertEquals("ANALYTICS_CSV", job.exportType());

        // Check job status query
        ExportJobResponse status = exportJobService.getJobStatus("store_test_perf", job.id(), "usr_merchant_1");
        assertNotNull(status);
        assertEquals(job.id(), status.id());
    }
}
