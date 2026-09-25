package com.bhagya.commerce.analytics.controller;

import com.bhagya.commerce.analytics.dto.*;
import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.store.domain.Store;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant/analytics")
@Tag(name = "Merchant Analytics", description = "Authoritative analytics for merchant stores")
public class MerchantAnalyticsController {

    private final AnalyticsAggregationService aggregationService;
    private final MerchantService merchantService;

    public MerchantAnalyticsController(
        AnalyticsAggregationService aggregationService,
        MerchantService merchantService
    ) {
        this.aggregationService = aggregationService;
        this.merchantService = merchantService;
    }

    private String resolveStoreId(Principal principal) {
        String userId = principal != null ? principal.getName() : "usr_merch_1";
        Store store = merchantService.getStoreForUser(userId);
        return store.getId();
    }

    @GetMapping("/overview")
    @Operation(summary = "Get full merchant analytics overview")
    public ResponseEntity<ApiResponse<MerchantAnalyticsOverviewResponse>> getOverview(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        Principal principal
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
        Principal principal
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
        Principal principal
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
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        List<ProductPerformanceResponse> products = aggregationService.calculateProductPerformance(storeId, limit, start, end);
        return ResponseEntity.ok(ApiResponse.success(products, "Product performance retrieved"));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get customer retention and acquisition summary")
    public ResponseEntity<ApiResponse<CustomerSummaryResponse>> getCustomers(
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        Principal principal
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
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        FunnelSummaryResponse funnel = aggregationService.calculateFunnelSummary(storeId, start, end);
        return ResponseEntity.ok(ApiResponse.success(funnel, "Funnel analytics retrieved"));
    }

    @GetMapping("/retention")
    @Operation(summary = "Get customer repeat purchase and cohort retention")
    public ResponseEntity<ApiResponse<RetentionSummaryResponse>> getRetention(Principal principal) {
        String storeId = resolveStoreId(principal);
        RetentionSummaryResponse retention = aggregationService.calculateRetention(storeId);
        return ResponseEntity.ok(ApiResponse.success(retention, "Retention metrics retrieved"));
    }

    @GetMapping("/export")
    @Operation(summary = "Export merchant analytics to CSV report")
    public ResponseEntity<byte[]> exportCsv(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end,
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        String csv = aggregationService.exportMerchantAnalyticsCsv(storeId, period, start, end);
        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"merchant_analytics_" + period + ".csv\"")
            .contentType(MediaType.parseMediaType("text/csv"))
            .body(bytes);
    }
}
