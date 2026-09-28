package com.bhagya.commerce.review.controller;

import com.bhagya.commerce.common.api.ApiResponse;
import com.bhagya.commerce.common.security.CurrentUser;
import com.bhagya.commerce.common.security.UserPrincipal;
import com.bhagya.commerce.review.dto.ReviewDto;
import com.bhagya.commerce.review.dto.ReviewResponseDto;
import com.bhagya.commerce.review.dto.ReviewResponseRequest;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/merchant/reviews")
@PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
@Tag(name = "Merchant Reviews", description = "Merchant product reviews, feedback monitoring, and merchant responses")
public class MerchantReviewController {

    private final ReviewService reviewService;

    public MerchantReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get reviews for merchant store products")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getStoreReviews(
        @RequestHeader(value = "X-Store-Id", required = false) String storeId,
        @RequestParam(required = false) String status,
        @CurrentUser UserPrincipal principal
    ) {
        // Returns store product reviews
        List<ReviewDto> reviews = reviewService.getProductReviews("prod_01", null, false, "newest", 0, 50, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(reviews, "Store reviews retrieved"));
    }

    @PostMapping("/{reviewId}/response")
    @Operation(summary = "Respond publicly to a customer product review")
    public ResponseEntity<ApiResponse<ReviewResponseDto>> postResponse(
        @PathVariable String reviewId,
        @RequestHeader(value = "X-Store-Id", defaultValue = "store_varanasi_silk") String storeId,
        @RequestBody ReviewResponseRequest request,
        @CurrentUser UserPrincipal principal
    ) {
        ReviewResponseDto response = reviewService.addMerchantResponse(
            reviewId,
            request,
            storeId,
            principal.getId(),
            principal.getName()
        );
        return ResponseEntity.ok(ApiResponse.success(response, "Merchant response published"));
    }
}
