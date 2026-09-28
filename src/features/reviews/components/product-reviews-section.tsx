"use client";

import { CheckCircle2, ChevronDown, Filter, MessageSquarePlus, Star } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/features/reviews/components/review-card";
import { WriteReviewModal } from "@/features/reviews/components/write-review-modal";
import type {
  ProductReview,
  ReviewEligibility,
  ReviewRatingSummary,
  ReviewSortOption,
} from "@/features/reviews/review-types";
import { reviewService } from "@/services/review.service";

export function ProductReviewsSection({
  productId,
  productTitle,
}: {
  productId: string;
  productTitle: string;
}) {
  const [summary, setSummary] = React.useState<ReviewRatingSummary | null>(null);
  const [reviews, setReviews] = React.useState<ProductReview[]>([]);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [selectedRating, setSelectedRating] = React.useState<number | undefined>(undefined);
  const [withPhotosOnly, setWithPhotosOnly] = React.useState<boolean>(false);
  const [sortOption, setSortOption] = React.useState<ReviewSortOption>("helpful");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [eligibility, setEligibility] = React.useState<ReviewEligibility | null>(null);
  const [writeModalOpen, setWriteModalOpen] = React.useState<boolean>(false);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [sum, res, elig] = await Promise.all([
        reviewService.getRatingSummary(productId),
        reviewService.getReviews({
          productId,
          rating: selectedRating,
          withPhotosOnly,
          sort: sortOption,
          page: 0,
          size: 20,
          userId: "usr_dev_customer_01",
        }),
        reviewService.checkEligibility(productId, "usr_dev_customer_01"),
      ]);
      setSummary(sum);
      setReviews(res.items);
      setTotalCount(res.total);
      setEligibility(elig);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, [productId, selectedRating, withPhotosOnly, sortOption]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReviewSubmitted = (newReview: ProductReview) => {
    setReviews((prev) => [newReview, ...prev]);
    reviewService.getRatingSummary(productId).then(setSummary);
  };

  const avgRating = summary ? summary.averageRating : 4.8;
  const totalReviews = summary ? summary.totalReviews : reviews.length;

  return (
    <div className="space-y-8">
      {/* ── 1. Hero Rating Summary & Distribution ─────────────────────── */}
      <div className="grid sm:grid-cols-[15rem_1fr] gap-8 items-center rounded-2xl border border-line bg-surface p-6 shadow-card">
        {/* Left: Big Average */}
        <div className="text-center sm:text-left space-y-2">
          <p className="text-display-lg font-bold text-ink leading-none tabular-nums">
            {avgRating.toFixed(1)}
          </p>
          <div className="flex justify-center sm:justify-start gap-1 text-[#E89535]">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`size-4.5 ${
                  s <= Math.round(avgRating)
                    ? "fill-[#E89535] text-[#E89535]"
                    : "fill-transparent text-[#DDD4C4] dark:text-stone-600"
                }`}
              />
            ))}
          </div>
          <p className="text-caption text-ink-soft">
            Based on <strong className="text-ink font-semibold">{totalReviews}</strong> verified reviews
          </p>

          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setWriteModalOpen(true)}
              className="text-xs h-8 bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold gap-1.5"
            >
              <MessageSquarePlus className="size-3.5" />
              Write a Review
            </Button>
          </div>
        </div>

        {/* Right: Interactive 5-Star Distribution Bars */}
        <div className="space-y-2 text-caption">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = summary?.distribution[stars as keyof typeof summary.distribution] || 0;
            const pct = summary?.percentages[stars as keyof typeof summary.percentages] || 0;
            const isFilterActive = selectedRating === stars;

            return (
              <button
                type="button"
                key={stars}
                onClick={() => setSelectedRating(isFilterActive ? undefined : stars)}
                className={`w-full flex items-center gap-3 p-1 rounded-lg transition-colors text-left ${
                  isFilterActive ? "bg-[#E89535]/10 font-bold" : "hover:bg-surface-subtle"
                }`}
              >
                <span className="w-8 text-ink font-semibold tabular-nums text-xs">
                  {stars} ★
                </span>
                <div className="h-2.5 flex-1 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#E89535] to-[#F0A349] transition-all duration-300 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-ink-soft tabular-nums text-[11px]">
                  {count} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Filters & Sort Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 rounded-xl bg-surface border border-line">
        {/* Rating Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedRating(undefined)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedRating === undefined && !withPhotosOnly
                ? "bg-[#E89535] text-[#241812] font-bold"
                : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
            }`}
          >
            All Reviews ({totalReviews})
          </button>

          {[5, 4, 3, 2, 1].map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSelectedRating(selectedRating === s ? undefined : s)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedRating === s
                  ? "bg-[#E89535] text-[#241812] font-bold"
                  : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
              }`}
            >
              {s} ★
            </button>
          ))}

          <button
            type="button"
            onClick={() => setWithPhotosOnly((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              withPhotosOnly
                ? "bg-[#E89535] text-[#241812] font-bold"
                : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
            }`}
          >
            With Photos
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-caption text-ink-soft whitespace-nowrap">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as ReviewSortOption)}
            className="text-xs h-8 px-2.5 rounded-lg border border-line bg-surface text-ink font-semibold focus:outline-none focus:ring-1 focus:ring-[#E89535]"
          >
            <option value="helpful">Most Helpful</option>
            <option value="newest">Newest First</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="lowest_rated">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* ── 3. Reviews List or Empty State ────────────────────────────── */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-surface-subtle border border-line animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-line bg-surface p-6 space-y-3">
          <Star className="size-8 text-[#DDD4C4] mx-auto" />
          <h4 className="text-body-sm font-semibold text-ink">No reviews found matching your filter</h4>
          <p className="text-caption text-ink-soft">
            Try selecting &ldquo;All Reviews&rdquo; or be the first to share your thoughts on this handcrafted creation.
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedRating(undefined);
                setWithPhotosOnly(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReviewUpdated={(updated) => {
                setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
              }}
            />
          ))}
        </div>
      )}

      {/* ── 4. Write Review Modal ──────────────────────────────────────── */}
      <WriteReviewModal
        isOpen={writeModalOpen}
        onClose={() => setWriteModalOpen(false)}
        productId={productId}
        productTitle={productTitle}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
