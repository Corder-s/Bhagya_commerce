package com.bhagya.commerce.analytics.controller;

import com.bhagya.commerce.analytics.dto.*;
import com.bhagya.commerce.analytics.service.AnalyticsAggregationService;
import com.bhagya.commerce.common.api.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Platform Admin Analytics", description = "Platform-wide analytics for authorized admins")
public class AdminAnalyticsController {

    private final AnalyticsAggregationService aggregationService;

    public AdminAnalyticsController(AnalyticsAggregationService aggregationService) {
        this.aggregationService = aggregationService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Get platform-wide analytics overview (Admin only)")
    public ResponseEntity<ApiResponse<AdminAnalyticsOverviewResponse>> getPlatformOverview(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end
    ) {
        AdminAnalyticsOverviewResponse overview = aggregationService.getAdminOverview(period, start, end);
        return ResponseEntity.ok(ApiResponse.success(overview, "Admin platform analytics retrieved"));
    }

    @GetMapping("/stores")
    @Operation(summary = "Get store performance rankings across platform")
    public ResponseEntity<ApiResponse<List<AdminStorePerformanceResponse>>> getStoreRankings(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end
    ) {
        AdminAnalyticsOverviewResponse overview = aggregationService.getAdminOverview(period, start, end);
        return ResponseEntity.ok(ApiResponse.success(overview.topStores(), "Store rankings retrieved"));
    }

    @GetMapping("/payments")
    @Operation(summary = "Get platform payment volume & refund metrics")
    public ResponseEntity<ApiResponse<AdminPaymentMetricsResponse>> getPaymentMetrics(
        @RequestParam(defaultValue = "30d") String period,
        @RequestParam(required = false) Instant start,
        @RequestParam(required = false) Instant end
    ) {
        AdminAnalyticsOverviewResponse overview = aggregationService.getAdminOverview(period, start, end);
        return ResponseEntity.ok(ApiResponse.success(overview.payments(), "Payment metrics retrieved"));
    }
}
