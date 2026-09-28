package com.bhagya.commerce.review.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.review.dto.CreateReviewRequest;
import com.bhagya.commerce.review.dto.ReviewDto;
import com.bhagya.commerce.review.dto.ReviewEligibilityDto;
import com.bhagya.commerce.review.dto.ReviewReportRequest;
import com.bhagya.commerce.review.dto.ReviewSummaryDto;
import com.bhagya.commerce.review.dto.ReviewUploadUrlRequest;
import com.bhagya.commerce.review.dto.ReviewUploadUrlResponse;
import com.bhagya.commerce.review.dto.UpdateReviewRequest;
import com.bhagya.commerce.review.service.RatingSummaryService;
import com.bhagya.commerce.review.service.ReviewEligibilityService;
import com.bhagya.commerce.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Reviews & Ratings", description = "Customer reviews, verified purchase ratings, helpful votes, and photo uploads")
public class ReviewController {

    private final ReviewService reviewService;
    private final RatingSummaryService ratingSummaryService;
    private final ReviewEligibilityService eligibilityService;

    public ReviewController(
        ReviewService reviewService,
        RatingSummaryService ratingSummaryService,
        ReviewEligibilityService eligibilityService
    ) {
        this.reviewService = reviewService;
        this.ratingSummaryService = ratingSummaryService;
        this.eligibilityService = eligibilityService;
    }

    @GetMapping("/products/{productId}/reviews")
    @Operation(summary = "Get published reviews for a product with pagination and sorting")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(
        @PathVariable String productId,
        @RequestParam(required = false) Integer rating,
        @RequestParam(defaultValue = "false") boolean withPhotosOnly,
        @RequestParam(defaultValue = "helpful") String sort,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @CurrentUser UserPrincipal principal
    ) {
        String userId = principal != null ? principal.getId() : null;
        List<ReviewDto> reviews = reviewService.getProductReviews(productId, rating, withPhotosOnly, sort, page, size, userId);
        return ResponseEntity.ok(ApiResponse.success(reviews, "Product reviews retrieved"));
    }

    @GetMapping("/products/{productId}/reviews/summary")
    @Operation(summary = "Get aggregated rating distribution and average")
    public ResponseEntity<ApiResponse<ReviewSummaryDto>> getRatingSummary(@PathVariable String productId) {
        ReviewSummaryDto summary = ratingSummaryService.getSummary(productId);
        return ResponseEntity.ok(ApiResponse.success(summary, "Rating summary retrieved"));
    }

    @GetMapping("/products/{productId}/reviews/eligibility")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check verified purchase review eligibility for customer")
    public ResponseEntity<ApiResponse<ReviewEligibilityDto>> checkEligibility(
        @PathVariable String productId,
        @CurrentUser UserPrincipal principal
    ) {
        ReviewEligibilityDto eligibility = eligibilityService.checkEligibility(productId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(eligibility, "Eligibility checked"));
    }

    @PostMapping("/products/{productId}/reviews")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit a verified purchase review")
    public ResponseEntity<ApiResponse<ReviewDto>> createReview(
        @PathVariable String productId,
        @RequestBody CreateReviewRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        ReviewDto review = reviewService.createReview(request, principal.getId(), principal.getName());
        return ResponseEntity.ok(ApiResponse.success(review, "Review submitted successfully"));
    }

    @GetMapping("/reviews/{reviewId}")
    @Operation(summary = "Get review by ID")
    public ResponseEntity<ApiResponse<ReviewDto>> getReviewById(
        @PathVariable String reviewId,
        @CurrentUser UserPrincipal principal
    ) {
        String userId = principal != null ? principal.getId() : null;
        ReviewDto review = reviewService.getReviewById(reviewId, userId);
        return ResponseEntity.ok(ApiResponse.success(review, "Review retrieved"));
    }

    @PatchMapping("/reviews/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Edit customer's own review")
    public ResponseEntity<ApiResponse<ReviewDto>> updateReview(
        @PathVariable String reviewId,
        @RequestBody UpdateReviewRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        ReviewDto review = reviewService.updateReview(reviewId, request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(review, "Review updated successfully"));
    }

    @DeleteMapping("/reviews/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete customer's own review")
    public ResponseEntity<ApiResponse<Boolean>> deleteReview(
        @PathVariable String reviewId,
        @CurrentUser UserPrincipal principal
    ) {
        reviewService.deleteReview(reviewId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(true, "Review deleted"));
    }

    @PostMapping("/reviews/{reviewId}/helpful")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Toggle helpful vote on a review")
    public ResponseEntity<ApiResponse<Boolean>> toggleHelpful(
        @PathVariable String reviewId,
        @CurrentUser UserPrincipal principal
    ) {
        boolean voted = reviewService.toggleHelpful(reviewId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(voted, voted ? "Helpful vote added" : "Helpful vote removed"));
    }

    @PostMapping("/reviews/{reviewId}/report")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Report an inappropriate or abusive review")
    public ResponseEntity<ApiResponse<Boolean>> reportReview(
        @PathVariable String reviewId,
        @RequestBody ReviewReportRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        reviewService.reportReview(reviewId, request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(true, "Review reported for moderation"));
    }

    @PostMapping("/review-media/upload-url")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Generate signed R2 upload URL for review photo")
    public ResponseEntity<ApiResponse<ReviewUploadUrlResponse>> getUploadUrl(
        @RequestBody ReviewUploadUrlRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        ReviewUploadUrlResponse res = reviewService.generateUploadUrl(request, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(res, "R2 upload URL generated"));
    }
}
