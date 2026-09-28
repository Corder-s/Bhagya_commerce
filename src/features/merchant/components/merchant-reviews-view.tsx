"use client";

import { Check, CheckCircle2, MessageSquare, Reply, Search, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MerchantReviewRespondModal } from "@/features/merchant/components/merchant-review-respond-modal";
import type { ProductReview } from "@/features/reviews/review-types";
import { reviewService } from "@/services/review.service";

export function MerchantReviewsView() {
  const [reviews, setReviews] = React.useState<ProductReview[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedReviewForReply, setSelectedReviewForReply] = React.useState<ProductReview | null>(null);

  const loadReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewService.getReviews({
        productId: "p_silk_throw",
        page: 0,
        size: 50,
      });
      setReviews(res.items);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Filter logic
  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === "unanswered") {
      if (r.merchantResponse) return false;
    } else if (selectedFilter === "5") {
      if (r.rating !== 5) return false;
    } else if (selectedFilter === "4") {
      if (r.rating !== 4) return false;
    } else if (selectedFilter === "critical") {
      if (r.rating > 3) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.authorDisplayName.toLowerCase().includes(q) ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReviews = reviews.length;
  const unansweredCount = reviews.filter((r) => !r.merchantResponse).length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : "0.0";
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-display text-display-sm font-bold text-ink">
          Customer Reviews & Feedback
        </h1>
        <p className="text-body-sm text-ink-soft mt-0.5">
          Monitor artisan product ratings, review customer impressions, and publish official merchant responses.
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <span className="text-caption text-ink-soft font-semibold">Store Rating</span>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-heading-md font-bold text-ink">{avgRating}</span>
              <Star className="size-4 fill-[#E89535] text-[#E89535]" />
            </div>
            <p className="text-[11px] text-ink-soft">Across published reviews</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <span className="text-caption text-ink-soft font-semibold">Total Reviews</span>
            <p className="font-display text-heading-md font-bold text-ink">{totalReviews}</p>
            <p className="text-[11px] text-ink-soft">Verified customer feedback</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <span className="text-caption text-ink-soft font-semibold">Unanswered</span>
            <p className="font-display text-heading-md font-bold text-[#E89535] dark:text-[#F0A349]">{unansweredCount}</p>
            <p className="text-[11px] text-[#D48024] dark:text-[#F0A349] font-medium">Awaiting merchant reply</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
          <CardContent className="p-3 space-y-1">
            <span className="text-caption text-ink-soft font-semibold">5-Star Ratio</span>
            <p className="font-display text-heading-md font-bold text-emerald-600 dark:text-emerald-400">
              {totalReviews > 0 ? Math.round((fiveStarCount / totalReviews) * 100) : 0}%
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Top craft satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card variant="surface" padding="sm" radius="xl" className="border-line shadow-card bg-surface">
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: `All (${totalReviews})` },
              { id: "unanswered", label: `Unanswered (${unansweredCount})` },
              { id: "5", label: "5 Stars" },
              { id: "4", label: "4 Stars" },
              { id: "critical", label: "3 Stars & Below" },
            ].map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedFilter === tab.id
                    ? "bg-[#E89535] text-[#241812] font-bold"
                    : "text-ink-soft hover:bg-surface-subtle hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-soft" />
            <Input
              placeholder="Search feedback or reviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reviews Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-subtle border border-line animate-pulse" />
          ))}
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card text-center py-10 bg-surface">
          <CardContent className="space-y-2">
            <MessageSquare className="size-8 text-ink-soft mx-auto" />
            <h4 className="text-body-sm font-semibold text-ink">No customer reviews found</h4>
            <p className="text-caption text-ink-soft">
              No reviews matching your selected criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} variant="surface" padding="md" radius="xl" className="border-line shadow-card bg-surface space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[#E89535]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-3.5 ${
                          s <= review.rating
                            ? "fill-[#E89535] text-[#E89535]"
                            : "fill-transparent text-[#DDD4C4] dark:text-stone-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-caption text-ink">{review.authorDisplayName}</span>
                  {review.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4F7A5D]/10 text-[#2D5E3A] dark:text-[#70A581] border border-[#4F7A5D]/20">
                      <Check className="size-2.5" />
                      Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ink-soft">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReviewForReply(review)}
                    className="text-xs h-7 px-2.5 text-ink gap-1"
                  >
                    <Reply className="size-3 text-[#E89535]" />
                    {review.merchantResponse ? "Edit Reply" : "Reply to Customer"}
                  </Button>
                </div>
              </div>

              {/* Review Body */}
              <div className="space-y-1">
                {review.title && <h5 className="font-bold text-body-sm text-ink">{review.title}</h5>}
                <p className="text-body-sm text-ink-soft leading-relaxed">{review.comment}</p>
              </div>

              {/* Photos if any */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {review.photos.map((photo, i) => (
                    <div key={i} className="relative size-12 rounded-lg border border-line overflow-hidden">
                      <Image src={photo.thumbnailUrl || photo.url} alt="Review attachment" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Merchant Response Display */}
              {review.merchantResponse && (
                <div className="p-3 rounded-xl bg-surface-subtle border border-line space-y-1 text-caption">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-[#E89535]" />
                      Store Reply ({review.merchantResponse.authorName})
                    </span>
                    <span className="text-[10px] text-ink-soft">
                      {new Date(review.merchantResponse.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-ink-soft text-[11px] leading-relaxed pl-5">
                    {review.merchantResponse.body}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Response Modal */}
      <MerchantReviewRespondModal
        isOpen={Boolean(selectedReviewForReply)}
        onClose={() => setSelectedReviewForReply(null)}
        review={selectedReviewForReply}
        onResponsePosted={(updated) => {
          setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          setSelectedReviewForReply(null);
        }}
      />
    </div>
  );
}
