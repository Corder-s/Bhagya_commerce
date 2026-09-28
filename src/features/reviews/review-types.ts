/**
 * Bhagya Commerce — Reviews, Ratings, Verified Purchase & Moderation Types (Step 19)
 */

export type ReviewStatus =
  | "pending"
  | "published"
  | "rejected"
  | "hidden"
  | "deleted";

export interface ReviewMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface ReviewMerchantResponse {
  id: string;
  storeId: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorDisplayName: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  hasVotedHelpful?: boolean;
  photos?: ReviewMedia[];
  merchantResponse?: ReviewMerchantResponse;
  orderId?: string;
  orderItemId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewRatingSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
  percentages: RatingDistribution;
}

export interface ReviewEligibility {
  productId: string;
  eligible: boolean;
  reason: string;
  eligibleOrderId?: string;
  eligibleOrderItemId?: string;
  existingReviewId?: string;
}

export type ReviewSortOption =
  | "helpful"
  | "newest"
  | "highest_rated"
  | "lowest_rated";

export type ReportReason =
  | "SPAM"
  | "ABUSE"
  | "HARASSMENT"
  | "FAKE_CONTENT"
  | "OFF_TOPIC"
  | "OTHER";

export interface ReviewReport {
  id: string;
  reviewId: string;
  reporterUserId: string;
  reason: ReportReason;
  description?: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}
