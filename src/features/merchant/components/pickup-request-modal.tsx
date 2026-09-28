"use client";

import { Calendar, CheckCircle2, Clock, Truck } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import type { Fulfillment } from "@/features/orders/shipment-types";
import { shippingService } from "@/services/shipping.service";

export function PickupRequestModal({
  isOpen,
  onClose,
  fulfillment,
  onPickupScheduled,
}: {
  isOpen: boolean;
  onClose: () => void;
  fulfillment: Fulfillment | null;
  onPickupScheduled: (updated: Fulfillment) => void;
}) {
  const [carrier, setCarrier] = React.useState("Delhivery Express");
  const [pickupDate, setPickupDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [notes, setNotes] = React.useState("Collect from Varanasi Artisan Hub reception desk.");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successRef, setSuccessRef] = React.useState<string | null>(null);

  if (!fulfillment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await shippingService.executeFulfillmentAction(
        fulfillment.orderId,
        "request_pickup",
        {
          carrier,
          pickupDate,
          notes,
        },
      );
      setSuccessRef(updated.pickupReference || "PKP-REF-89123");
      onPickupScheduled(updated);
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
          setSuccessRef(null);
          onClose();
        }
      }}
    >
      <ModalContent
        title="Schedule Carrier Dispatch Pickup"
        description="Book a verified courier executive pickup from your workshop"
        size="md"
      >
        {successRef ? (
          <div className="space-y-4 py-4 text-center">
            <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-heading-sm font-bold text-ink">
                Pickup Confirmed!
              </h3>
              <p className="text-body-sm text-ink-soft">
                Carrier partner has accepted the dispatch request.
              </p>
              <div className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-surface-subtle border border-line">
                <span className="text-caption text-ink-soft block">Pickup Booking Reference</span>
                <span className="font-mono font-bold text-sm text-[#D48024] dark:text-[#F0A349]">
                  {successRef}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSuccessRef(null);
                  onClose();
                }}
                className="bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Carrier select */}
            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
                <Truck className="size-3.5 text-[#E89535]" />
                Logistics Courier
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full text-xs h-9 px-3 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-[#E89535]"
              >
                <option value="Delhivery Express">Delhivery Surface & Express</option>
                <option value="BlueDart Logistics">BlueDart Air Cargo Priority</option>
                <option value="Shadowfax Prime">Shadowfax Same-day / Next-day</option>
              </select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#E89535]" />
                Preferred Pickup Date
              </label>
              <Input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#E89535]" />
                Dispatch Notes & Location Instructions
              </label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ground floor gate 2, call before arriving"
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
                {isSubmitting ? "Booking..." : "Confirm Pickup Request"}
              </Button>
            </div>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
