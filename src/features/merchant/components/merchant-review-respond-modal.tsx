"use client";

import { CheckCircle2, MessageSquare, Send } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";
import type { ProductReview } from "@/features/reviews/review-types";
import { reviewService } from "@/services/review.service";

export function MerchantReviewRespondModal({
  isOpen,
  onClose,
  review,
  onResponsePosted,
}: {
  isOpen: boolean;
  onClose: () => void;
  review: ProductReview | null;
  onResponsePosted: (updated: ProductReview) => void;
}) {
  const [responseBody, setResponseBody] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (review?.merchantResponse) {
      setResponseBody(review.merchantResponse.body);
    } else {
      setResponseBody("");
    }
    setErrorMsg(null);
  }, [review]);

  if (!review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseBody.trim()) {
      setErrorMsg("Please enter a response message for the customer.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const resp = await reviewService.addMerchantResponse(
        review.id,
        "store_varanasi_silk",
        "Varanasi Heritage Silks",
        responseBody.trim(),
      );

      const updatedReview: ProductReview = {
        ...review,
        merchantResponse: resp,
      };

      onResponsePosted(updatedReview);
      onClose();
    } catch {
      setErrorMsg("Failed to post response. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title="Public Merchant Response"
        description={`Respond officially to ${review.authorDisplayName}'s ${review.rating}-star review`}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-caption text-rose-700 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* Original Customer Review Snippet */}
          <div className="p-3.5 rounded-xl bg-surface-subtle border border-line space-y-1 text-caption">
            <div className="flex items-center justify-between text-ink font-semibold">
              <span>{review.authorDisplayName} ({review.rating} ★)</span>
              <span className="text-[11px] text-ink-soft">
                {new Date(review.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            {review.title && <p className="font-bold text-ink">{review.title}</p>}
            <p className="text-ink-soft text-[11px] leading-relaxed line-clamp-2">
              &ldquo;{review.comment}&rdquo;
            </p>
          </div>

          {/* Merchant Response Field */}
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-[#E89535]" />
              Official Store Reply (Public)
            </label>
            <textarea
              value={responseBody}
              onChange={(e) => setResponseBody(e.target.value)}
              placeholder="Thank the customer or address their feedback regarding weave, texture, or shipping..."
              rows={4}
              required
              className="w-full text-xs p-3 rounded-xl border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#E89535] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting}
              className="bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold"
            >
              <Send className="size-3.5" />
              {isSubmitting ? "Posting..." : "Publish Response"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
