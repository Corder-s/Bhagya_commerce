"use client";

import * as React from "react";
import { RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { orderService } from "@/services/order.service";
import { toast } from "@/lib/toast";

export interface ReturnOrderModalProps {
  orderId: string;
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

const RETURN_REASONS = [
  "Item arrived damaged or defective",
  "Item does not match artisanal description",
  "Quality / sizing issue",
  "Received wrong product or variant",
  "Other issue",
];

export function ReturnOrderModal({
  orderId,
  orderNumber,
  isOpen,
  onClose,
  onSubmitted,
}: ReturnOrderModalProps) {
  const [reason, setReason] = React.useState(RETURN_REASONS[0]);
  const [comments, setComments] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  if (!isOpen) return null;

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await orderService.requestReturn(orderId, reason, comments);
      if (res.success) {
        toast.success("Return Request Submitted", res.message);
        onSubmitted();
        onClose();
      } else {
        toast.error("Request Failed", res.message);
      }
    } catch {
      toast.error("Error", "Unable to submit return request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gold-dark dark:text-gold">
            <RotateCcw className="size-5" />
            <h3 className="text-heading-md font-semibold text-ink">Request Return / Replacement</h3>
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
          Order <strong className="text-ink font-mono">{orderNumber}</strong>. Bhagya provides 7-day hassle-free returns with doorstep courier pickup for artisanal goods.
        </p>

        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-caption font-medium text-ink">
              Reason for return
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-body-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            >
              {RETURN_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-caption font-medium text-ink">
              Details for the artisan maker (optional)
            </label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Describe any defects or issues with the item received..."
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
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={submitting}
              loading={submitting}
              loadingLabel="Submitting…"
            >
              Submit Return Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
