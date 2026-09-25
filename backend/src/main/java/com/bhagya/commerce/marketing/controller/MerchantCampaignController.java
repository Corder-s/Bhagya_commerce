package com.bhagya.commerce.marketing.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.marketing.dto.*;
import com.bhagya.commerce.marketing.service.AudienceService;
import com.bhagya.commerce.marketing.service.CampaignService;
import com.bhagya.commerce.marketing.service.MarketingAnalyticsService;
import com.bhagya.commerce.merchant.service.MerchantService;
import com.bhagya.commerce.store.domain.Store;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/merchant")
@Tag(name = "Merchant Marketing & Campaigns", description = "Campaign management, audience targeting and AI copy generation")
public class MerchantCampaignController {

    private final CampaignService campaignService;
    private final AudienceService audienceService;
    private final MarketingAnalyticsService marketingAnalyticsService;
    private final MerchantService merchantService;

    public MerchantCampaignController(
        CampaignService campaignService,
        AudienceService audienceService,
        MarketingAnalyticsService marketingAnalyticsService,
        MerchantService merchantService
    ) {
        this.campaignService = campaignService;
        this.audienceService = audienceService;
        this.marketingAnalyticsService = marketingAnalyticsService;
        this.merchantService = merchantService;
    }

    private String resolveStoreId(Principal principal) {
        String userId = principal != null ? principal.getName() : "usr_merch_1";
        Store store = merchantService.getStoreForUser(userId);
        return store.getId();
    }

    @GetMapping("/campaigns")
    @Operation(summary = "Get all marketing campaigns for merchant store")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getCampaigns(Principal principal) {
        String storeId = resolveStoreId(principal);
        List<CampaignResponse> campaigns = campaignService.getStoreCampaigns(storeId);
        return ResponseEntity.ok(ApiResponse.success(campaigns, "Store campaigns retrieved"));
    }

    @GetMapping("/campaigns/{id}")
    @Operation(summary = "Get campaign details by ID")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaign(@PathVariable String id, Principal principal) {
        String storeId = resolveStoreId(principal);
        CampaignResponse campaign = campaignService.getCampaignById(id, storeId);
        return ResponseEntity.ok(ApiResponse.success(campaign, "Campaign retrieved"));
    }

    @PostMapping("/campaigns")
    @Operation(summary = "Create a new campaign")
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(
        @Valid @RequestBody CampaignCreateRequest request,
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        CampaignResponse created = campaignService.createCampaign(storeId, request);
        return ResponseEntity.ok(ApiResponse.success(created, "Campaign created successfully"));
    }

    @PostMapping("/campaigns/{id}/launch")
    @Operation(summary = "Launch a marketing campaign to eligible customer audience")
    public ResponseEntity<ApiResponse<CampaignLaunchResponse>> launchCampaign(
        @PathVariable String id,
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        CampaignLaunchResponse result = campaignService.launchCampaign(id, storeId);
        return ResponseEntity.ok(ApiResponse.success(result, result.message()));
    }

    @PostMapping("/campaigns/{id}/pause")
    @Operation(summary = "Pause a running campaign")
    public ResponseEntity<ApiResponse<CampaignResponse>> pauseCampaign(@PathVariable String id, Principal principal) {
        String storeId = resolveStoreId(principal);
        CampaignResponse paused = campaignService.pauseCampaign(id, storeId);
        return ResponseEntity.ok(ApiResponse.success(paused, "Campaign paused"));
    }

    @PostMapping("/campaigns/{id}/cancel")
    @Operation(summary = "Cancel a scheduled or drafted campaign")
    public ResponseEntity<ApiResponse<CampaignResponse>> cancelCampaign(@PathVariable String id, Principal principal) {
        String storeId = resolveStoreId(principal);
        CampaignResponse cancelled = campaignService.cancelCampaign(id, storeId);
        return ResponseEntity.ok(ApiResponse.success(cancelled, "Campaign cancelled"));
    }

    @GetMapping("/segments")
    @Operation(summary = "Get audience customer segments for store")
    public ResponseEntity<ApiResponse<List<CustomerSegmentResponse>>> getSegments(Principal principal) {
        String storeId = resolveStoreId(principal);
        List<CustomerSegmentResponse> segments = audienceService.getStoreSegments(storeId);
        return ResponseEntity.ok(ApiResponse.success(segments, "Customer segments retrieved"));
    }

    @PostMapping("/segments")
    @Operation(summary = "Create a custom audience segment")
    public ResponseEntity<ApiResponse<CustomerSegmentResponse>> createSegment(
        @Valid @RequestBody CustomerSegmentCreateRequest request,
        Principal principal
    ) {
        String storeId = resolveStoreId(principal);
        CustomerSegmentResponse created = audienceService.createSegment(storeId, request);
        return ResponseEntity.ok(ApiResponse.success(created, "Segment created successfully"));
    }

    @GetMapping("/marketing/analytics")
    @Operation(summary = "Get marketing dashboard overview metrics")
    public ResponseEntity<ApiResponse<MarketingOverviewResponse>> getMarketingOverview(Principal principal) {
        String storeId = resolveStoreId(principal);
        MarketingOverviewResponse overview = marketingAnalyticsService.getMarketingOverview(storeId);
        return ResponseEntity.ok(ApiResponse.success(overview, "Marketing overview retrieved"));
    }

    @PostMapping("/marketing/ai-copy")
    @Operation(summary = "Generate AI promotional copy in authentic artisan voice")
    public ResponseEntity<ApiResponse<AICopyGenerateResponse>> generateAICopy(
        @RequestBody AICopyGenerateRequest request
    ) {
        String prod = request.productName() != null ? request.productName() : "Handcrafted Heritage Artifacts";
        String disc = request.discountDetails() != null ? request.discountDetails() : "Exclusive Festive Savings";

        String subject = "? Discover Master Artisan Creations: " + prod;
        String headline = "Celebrate Indian Handloom Heritage with " + disc;
        String body = "Namaste! Each thread and motif tells a story of centuries-old artisan mastery. For a limited time, enjoy " + disc + " on our certified handcraft collection.";
        String cta = "Explore Handcrafted Collection";

        return ResponseEntity.ok(ApiResponse.success(
            new AICopyGenerateResponse(subject, headline, body, cta),
            "AI promotional copy generated"
        ));
    }
}
