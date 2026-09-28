package com.bhagya.commerce.analytics.controller;

import com.bhagya.commerce.analytics.dto.*;
import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.error.RateLimitException;
import com.bhagya.commerce.common.redis.RateLimitService;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.TenantSecurityService;
import com.bhagya.commerce.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/analytics")
@PreAuthorize("hasAnyRole('STORE_OWNER', 'STORE_ADMIN', 'PLATFORM_ADMIN')")
@Tag(name = "Merchant Analytics", description = "Authoritative analytics for merchant stores with strict tenant isolation")
public class MerchantAnalyticsController {

    private final AnalyticsAggregationService aggregationService;
    private final TenantSecurityService tenantSecurityService;
    private final RateLimitService rateLimitService;
    private final com.bhagya.commerce.export.service.ExportJobService exportJobService;

    public MerchantAnalyticsController(
        AnalyticsAggregationService aggregationService,
        TenantSecurityService tenantSecurityService,
        RateLimitService rateLimitService,
        @org.springframework.beans.factory.annotation.Autowired(required = false) com.bhagya.commerce.export.service.ExportJobService exportJobService
    ) {
        this.aggregationService = aggregationService;
        this.tenantSecurityService = tenantSecurityService;
        this.rateLimitService = rateLimitService;
        this.exportJobService = exportJobService;
    }

    private String resolveStoreId(UserPrincipal principal) {
        return tenantSecurityService.resolveAuthoritativeStoreId(principal, null);
    }

    @GetMapping("/overview")
    @Operation(summary = "Get full merchant analytics overview")
    public ResponseEntity<ApiResponse<MerchantAnalyticsOverviewResponse>> getOverview(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal);
        MerchantAnalyticsOverviewResponse overview = aggregationService.getMerchantOverview(storeId, period, start, end);
        return ResponseEntity.ok(ApiResponse.success(overview, "Merchant analytics overview retrieved"));
    }

    @GetMapping("/sales")
    @Operation(summary = "Get detailed sales metrics")
    public ResponseEntity<ApiResponse<SalesSummaryResponse>> getSales(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal);
        SalesSummaryResponse sales = aggregationService.calculateSalesSummary(storeId, period, start, end);
        return ResponseEntity.ok(ApiResponse.success(sales, "Sales summary retrieved"));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get order analytics & status breakdown")
    public ResponseEntity<ApiResponse<OrderSummaryResponse>> getOrders(
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal);
        OrderSummaryResponse orders = aggregationService.calculateOrderSummary(storeId, start, end);
        return ResponseEntity.ok(ApiResponse.success(orders, "Order analytics retrieved"));
    }

    @GetMapping("/products")
    @Operation(summary = "Get top performing products")
    public ResponseEntity<ApiResponse<List<ProductPerformanceResponse>>> getProducts(
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        int boundedLimit = Math.min(Math.max(limit, 1), 50);
        String storeId = resolveStoreId(principal);
        List<ProductPerformanceResponse> products = aggregationService.calculateProductPerformance(storeId, boundedLimit, start, end);
        return ResponseEntity.ok(ApiResponse.success(products, "Product performance retrieved"));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get customer retention and acquisition summary")
    public ResponseEntity<ApiResponse<CustomerSummaryResponse>> getCustomers(
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal);
        CustomerSummaryResponse customers = aggregationService.calculateCustomerSummary(storeId, start, end);
        return ResponseEntity.ok(ApiResponse.success(customers, "Customer analytics retrieved"));
    }

    @GetMapping("/funnel")
    @Operation(summary = "Get e-commerce conversion funnel breakdown")
    public ResponseEntity<ApiResponse<FunnelSummaryResponse>> getFunnel(
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal);
        FunnelSummaryResponse funnel = aggregationService.calculateFunnelSummary(storeId, start, end);
        return ResponseEntity.ok(ApiResponse.success(funnel, "Funnel analytics retrieved"));
    }

    @GetMapping("/retention")
    @Operation(summary = "Get customer repeat purchase and cohort retention")
    public ResponseEntity<ApiResponse<RetentionSummaryResponse>> getRetention(@CurrentUser UserPrincipal principal) {
        String storeId = resolveStoreId(principal);
        RetentionSummaryResponse retention = aggregationService.calculateRetention(storeId);
        return ResponseEntity.ok(ApiResponse.success(retention, "Retention metrics retrieved"));
    }

    @GetMapping("/export")
    @Operation(summary = "Export merchant analytics to CSV report with rate limiting")
    public ResponseEntity<byte[]> exportCsv(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        if (!rateLimitService.allowRequest("export_analytics:" + principal.getId(), 5, 60)) {
            throw new RateLimitException("Analytics export rate limit exceeded. Please wait a minute before requesting another export.");
        }

        String storeId = resolveStoreId(principal);
        String csv = aggregationService.exportMerchantAnalyticsCsv(storeId, period, start, end);
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"merchant_analytics_" + period + ".csv\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(bytes);
    }

    @PostMapping("/export-async")
    @Operation(summary = "Enqueue asynchronous background report generation to avoid HTTP thread blocking")
    public ResponseEntity<ApiResponse<com.bhagya.commerce.export.dto.ExportJobResponse>> exportAsync(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        @CurrentUser UserPrincipal principal
    ) {
        if (!rateLimitService.allowRequest("export_analytics:" + principal.getId(), 5, 60)) {
            throw new RateLimitException("Analytics export rate limit exceeded. Please wait a minute before requesting another export.");
        }

        String storeId = resolveStoreId(principal);
        if (exportJobService == null) {
            // Graceful fallback if export service not configured
            return ResponseEntity.status(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        com.bhagya.commerce.export.dto.ExportJobResponse job = exportJobService.createAnalyticsExportJob(
            storeId, principal.getId(), period, start, end
        );
        return ResponseEntity.status(org.springframework.http.HttpStatus.ACCEPTED)
            .body(ApiResponse.success(job, "Export job accepted for background processing"));
    }

    @GetMapping("/export-jobs/{jobId}")
    @Operation(summary = "Check asynchronous background export status")
    public ResponseEntity<ApiResponse<com.bhagya.commerce.export.dto.ExportJobResponse>> getExportJobStatus(
        @PathVariable String jobId,
        @CurrentUser UserPrincipal principal
    ) {
        String storeId = resolveStoreId(principal);
        if (exportJobService == null) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE).build();
        }

        com.bhagya.commerce.export.dto.ExportJobResponse job = exportJobService.getJobStatus(storeId, jobId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(job, "Export job status retrieved"));
    }
}
