"use client";

import { Check, CheckCircle2, Flag, MessageSquare, Star, ThumbsUp } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ReportReviewModal } from "@/features/reviews/components/report-review-modal";
import { ReviewPhotoLightbox } from "@/features/reviews/components/review-photo-lightbox";
import type { ProductReview } from "@/features/reviews/review-types";
import { reviewService } from "@/services/review.service";

export function ReviewCard({
  review,
  onReviewUpdated,
}: {
  review: ProductReview;
  onReviewUpdated?: (updated: ProductReview) => void;
}) {
  const [activePhoto, setActivePhoto] = React.useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [helpfulCount, setHelpfulCount] = React.useState(review.helpfulCount);
  const [hasVoted, setHasVoted] = React.useState(Boolean(review.hasVotedHelpful));
  const [voting, setVoting] = React.useState(false);

  const handleHelpfulClick = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const res = await reviewService.toggleHelpful(review.id, "usr_dev_customer_01");
      setHelpfulCount(res.helpfulCount);
      setHasVoted(res.hasVoted);
    } catch {
      // safe fallback
    } finally {
      setVoting(false);
    }
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 space-y-3.5 transition-shadow hover:shadow-card">
      {/* Header: Stars + Date */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[#E89535]">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`size-4 ${
                s <= review.rating
                  ? "fill-[#E89535] text-[#E89535]"
                  : "fill-transparent text-[#DDD4C4] dark:text-stone-600"
              }`}
            />
          ))}
          <span className="text-caption font-bold text-ink ml-1.5 tabular-nums">
            {review.rating}.0
          </span>
        </div>

        <span className="text-[11px] text-ink-soft">{formattedDate}</span>
      </div>

      {/* Review Title & Body */}
      <div className="space-y-1.5">
        {review.title && (
          <h4 className="font-bold text-ink text-body-sm leading-snug">
            {review.title}
          </h4>
        )}
        <p className="text-body-sm text-ink-soft leading-relaxed">
          {review.comment}
        </p>
      </div>

      {/* Review Photos Thumbnail Gallery */}
      {review.photos && review.photos.length > 0 && (
        <div className="flex items-center gap-2 pt-1">
          {review.photos.map((photo, i) => (
            <button
              type="button"
              key={photo.id || i}
              onClick={() => setActivePhoto(photo.url)}
              className="relative size-14 rounded-xl border border-line overflow-hidden hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#E89535] transition-opacity"
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={`Customer review photo ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Author & Verified Purchase Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-line/60">
        <div className="flex items-center gap-2">
          <span className="text-caption font-semibold text-ink">
            {review.authorDisplayName}
          </span>
          {review.verifiedPurchase && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#4F7A5D]/10 text-[#2D5E3A] dark:text-[#70A581] border border-[#4F7A5D]/20">
              <Check className="size-3" />
              Verified Purchase
            </span>
          )}
        </div>

        {/* Helpful vote & Report */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHelpfulClick}
            disabled={voting}
            className={`h-7 px-2 text-xs gap-1.5 rounded-lg border ${
              hasVoted
                ? "bg-[#E89535]/10 text-[#D48024] dark:text-[#F0A349] border-[#E89535]/30 font-semibold"
                : "text-ink-soft hover:text-ink border-transparent hover:border-line"
            }`}
          >
            <ThumbsUp className={`size-3 ${hasVoted ? "fill-current" : ""}`} />
            <span>Helpful ({helpfulCount})</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReportModalOpen(true)}
            className="h-7 px-2 text-xs text-ink-soft hover:text-rose-600 rounded-lg"
            title="Report this review"
          >
            <Flag className="size-3" />
          </Button>
        </div>
      </div>

      {/* Official Merchant Response Thread */}
      {review.merchantResponse && (
        <div className="mt-3 p-3 rounded-xl bg-surface-subtle border border-line space-y-1 text-caption">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <MessageSquare className="size-3.5 text-[#E89535]" />
            <span>Response from {review.merchantResponse.authorName}</span>
          </div>
          <p className="text-ink-soft leading-relaxed pl-5 text-[11px]">
            {review.merchantResponse.body}
          </p>
        </div>
      )}

      {/* Embedded Lightbox & Report Modals */}
      <ReviewPhotoLightbox
        isOpen={Boolean(activePhoto)}
        onClose={() => setActivePhoto(null)}
        photoUrl={activePhoto}
        authorName={review.authorDisplayName}
      />

      <ReportReviewModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        reviewId={review.id}
      />
    </div>
  );
}
