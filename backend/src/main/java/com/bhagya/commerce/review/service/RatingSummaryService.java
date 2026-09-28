package com.bhagya.commerce.review.service;

import com.bhagya.commerce.review.domain.Review;
import com.bhagya.commerce.review.domain.ReviewStatus;
import com.bhagya.commerce.review.dto.ReviewSummaryDto;
import com.bhagya.commerce.review.repository.ReviewRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RatingSummaryService {

    private final ReviewRepository reviewRepository;

    public RatingSummaryService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public ReviewSummaryDto getSummary(String productId) {
        List<Review> published = reviewRepository.findByProductIdAndStatus(productId, ReviewStatus.PUBLISHED);

        if (published.isEmpty()) {
            Map<Integer, Integer> emptyDist = Map.of(5, 0, 4, 0, 3, 0, 2, 0, 1, 0);
            return new ReviewSummaryDto(productId, 0.0, 0, emptyDist, emptyDist);
        }

        int totalCount = published.size();
        int sum = 0;
        Map<Integer, Integer> dist = new HashMap<>();
        dist.put(5, 0);
        dist.put(4, 0);
        dist.put(3, 0);
        dist.put(2, 0);
        dist.put(1, 0);

        for (Review r : published) {
            int stars = Math.min(5, Math.max(1, r.getRating()));
            sum += stars;
            dist.put(stars, dist.getOrDefault(stars, 0) + 1);
        }

        double avg = Math.round(((double) sum / totalCount) * 10.0) / 10.0;

        Map<Integer, Integer> percentages = new HashMap<>();
        for (int s = 1; s <= 5; s++) {
            int count = dist.getOrDefault(s, 0);
            int pct = (int) Math.round(((double) count / totalCount) * 100.0);
            percentages.put(s, pct);
        }

        return new ReviewSummaryDto(productId, avg, totalCount, dist, percentages);
    }
}
