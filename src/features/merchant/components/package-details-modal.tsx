"use client";

import { CheckCircle2, Box, Scale, Ruler } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent } from "@/components/ui/modal";
import type { Fulfillment } from "@/features/orders/shipment-types";
import { shippingService } from "@/services/shipping.service";

export function PackageDetailsModal({
  isOpen,
  onClose,
  fulfillment,
  onPackageUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  fulfillment: Fulfillment | null;
  onPackageUpdated: (updated: Fulfillment) => void;
}) {
  const [weightKg, setWeightKg] = React.useState(0.85);
  const [dimensions, setDimensions] = React.useState("28x22x10 cm");
  const [notes, setNotes] = React.useState("Enclosed with authenticity card & organic cotton muslin dust bag.");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (fulfillment) {
      setWeightKg(fulfillment.packageWeightKg || 0.85);
      setDimensions(fulfillment.packageDimensions || "28x22x10 cm");
      setNotes(fulfillment.notes || "Enclosed with authenticity card & organic cotton muslin dust bag.");
    }
  }, [fulfillment]);

  if (!fulfillment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updated = await shippingService.executeFulfillmentAction(
        fulfillment.orderId,
        "pack",
        {
          weightKg: Number(weightKg),
          dimensions,
          notes,
        },
      );
      onPackageUpdated(updated);
      onClose();
    } catch {
      // safe fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title="Package Dimensions & Inspection"
        description="Verify parcel metrics to ensure accurate carrier billing and zero transit damage"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Weight */}
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
              <Scale className="size-3.5 text-[#E89535]" />
              Dead Weight (kg)
            </label>
            <Input
              type="number"
              step="0.05"
              min="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0.5)}
              className="text-xs h-9"
              required
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
              <Ruler className="size-3.5 text-[#E89535]" />
              Box Dimensions (L x W x H)
            </label>
            <Input
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 28x22x10 cm"
              className="text-xs h-9"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-caption font-semibold text-ink flex items-center gap-1.5">
              <Box className="size-3.5 text-[#E89535]" />
              Packing Inspection Notes
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Packaging notes or fragile label reminders"
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
              {isSubmitting ? "Saving..." : "Save Package Metrics"}
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
}
