package com.bhagya.commerce.review.service;

import com.bhagya.commerce.common.error.BadRequestException;
import com.bhagya.commerce.common.error.ForbiddenException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.review.domain.Review;
import com.bhagya.commerce.review.domain.ReviewMedia;
import com.bhagya.commerce.review.domain.ReviewReport;
import com.bhagya.commerce.review.domain.ReviewResponse;
import com.bhagya.commerce.review.domain.ReviewStatus;
import com.bhagya.commerce.review.dto.CreateReviewRequest;
import com.bhagya.commerce.review.dto.ReviewDto;
import com.bhagya.commerce.review.dto.ReviewEligibilityDto;
import com.bhagya.commerce.review.dto.ReviewMediaDto;
import com.bhagya.commerce.review.dto.ReviewReportRequest;
import com.bhagya.commerce.review.dto.ReviewResponseDto;
import com.bhagya.commerce.review.dto.ReviewResponseRequest;
import com.bhagya.commerce.review.dto.ReviewUploadUrlRequest;
import com.bhagya.commerce.review.dto.ReviewUploadUrlResponse;
import com.bhagya.commerce.review.dto.UpdateReviewRequest;
import com.bhagya.commerce.review.repository.ReviewRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewEligibilityService eligibilityService;
    private final ReviewModerationService moderationService;

    public ReviewService(
        ReviewRepository reviewRepository,
        ReviewEligibilityService eligibilityService,
        ReviewModerationService moderationService
    ) {
        this.reviewRepository = reviewRepository;
        this.eligibilityService = eligibilityService;
        this.moderationService = moderationService;
    }

    public ReviewDto createReview(CreateReviewRequest request, String userId, String authorName) {
        if (request.rating() < 1 || request.rating() > 5) {
            throw new BadRequestException("Rating must be an integer between 1 and 5.");
        }
        if (request.comment() == null || request.comment().trim().length() < 5) {
            throw new BadRequestException("Review body must contain at least 5 characters.");
        }

        ReviewEligibilityDto eligibility = eligibilityService.checkEligibility(request.productId(), userId);
        if (!eligibility.eligible()) {
            throw new ForbiddenException(eligibility.reason());
        }

        // Sanitize display name (e.g. "Priya Sharma" -> "Priya S.")
        String sanitizedName = formatDisplayName(authorName);

        Review review = new Review(
            "rev_" + UUID.randomUUID().toString().substring(0, 8),
            request.productId(),
            userId,
            sanitizedName,
            request.rating(),
            request.title() != null ? request.title().trim() : null,
            request.comment().trim(),
            true // Verified purchase
        );

        review.setOrderId(request.orderId() != null ? request.orderId() : eligibility.eligibleOrderId());
        review.setOrderItemId(request.orderItemId() != null ? request.orderItemId() : eligibility.eligibleOrderItemId());

        // Attach photos if provided
        if (request.mediaUrls() != null && !request.mediaUrls().isEmpty()) {
            int sort = 0;
            for (String url : request.mediaUrls()) {
                if (url != null && !url.isBlank()) {
                    ReviewMedia media = new ReviewMedia(
                        "rm_" + UUID.randomUUID().toString().substring(0, 8),
                        review.getId(),
                        "reviews/" + review.getProductId() + "/" + UUID.randomUUID() + ".jpg",
                        url,
                        url
                    );
                    media.setSortOrder(sort++);
                    review.getMedia().add(media);
                }
            }
        }

        // Automatic content moderation check
        ReviewStatus initialStatus = moderationService.inspectReviewContent(review.getTitle(), review.getComment());
        review.setStatus(initialStatus);

        reviewRepository.save(review);
        return mapToDto(review, userId);
    }

    public ReviewDto updateReview(String reviewId, UpdateReviewRequest request, String userId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to edit this review.");
        }

        if (request.rating() < 1 || request.rating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5.");
        }

        review.setRating(request.rating());
        if (request.title() != null) review.setTitle(request.title().trim());
        if (request.comment() != null) review.setComment(request.comment().trim());

        // If updated, re-inspect for moderation
        ReviewStatus status = moderationService.inspectReviewContent(review.getTitle(), review.getComment());
        review.setStatus(status);

        reviewRepository.save(review);
        return mapToDto(review, userId);
    }

    public void deleteReview(String reviewId, String userId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        if (!review.getUserId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to delete this review.");
        }

        review.setStatus(ReviewStatus.DELETED);
        reviewRepository.save(review);
    }

    public List<ReviewDto> getProductReviews(
        String productId,
        Integer ratingFilter,
        boolean withPhotosOnly,
        String sort,
        int page,
        int size,
        String currentUserId
    ) {
        List<Review> list = new ArrayList<>(reviewRepository.findByProductIdAndStatus(productId, ReviewStatus.PUBLISHED));

        // Filter by rating if specified
        if (ratingFilter != null && ratingFilter >= 1 && ratingFilter <= 5) {
            list = list.stream().filter(r -> r.getRating() == ratingFilter).toList();
        }

        // Filter by photos
        if (withPhotosOnly) {
            list = list.stream().filter(r -> r.getMedia() != null && !r.getMedia().isEmpty()).toList();
        }

        // Sort
        Comparator<Review> comparator = switch (sort != null ? sort.toLowerCase() : "helpful") {
            case "newest" -> Comparator.comparing(Review::getCreatedAt).reversed();
            case "highest_rated", "highest" -> Comparator.comparing(Review::getRating).reversed().thenComparing(Review::getCreatedAt, Comparator.reverseOrder());
            case "lowest_rated", "lowest" -> Comparator.comparing(Review::getRating).thenComparing(Review::getCreatedAt, Comparator.reverseOrder());
            default -> Comparator.comparing(Review::getHelpfulCount).reversed().thenComparing(Review::getCreatedAt, Comparator.reverseOrder());
        };

        list = list.stream().sorted(comparator).toList();

        // Pagination
        int fromIndex = Math.min(page * size, list.size());
        int toIndex = Math.min(fromIndex + size, list.size());

        return list.subList(fromIndex, toIndex).stream()
            .map(r -> mapToDto(r, currentUserId))
            .toList();
    }

    public ReviewDto getReviewById(String reviewId, String currentUserId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
        return mapToDto(review, currentUserId);
    }

    public boolean toggleHelpful(String reviewId, String userId) {
        return reviewRepository.toggleHelpful(reviewId, userId);
    }

    public void reportReview(String reviewId, ReviewReportRequest request, String reporterUserId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        ReviewReport report = new ReviewReport(
            null,
            review.getId(),
            reporterUserId,
            request.reason() != null ? request.reason() : "OTHER",
            request.description()
        );
        reviewRepository.saveReport(report);
    }

    public ReviewResponseDto addMerchantResponse(String reviewId, ReviewResponseRequest request, String storeId, String merchantUserId, String authorName) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        if (request.body() == null || request.body().trim().isBlank()) {
            throw new BadRequestException("Response body cannot be empty.");
        }

        ReviewResponse response = new ReviewResponse(
            "rr_" + UUID.randomUUID().toString().substring(0, 8),
            reviewId,
            storeId,
            merchantUserId,
            authorName != null ? authorName : "Merchant Partner",
            request.body().trim()
        );

        review.setMerchantResponse(response);
        reviewRepository.save(review);

        return new ReviewResponseDto(
            response.getId(),
            response.getStoreId(),
            response.getAuthorName(),
            response.getBody(),
            response.getCreatedAt()
        );
    }

    public ReviewUploadUrlResponse generateUploadUrl(ReviewUploadUrlRequest request, String userId) {
        String ext = "jpg";
        if (request.contentType() != null && request.contentType().contains("png")) ext = "png";
        if (request.contentType() != null && request.contentType().contains("webp")) ext = "webp";

        String objectKey = "reviews/" + userId + "/" + UUID.randomUUID() + "." + ext;
        String simulatedPublicUrl = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80";

        return new ReviewUploadUrlResponse(
            "https://r2.bhagya.com/" + objectKey + "?signed=true",
            simulatedPublicUrl,
            simulatedPublicUrl,
            objectKey,
            "R2"
        );
    }

    private String formatDisplayName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "Verified Customer";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0];
        return parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
    }

    private ReviewDto mapToDto(Review r, String currentUserId) {
        List<ReviewMediaDto> photos = r.getMedia().stream()
            .map(m -> new ReviewMediaDto(m.getId(), m.getUrl(), m.getThumbnailUrl(), m.getMimeType(), m.getWidth(), m.getHeight()))
            .toList();

        ReviewResponseDto merchantDto = null;
        if (r.getMerchantResponse() != null) {
            ReviewResponse mr = r.getMerchantResponse();
            merchantDto = new ReviewResponseDto(mr.getId(), mr.getStoreId(), mr.getAuthorName(), mr.getBody(), mr.getCreatedAt());
        }

        boolean hasVoted = currentUserId != null && reviewRepository.hasUserVotedHelpful(r.getId(), currentUserId);

        return new ReviewDto(
            r.getId(),
            r.getProductId(),
            r.getAuthorDisplayName(),
            r.getRating(),
            r.getTitle(),
            r.getComment(),
            r.isVerifiedPurchase(),
            r.getStatus().name(),
            r.getHelpfulCount(),
            hasVoted,
            photos,
            merchantDto,
            r.getCreatedAt()
        );
    }
}
