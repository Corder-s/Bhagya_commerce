"use client";

import { AlertTriangle, CheckCircle2, Flag } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import type { ReportReason } from "@/features/reviews/review-types";
import { reviewService } from "@/services/review.service";

const REPORT_REASONS: { id: ReportReason; label: string; desc: string }[] = [
  { id: "SPAM", label: "Spam or Advertising", desc: "Commercial promotion, repetitive content, or external links" },
  { id: "FAKE_CONTENT", label: "Fake or Fabricated Review", desc: "Reviewer did not receive item or review is disingenuous" },
  { id: "ABUSE", label: "Abusive or Inappropriate", desc: "Offensive language, profanity, or harassment" },
  { id: "OFF_TOPIC", label: "Off-Topic / Irrelevant", desc: "Does not describe the actual product craftsmanship or experience" },
  { id: "OTHER", label: "Other Policy Violation", desc: "Other issue requiring platform moderation inspection" },
];

export function ReportReviewModal({
  isOpen,
  onClose,
  reviewId,
}: {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string | null;
}) {
  const [selectedReason, setSelectedReason] = React.useState<ReportReason>("SPAM");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  if (!reviewId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reviewService.reportReview(reviewId, selectedReason, description);
      setIsSubmitted(true);
    } catch {
      // safe fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsSubmitted(false);
          onClose();
        }
      }}
    >
      <ModalContent
        title="Report Review to Moderation"
        description="Help Bhagya Commerce maintain authentic, genuine artisan product feedback"
        size="md"
      >
        {isSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-body-md text-ink">Thank you for reporting</h4>
              <p className="text-caption text-ink-soft">
                Our moderation team will inspect this review against platform content policies.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-caption font-semibold text-ink block">
                Why are you reporting this review?
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedReason === r.id
                        ? "border-[#E89535] bg-[#E89535]/5"
                        : "border-line bg-surface hover:bg-surface-subtle"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={() => setSelectedReason(r.id)}
                      className="mt-1 text-[#E89535] focus:ring-[#E89535]"
                    />
                    <div className="space-y-0.5">
                      <span className="text-caption font-bold text-ink block">{r.label}</span>
                      <span className="text-[11px] text-ink-soft block leading-tight">{r.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-ink block">
                Additional Details (Optional)
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context if necessary..."
                className="text-xs h-9"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
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
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
