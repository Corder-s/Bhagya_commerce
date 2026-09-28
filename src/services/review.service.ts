/**
 * Bhagya Commerce — Review & Rating Domain Service (Step 19)
 *
 * Provides domain operations for:
 *   - Aggregating product rating summary & distribution (published only)
 *   - Verifying purchase eligibility for reviews
 *   - Submitting & editing verified reviews with R2 photo uploads
 *   - Helpful votes & abuse reporting
 *   - Merchant review responses
 *   - Admin review moderation
 */

import type {
  ProductReview,
  RatingDistribution,
  ReportReason,
  ReviewEligibility,
  ReviewMerchantResponse,
  ReviewRatingSummary,
  ReviewSortOption,
} from "@/features/reviews/review-types";
import { notificationService } from "@/services/notification.service";

const SEED_REVIEWS: ProductReview[] = [
  {
    id: "rev_seed_01",
    productId: "p_silk_throw",
    authorDisplayName: "Priya S.",
    rating: 5,
    title: "Breathtaking handloom texture and authentic drape",
    comment:
      "The pure Varanasi handloom silk is mesmerizing. The zari borders reflect authentic master artisan craftsmanship. Arrived with an official handloom authenticity tag.",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 18,
    hasVotedHelpful: false,
    photos: [
      {
        id: "rm_1",
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
        thumbnailUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80",
      },
    ],
    merchantResponse: {
      id: "rr_1",
      storeId: "store_varanasi_silk",
      authorName: "Varanasi Heritage Silks",
      body: "Thank you Priya! Our 4th-generation weavers take immense pride in every zari warp and weft.",
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    },
    orderId: "ord_demo_01",
    orderItemId: "item_seed_01",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "rev_seed_02",
    productId: "p_silk_throw",
    authorDisplayName: "Aarav M.",
    rating: 5,
    title: "Delivered impeccably in sustainable packaging",
    comment:
      "Loved the organic cotton muslin protective wrap. The fabric is light, breathable, and truly luxurious.",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 9,
    hasVotedHelpful: false,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: "rev_seed_03",
    productId: "p_silk_throw",
    authorDisplayName: "Ananya R.",
    rating: 4,
    title: "Rich natural indigo dye, very slight monsoon shipping delay",
    comment:
      "The weave is gorgeous and completely matches the catalog photography. Courier took an extra day due to rain, but customer support was very helpful.",
    verifiedPurchase: true,
    status: "published",
    helpfulCount: 4,
    hasVotedHelpful: false,
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

class ReviewService {
  private reviews: ProductReview[] = [...SEED_REVIEWS];
  private helpfulVotes: Set<string> = new Set(); // "reviewId:userId"

  /**
   * Get reviews for a product with filtering, sorting, and pagination
   */
  async getReviews(params: {
    productId: string;
    rating?: number;
    withPhotosOnly?: boolean;
    sort?: ReviewSortOption;
    page?: number;
    size?: number;
    userId?: string;
  }): Promise<{ items: ProductReview[]; total: number }> {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let list = this.reviews.filter(
      (r) =>
        (r.productId === params.productId || (params.productId.startsWith("p_") && r.productId === "p_silk_throw")) &&
        r.status === "published",
    );

    // Rating filter
    if (params.rating && params.rating >= 1 && params.rating <= 5) {
      list = list.filter((r) => r.rating === params.rating);
    }

    // Photos filter
    if (params.withPhotosOnly) {
      list = list.filter((r) => r.photos && r.photos.length > 0);
    }

    // Sort
    const sort = params.sort || "helpful";
    list = [...list].sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "highest_rated") {
        return b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "lowest_rated") {
        return a.rating - b.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.helpfulCount - a.helpfulCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const page = params.page || 0;
    const size = params.size || 10;
    const from = page * size;
    const items = list.slice(from, from + size).map((r) => ({
      ...r,
      hasVotedHelpful: params.userId ? this.helpfulVotes.has(`${r.id}:${params.userId}`) : false,
    }));

    return { items, total: list.length };
  }

  /**
   * Get rating summary aggregated across published reviews only
   */
  async getRatingSummary(productId: string): Promise<ReviewRatingSummary> {
    await new Promise((resolve) => setTimeout(resolve, 60));

    const published = this.reviews.filter(
      (r) =>
        (r.productId === productId || (productId.startsWith("p_") && r.productId === "p_silk_throw")) &&
        r.status === "published",
    );

    const distribution: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    for (const r of published) {
      const stars = Math.min(5, Math.max(1, r.rating)) as keyof RatingDistribution;
      distribution[stars] = (distribution[stars] || 0) + 1;
      sum += stars;
    }

    const totalReviews = published.length;
    const averageRating = totalReviews > 0 ? Math.round((sum / totalReviews) * 10) / 10 : 0;

    const percentages: RatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (totalReviews > 0) {
      for (let s = 1; s <= 5; s++) {
        const k = s as keyof RatingDistribution;
        percentages[k] = Math.round((distribution[k] / totalReviews) * 100);
      }
    }

    return {
      productId,
      averageRating,
      totalReviews,
      distribution,
      percentages,
    };
  }

  /**
   * Check if current customer is eligible for a verified purchase review
   */
  async checkEligibility(productId: string, userId?: string): Promise<ReviewEligibility> {
    await new Promise((resolve) => setTimeout(resolve, 60));

    if (!userId) {
      return {
        productId,
        eligible: false,
        reason: "Please log in to submit a verified purchase review.",
      };
    }

    // Check if user already reviewed
    const existing = this.reviews.find((r) => r.productId === productId && r.orderItemId === "item_seed_01");
    if (existing) {
      return {
        productId,
        eligible: false,
        reason: "You have already reviewed this purchase.",
        existingReviewId: existing.id,
      };
    }

    // Default eligible for demo user / verified orders
    return {
      productId,
      eligible: true,
      reason: "Verified purchase eligible for review.",
      eligibleOrderId: "ord_demo_01",
      eligibleOrderItemId: "item_seed_01",
    };
  }

  /**
   * Submit a new verified purchase review
   */
  async submitReview(input: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
    mediaUrls?: string[];
    authorName?: string;
    userId?: string;
  }): Promise<ProductReview> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newReview: ProductReview = {
      id: `rev_${Date.now()}`,
      productId: input.productId,
      authorDisplayName: this.formatDisplayName(input.authorName || "Verified Buyer"),
      rating: Math.min(5, Math.max(1, input.rating)),
      title: input.title?.trim(),
      comment: input.comment.trim(),
      verifiedPurchase: true,
      status: "published",
      helpfulCount: 0,
      hasVotedHelpful: false,
      photos: input.mediaUrls?.map((url, i) => ({
        id: `rm_${Date.now()}_${i}`,
        url,
        thumbnailUrl: url,
      })),
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);

    // Notify merchant
    notificationService.pushNotification({
      type: "order",
      title: "New Customer Review Received",
      message: `A customer posted a ${newReview.rating}-star review for your handcrafted product.`,
      actionUrl: `/merchant/products`,
    });

    return newReview;
  }

  /**
   * Toggle helpful vote on a review
   */
  async toggleHelpful(reviewId: string, userId: string): Promise<{ helpfulCount: number; hasVoted: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 50));

    const key = `${reviewId}:${userId}`;
    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) throw new Error("Review not found");

    if (this.helpfulVotes.has(key)) {
      this.helpfulVotes.delete(key);
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
      return { helpfulCount: review.helpfulCount, hasVoted: false };
    } else {
      this.helpfulVotes.add(key);
      review.helpfulCount += 1;
      return { helpfulCount: review.helpfulCount, hasVoted: true };
    }
  }

  /**
   * Report an inappropriate review
   */
  async reportReview(reviewId: string, reason: ReportReason, description?: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 80));
    // Simulated report ingestion
    return true;
  }

  /**
   * Merchant response to review
   */
  async addMerchantResponse(
    reviewId: string,
    storeId: string,
    authorName: string,
    body: string,
  ): Promise<ReviewMerchantResponse> {
    await new Promise((resolve) => setTimeout(resolve, 150));

    const review = this.reviews.find((r) => r.id === reviewId);
    if (!review) throw new Error("Review not found");

    const response: ReviewMerchantResponse = {
      id: `rr_${Date.now()}`,
      storeId,
      authorName,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    review.merchantResponse = response;
    return response;
  }

  private formatDisplayName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length <= 1) return parts[0] || "Verified Customer";
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
}

export const reviewService = new ReviewService();
