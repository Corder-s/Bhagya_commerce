"use client";

import * as React from "react";
import { AlertCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { toast } from "@/lib/toast";

export interface CancelOrderModalProps {
  orderId: string;
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onCancelled: () => void;
}

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery date is too late",
  "Need to change shipping address",
  "Incorrect item or quantity selected",
  "Other reason",
];

export function CancelOrderModal({
  orderId,
  orderNumber,
  isOpen,
  onClose,
  onCancelled,
}: CancelOrderModalProps) {
  const [reason, setReason] = React.useState(CANCEL_REASONS[0]);
  const [comments, setComments] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  if (!isOpen) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullReason = comments.trim() ? `${reason} (${comments.trim()})` : reason;
      const res = await orderService.cancelOrder(orderId, fullReason);
      if (res.success) {
        toast.success("Order Cancelled", res.message);
        onCancelled();
        onClose();
      } else {
        toast.error("Cancellation Failed", res.message);
      }
    } catch {
      toast.error("Error", "Unable to cancel order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-danger">
            <AlertCircle className="size-5" />
            <h3 className="text-heading-md font-semibold text-ink">Cancel Order</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="text-body-sm text-ink-soft">
          This will request cancellation for order{" "}
          <strong className="text-ink font-mono">{orderNumber}</strong>. If payment was made online, a full refund will be initiated to your source account.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-caption font-medium text-ink">
              Reason for cancellation
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-body-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            >
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-medium text-ink">
              Additional notes (optional)
            </label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us more about your cancellation..."
              className="w-full rounded-xl border border-line bg-surface p-3 text-body-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Keep Order
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              loading={submitting}
              loadingLabel="Cancelling…"
              className="bg-danger text-white hover:bg-danger/90 border-transparent"
            >
              Confirm Cancellation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
