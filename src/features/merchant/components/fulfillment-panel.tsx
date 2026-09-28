"use client";

import {
  AlertCircle,
  Box,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Package,
  Printer,
  Ruler,
  Scale,
  Send,
  Truck,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PackageDetailsModal } from "@/features/merchant/components/package-details-modal";
import { PickupRequestModal } from "@/features/merchant/components/pickup-request-modal";
import { ShippingLabelModal } from "@/features/merchant/components/shipping-label-modal";
import type { MerchantOrder } from "@/features/merchant/dashboard-types";
import type { Fulfillment, FulfillmentStatus } from "@/features/orders/shipment-types";
import { shippingService } from "@/services/shipping.service";

const STATUS_CONFIG: Record<
  FulfillmentStatus,
  { label: string; bg: string; text: string; step: number }
> = {
  unfulfilled: { label: "Unfulfilled", bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", step: 1 },
  processing: { label: "Processing", bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", step: 2 },
  packed: { label: "Packed & Weighed", bg: "bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-400", step: 3 },
  ready_for_pickup: { label: "Ready for Pickup", bg: "bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", step: 4 },
  shipped: { label: "In Transit", bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", step: 5 },
  delivered: { label: "Delivered", bg: "bg-emerald-500/15", text: "text-emerald-800 dark:text-emerald-300", step: 6 },
  cancelled: { label: "Cancelled", bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", step: 0 },
};

export function FulfillmentPanel({
  order,
  onOrderUpdated,
}: {
  order: MerchantOrder;
  onOrderUpdated?: () => void;
}) {
  const [fulfillment, setFulfillment] = React.useState<Fulfillment | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState(false);

  // Modals
  const [labelModalOpen, setLabelModalOpen] = React.useState(false);
  const [pickupModalOpen, setPickupModalOpen] = React.useState(false);
  const [packageModalOpen, setPackageModalOpen] = React.useState(false);

  const loadFulfillment = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await shippingService.getFulfillment(order.id);
      setFulfillment(data);
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  }, [order.id]);

  React.useEffect(() => {
    loadFulfillment();
  }, [loadFulfillment]);

  const handleAction = async (action: "process" | "create_shipment" | "ship" | "deliver") => {
    setActionLoading(true);
    try {
      const updated = await shippingService.executeFulfillmentAction(order.id, action);
      setFulfillment(updated);
      onOrderUpdated?.();
    } catch {
      // safe fallback
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !fulfillment) {
    return (
      <div className="p-4 rounded-xl bg-surface-subtle border border-line animate-pulse space-y-3">
        <div className="h-4 w-40 bg-line rounded" />
        <div className="h-8 w-full bg-line rounded" />
      </div>
    );
  }

  const currentConfig = STATUS_CONFIG[fulfillment.status] || STATUS_CONFIG.unfulfilled;

  return (
    <div className="space-y-3 border border-line rounded-xl bg-surface p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-line">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-[#E89535] dark:text-[#F0A349]" />
          <h4 className="text-body-sm font-bold text-ink uppercase tracking-wider">
            Fulfilment & Dispatch Operations
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${currentConfig.bg} ${currentConfig.text}`}>
            {currentConfig.label}
          </span>
          {fulfillment.trackingNumber && (
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-surface-subtle text-ink border border-line rounded">
              AWB: {fulfillment.trackingNumber}
            </span>
          )}
        </div>
      </div>

      {/* Metrics Row: Package, Weight, Carrier, Pickup */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-caption">
        <div className="p-2.5 rounded-lg bg-surface-subtle border border-line">
          <span className="text-ink-soft block text-[10px] uppercase font-semibold">Weight</span>
          <span className="font-semibold text-ink flex items-center gap-1 mt-0.5">
            <Scale className="size-3 text-ink-soft" />
            {fulfillment.packageWeightKg} kg
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-subtle border border-line">
          <span className="text-ink-soft block text-[10px] uppercase font-semibold">Dimensions</span>
          <span className="font-semibold text-ink flex items-center gap-1 mt-0.5">
            <Ruler className="size-3 text-ink-soft" />
            {fulfillment.packageDimensions}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-subtle border border-line">
          <span className="text-ink-soft block text-[10px] uppercase font-semibold">Assigned Carrier</span>
          <span className="font-semibold text-ink truncate block mt-0.5">
            {fulfillment.carrier || "Not assigned"}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-surface-subtle border border-line">
          <span className="text-ink-soft block text-[10px] uppercase font-semibold">Carrier Pickup</span>
          <span className={`font-semibold flex items-center gap-1 mt-0.5 ${
            fulfillment.pickupScheduled ? "text-emerald-700 dark:text-emerald-400" : "text-ink-soft"
          }`}>
            <Calendar className="size-3" />
            {fulfillment.pickupScheduled ? "Scheduled" : "Pending"}
          </span>
        </div>
      </div>

      {/* Contextual Action Toolbar */}
      <div className="pt-2 flex flex-wrap items-center gap-2">
        {fulfillment.status === "unfulfilled" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAction("process")}
            disabled={actionLoading}
            className="text-xs h-8 bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold"
          >
            <Clock className="size-3.5" />
            Start Processing Order
          </Button>
        )}

        {(fulfillment.status === "processing" || fulfillment.status === "unfulfilled") && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPackageModalOpen(true)}
            className="text-xs h-8 text-ink"
          >
            <Box className="size-3.5 text-[#E89535]" />
            Package & Weigh Parcel
          </Button>
        )}

        {(fulfillment.status === "processing" || fulfillment.status === "packed") && !fulfillment.trackingNumber && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleAction("create_shipment")}
            disabled={actionLoading}
            className="text-xs h-8 bg-[#E89535] hover:bg-[#D48024] text-[#241812] font-semibold"
          >
            <Truck className="size-3.5" />
            Create Shipment & Generate AWB
          </Button>
        )}

        {fulfillment.trackingNumber && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLabelModalOpen(true)}
              className="text-xs h-8 text-ink"
            >
              <Printer className="size-3.5 text-[#E89535]" />
              Print Shipping Label
            </Button>

            {!fulfillment.pickupScheduled ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPickupModalOpen(true)}
                className="text-xs h-8 text-ink"
              >
                <Calendar className="size-3.5 text-[#E89535]" />
                Request Courier Pickup
              </Button>
            ) : (
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                Ref: {fulfillment.pickupReference}
              </span>
            )}
          </>
        )}

        {fulfillment.status === "ready_for_pickup" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("ship")}
            disabled={actionLoading}
            className="text-xs h-8 text-ink"
          >
            <Send className="size-3.5 text-blue-600" />
            Handed Over to Courier
          </Button>
        )}

        {fulfillment.status === "shipped" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction("deliver")}
            disabled={actionLoading}
            className="text-xs h-8 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
          >
            <CheckCircle2 className="size-3.5" />
            Mark Delivered
          </Button>
        )}
      </div>

      {/* Embedded Modals */}
      <PackageDetailsModal
        isOpen={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        fulfillment={fulfillment}
        onPackageUpdated={(updated) => {
          setFulfillment(updated);
          onOrderUpdated?.();
        }}
      />

      <ShippingLabelModal
        isOpen={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        fulfillment={fulfillment}
        order={order}
      />

      <PickupRequestModal
        isOpen={pickupModalOpen}
        onClose={() => setPickupModalOpen(false)}
        fulfillment={fulfillment}
        onPickupScheduled={(updated) => {
          setFulfillment(updated);
          onOrderUpdated?.();
        }}
      />
    </div>
  );
}
