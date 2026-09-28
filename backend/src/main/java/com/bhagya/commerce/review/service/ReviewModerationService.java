package com.bhagya.commerce.review.service;

import com.bhagya.commerce.common.error.BadRequestException;
import com.bhagya.commerce.common.error.ResourceNotFoundException;
import com.bhagya.commerce.review.domain.Review;
import com.bhagya.commerce.review.domain.ReviewModerationAudit;
import com.bhagya.commerce.review.domain.ReviewReport;
import com.bhagya.commerce.review.domain.ReviewStatus;
import com.bhagya.commerce.review.repository.ReviewRepository;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class ReviewModerationService {

    private final ReviewRepository reviewRepository;
    private static final Set<String> SPAM_KEYWORDS = Set.of("crypto", "free money", "whatsapp me at", "telegram", "viagra", "cheap replica");

    public ReviewModerationService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public ReviewStatus inspectReviewContent(String title, String body) {
        if (title == null && body == null) {
            return ReviewStatus.PUBLISHED;
        }

        String text = ((title != null ? title : "") + " " + (body != null ? body : "")).toLowerCase();

        for (String spam : SPAM_KEYWORDS) {
            if (text.contains(spam)) {
                return ReviewStatus.PENDING; // Needs human admin moderation
            }
        }

        return ReviewStatus.PUBLISHED;
    }

    public Review approveReview(String reviewId, String adminUserId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        review.setStatus(ReviewStatus.PUBLISHED);
        reviewRepository.save(review);

        reviewRepository.saveAudit(new ReviewModerationAudit(
            null,
            reviewId,
            adminUserId,
            "APPROVED",
            "Approved by platform administrator."
        ));

        return review;
    }

    public Review rejectReview(String reviewId, String adminUserId, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new BadRequestException("A moderation reason is required to reject a review.");
        }

        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        review.setStatus(ReviewStatus.REJECTED);
        review.setRejectionReason(reason);
        reviewRepository.save(review);

        reviewRepository.saveAudit(new ReviewModerationAudit(
            null,
            reviewId,
            adminUserId,
            "REJECTED",
            reason
        ));

        return review;
    }

    public Review hideReview(String reviewId, String adminUserId, String reason) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));

        review.setStatus(ReviewStatus.HIDDEN);
        review.setRejectionReason(reason);
        reviewRepository.save(review);

        reviewRepository.saveAudit(new ReviewModerationAudit(
            null,
            reviewId,
            adminUserId,
            "HIDDEN",
            reason != null ? reason : "Hidden by moderator"
        ));

        return review;
    }

    public List<ReviewReport> getReports() {
        return reviewRepository.findAllReports();
    }

    public List<ReviewModerationAudit> getAudits() {
        return reviewRepository.findAllAudits();
    }
}
