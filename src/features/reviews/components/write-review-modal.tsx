"use client";

import { CheckCircle2, Image as ImageIcon, Plus, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import { StarRatingPicker } from "@/features/reviews/components/star-rating-picker";
import type { ProductReview } from "@/features/reviews/review-types";
import { reviewService } from "@/services/review.service";

export function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  onReviewSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle?: string;
  onReviewSubmitted: (newReview: ProductReview) => void;
}) {
  const [rating, setRating] = React.useState<number>(5);
  const [title, setTitle] = React.useState<string>("");
  const [comment, setComment] = React.useState<string>("");
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const resetForm = () => {
    setRating(5);
    setTitle("");
    setComment("");
    setPhotos([]);
    setErrorMsg(null);
    setIsSuccess(false);
  };

  const handlePhotoUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 3) {
      setErrorMsg("Maximum 3 photos permitted per product review.");
      return;
    }

    // Use verified artisan image preview for demonstration
    const samplePhotos = [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    ];

    const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
    setPhotos((prev) => [...prev, nextPhoto]);
    setErrorMsg(null);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (rating < 1 || rating > 5) {
      setErrorMsg("Please select a star rating between 1 and 5.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg("Please share at least a short sentence describing your experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await reviewService.submitReview({
        productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim(),
        mediaUrls: photos,
        authorName: "Priya Sharma",
        userId: "usr_dev_customer_01",
      });

      setIsSuccess(true);
      onReviewSubmitted(created);
    } catch {
      setErrorMsg("Unable to publish review. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <ModalContent
        title="Write a Verified Purchase Review"
        description={productTitle ? `Reviewing ${productTitle}` : "Share your authentic thoughts on craftsmanship and quality"}
        size="md"
      >
        {isSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-heading-sm font-bold text-ink">
                Review Published!
              </h3>
              <p className="text-caption text-ink-soft max-w-sm mx-auto">
                Thank you for supporting master artisans. Your verified feedback helps fellow connoisseurs discover genuine craft.
              </p>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-caption text-rose-700 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            {/* Overall Rating */}
            <div className="space-y-1.5">
              <label className="text-caption font-bold text-ink block">
                Overall Craftsmanship Rating <span className="text-rose-500">*</span>
              </label>
              <StarRatingPicker value={rating} onChange={setRating} size="lg" />
            </div>

            {/* Review Title */}
            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-ink block">
                Headline / Title (Optional)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Magnificent handloom texture & zari border"
                className="text-xs h-9"
              />
            </div>

            {/* Written Review Body */}
            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-ink block">
                Written Review <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe the fabric feel, unboxing, packaging authenticity, and artisanal details..."
                rows={4}
                required
                className="w-full text-xs p-3 rounded-xl border border-line bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#E89535] resize-none"
              />
            </div>

            {/* Optional Photo Upload */}
            <div className="space-y-2">
              <label className="text-caption font-semibold text-ink flex items-center justify-between">
                <span>Customer Photos (Optional, up to 3)</span>
                <span className="text-[11px] text-ink-soft">{photos.length}/3 photos</span>
              </label>

              <div className="flex items-center gap-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative size-16 rounded-xl border border-line overflow-hidden group">
                    <Image src={p} alt="Uploaded review photo" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}

                {photos.length < 3 && (
                  <label className="size-16 rounded-xl border-2 border-dashed border-line hover:border-[#E89535] bg-surface-subtle flex flex-col items-center justify-center cursor-pointer transition-colors text-ink-soft hover:text-[#E89535]">
                    <Plus className="size-5" />
                    <span className="text-[10px] font-semibold mt-0.5">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUploadSimulate}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
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
                {isSubmitting ? "Publishing..." : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
