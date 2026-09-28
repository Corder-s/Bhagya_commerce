package com.bhagya.commerce.review.repository;

import com.bhagya.commerce.review.domain.Review;
import com.bhagya.commerce.review.domain.ReviewHelpfulVote;
import com.bhagya.commerce.review.domain.ReviewMedia;
import com.bhagya.commerce.review.domain.ReviewModerationAudit;
import com.bhagya.commerce.review.domain.ReviewReport;
import com.bhagya.commerce.review.domain.ReviewResponse;
import com.bhagya.commerce.review.domain.ReviewStatus;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Repository;

@Repository
public class ReviewRepository {

    private final Map<String, Review> reviewStorage = new ConcurrentHashMap<>();
    private final Set<String> userOrderItemIndex = ConcurrentHashMap.newKeySet();
    private final Map<String, Set<String>> helpfulVotes = new ConcurrentHashMap<>();
    private final List<ReviewReport> reports = new CopyOnWriteArrayList<>();
    private final List<ReviewModerationAudit> audits = new CopyOnWriteArrayList<>();

    public ReviewRepository() {
        seedInitialReviews();
    }

    private void seedInitialReviews() {
        // Seed 1: Handloom Chanderi Silk Saree / Silk Throw
        Review r1 = new Review(
            "rev_silk_01",
            "prod_01",
            "usr_dev_customer_01",
            "Priya S.",
            5,
            "Breathtaking handloom texture and authentic drape",
            "The pure Chanderi silk is mesmerizing. The zari borders reflect authentic Varanasi master artisan craftsmanship. Arrived with an official handloom authenticity tag.",
            true
        );
        r1.setOrderId("ord_9812");
        r1.setOrderItemId("oi_1");
        r1.setStatus(ReviewStatus.PUBLISHED);
        r1.setHelpfulCount(18);
        r1.setCreatedAt(Instant.now().minus(14, ChronoUnit.DAYS));

        ReviewMedia m1 = new ReviewMedia("rm_1", r1.getId(), "reviews/prod_01/silk_texture.jpg", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80");
        r1.getMedia().add(m1);

        ReviewResponse resp1 = new ReviewResponse("rr_1", r1.getId(), "store_varanasi_silk", "usr_dev_merchant_01", "Varanasi Heritage Silks", "Thank you Priya! Our 4th-generation weavers take immense pride in every zari warp and weft.");
        resp1.setCreatedAt(Instant.now().minus(12, ChronoUnit.DAYS));
        r1.setMerchantResponse(resp1);
        save(r1);

        // Seed 2: Another review for prod_01
        Review r2 = new Review(
            "rev_silk_02",
            "prod_01",
            "usr_customer_02",
            "Aarav M.",
            5,
            "Delivered impeccably in sustainable packaging",
            "Loved the organic cotton muslin protective wrap. The fabric is light, breathable, and truly luxurious.",
            true
        );
        r2.setStatus(ReviewStatus.PUBLISHED);
        r2.setHelpfulCount(9);
        r2.setCreatedAt(Instant.now().minus(20, ChronoUnit.DAYS));
        save(r2);

        // Seed 3: 4-star review
        Review r3 = new Review(
            "rev_silk_03",
            "prod_01",
            "usr_customer_03",
            "Ananya R.",
            4,
            "Rich color, very slight delay in monsoon dispatch",
            "The saree is gorgeous and completely matches the catalog photography. Courier took an extra day due to rain, but customer support was very helpful.",
            true
        );
        r3.setStatus(ReviewStatus.PUBLISHED);
        r3.setHelpfulCount(4);
        r3.setCreatedAt(Instant.now().minus(5, ChronoUnit.DAYS));
        save(r3);
    }

    public Optional<Review> findById(String id) {
        return Optional.ofNullable(reviewStorage.get(id));
    }

    public List<Review> findByProductId(String productId) {
        return reviewStorage.values().stream()
            .filter(r -> r.getProductId().equals(productId) || productId.equals("prod_01") && r.getProductId().equals("prod_01"))
            .toList();
    }

    public List<Review> findByProductIdAndStatus(String productId, ReviewStatus status) {
        return reviewStorage.values().stream()
            .filter(r -> r.getProductId().equals(productId) && r.getStatus() == status)
            .toList();
    }

    public List<Review> findByUserId(String userId) {
        return reviewStorage.values().stream()
            .filter(r -> r.getUserId().equals(userId))
            .toList();
    }

    public Optional<Review> findByUserIdAndOrderItemId(String userId, String orderItemId) {
        return reviewStorage.values().stream()
            .filter(r -> r.getUserId().equals(userId) && orderItemId.equals(r.getOrderItemId()))
            .findFirst();
    }

    public List<Review> findAll() {
        return new ArrayList<>(reviewStorage.values());
    }

    public Review save(Review review) {
        if (review.getId() == null) {
            review.setId("rev_" + System.currentTimeMillis() + "_" + (int)(Math.random() * 1000));
        }
        reviewStorage.put(review.getId(), review);
        if (review.getUserId() != null && review.getOrderItemId() != null) {
            userOrderItemIndex.add(review.getUserId() + ":" + review.getOrderItemId());
        }
        return review;
    }

    public boolean hasReviewedItem(String userId, String orderItemId) {
        return userOrderItemIndex.contains(userId + ":" + orderItemId);
    }

    public boolean toggleHelpful(String reviewId, String userId) {
        Set<String> voters = helpfulVotes.computeIfAbsent(reviewId, k -> ConcurrentHashMap.newKeySet());
        Review review = reviewStorage.get(reviewId);
        if (review == null) return false;

        if (voters.contains(userId)) {
            voters.remove(userId);
            review.setHelpfulCount(Math.max(0, review.getHelpfulCount() - 1));
            return false; // Removed vote
        } else {
            voters.add(userId);
            review.setHelpfulCount(review.getHelpfulCount() + 1);
            return true; // Added vote
        }
    }

    public boolean hasUserVotedHelpful(String reviewId, String userId) {
        Set<String> voters = helpfulVotes.get(reviewId);
        return voters != null && voters.contains(userId);
    }

    public void saveReport(ReviewReport report) {
        if (report.getId() == null) {
            report.setId("rep_" + System.currentTimeMillis());
        }
        reports.add(report);
    }

    public List<ReviewReport> findAllReports() {
        return new ArrayList<>(reports);
    }

    public void saveAudit(ReviewModerationAudit audit) {
        if (audit.getId() == null) {
            audit.setId("aud_" + System.currentTimeMillis());
        }
        audits.add(audit);
    }

    public List<ReviewModerationAudit> findAllAudits() {
        return new ArrayList<>(audits);
    }
}
