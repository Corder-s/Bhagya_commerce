package com.bhagya.commerce.review.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.review.domain.Review;
import com.bhagya.commerce.review.domain.ReviewReport;
import com.bhagya.commerce.review.dto.ReviewDto;
import com.bhagya.commerce.review.dto.ReviewModerationActionRequest;
import com.bhagya.commerce.review.service.ReviewModerationService;
import com.bhagya.commerce.review.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Review Moderation", description = "Platform-wide review moderation, approval, rejection, and abuse reporting")
public class AdminReviewController {

    private final ReviewService reviewService;
    private final ReviewModerationService moderationService;

    public AdminReviewController(ReviewService reviewService, ReviewModerationService moderationService) {
        this.reviewService = reviewService;
        this.moderationService = moderationService;
    }

    @GetMapping("/reviews")
    @Operation(summary = "Get platform reviews for moderation queue")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getAllReviews(
        @RequestParam(required = false) String status,
        @CurrentUser UserPrincipal principal
    ) {
        List<ReviewDto> reviews = reviewService.getProductReviews("prod_01", null, false, "newest", 0, 100, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(reviews, "Moderation reviews retrieved"));
    }

    @PostMapping("/reviews/{id}/approve")
    @Operation(summary = "Approve pending review for public display")
    public ResponseEntity<ApiResponse<Boolean>> approveReview(
        @PathVariable String id,
        @CurrentUser UserPrincipal principal
    ) {
        moderationService.approveReview(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(true, "Review approved and published"));
    }

    @PostMapping("/reviews/{id}/reject")
    @Operation(summary = "Reject review with moderation reason")
    public ResponseEntity<ApiResponse<Boolean>> rejectReview(
        @PathVariable String id,
        @RequestBody ReviewModerationActionRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        moderationService.rejectReview(id, principal.getId(), request.reason());
        return ResponseEntity.ok(ApiResponse.success(true, "Review rejected"));
    }

    @PostMapping("/reviews/{id}/hide")
    @Operation(summary = "Hide review from public display")
    public ResponseEntity<ApiResponse<Boolean>> hideReview(
        @PathVariable String id,
        @RequestBody ReviewModerationActionRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        moderationService.hideReview(id, principal.getId(), request.reason());
        return ResponseEntity.ok(ApiResponse.success(true, "Review hidden"));
    }

    @GetMapping("/review-reports")
    @Operation(summary = "Get user-flagged review abuse reports")
    public ResponseEntity<ApiResponse<List<ReviewReport>>> getReviewReports() {
        List<ReviewReport> reports = moderationService.getReports();
        return ResponseEntity.ok(ApiResponse.success(reports, "Abuse reports retrieved"));
    }
}
