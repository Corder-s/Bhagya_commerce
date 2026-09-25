"use client";

import { CheckCircle2, Eye, MapPin, Package, ReceiptIndianRupee, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";
import type { MerchantOrder } from "@/features/merchant/dashboard-types";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatPrice } from "@/lib/format";

export function OrderQuickViewModal({
  order,
  isOpen,
  onClose,
}: {
  order: MerchantOrder | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!order) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalContent
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}
        size="md"
      >
        <div className="space-y-5 pt-2">
          {/* Status & Total Header */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-surface-subtle border border-line">
            <div>
              <span className="text-caption text-ink-soft block">Order Status</span>
              <div className="mt-1">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <div className="text-right">
              <span className="text-caption text-ink-soft block">Total Value</span>
              <span className="font-display text-heading-md font-bold text-ink">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="p-3.5 rounded-xl border border-line bg-surface space-y-2 text-caption">
            <div className="flex items-center gap-2 text-body-sm font-semibold text-ink border-b border-line pb-2">
              <MapPin className="size-4 text-[#C49A45]" />
              <span>Customer & Destination</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-ink-soft block">Customer Name:</span>
                <span className="font-semibold text-ink">{order.customerName}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Email:</span>
                <span className="text-ink font-mono truncate block">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-ink-soft block">Payment Method:</span>
                <span className="text-ink font-medium uppercase">{order.paymentMethod} ({order.paymentStatus})</span>
              </div>
              <div>
                <span className="text-ink-soft block">Delivery Destination:</span>
                <span className="text-ink font-medium">{order.shippingCity}</span>
              </div>
            </div>
          </div>

          {/* Ordered Items Preview */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-body-sm font-semibold text-ink">
              <Package className="size-4 text-[#C49A45]" />
              <span>Items in this Order ({order.itemCount})</span>
            </div>

            <ul className="divide-y divide-line border border-line rounded-xl overflow-hidden bg-surface">
              {order.itemPreviewNames.map((name, i) => (
                <li key={i} className="p-3 flex items-center justify-between text-body-sm">
                  <span className="text-ink font-medium">{name}</span>
                  <span className="text-caption text-ink-soft">Qty: 1</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
