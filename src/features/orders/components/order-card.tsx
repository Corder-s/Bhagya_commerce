"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, FileText, RotateCcw, ShoppingBag, Truck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { CancelOrderModal } from "./cancel-order-modal";
import { ReturnOrderModal } from "./return-order-modal";
import { InvoiceModal } from "./invoice-modal";
import type { Order } from "@/features/orders/order-types";
import { useCart } from "@/context/cart-context";
import { toast } from "@/lib/toast";

export interface OrderCardProps {
  order: Order;
  onRefresh?: () => void;
}

export function OrderCard({ order, onRefresh }: OrderCardProps) {
  const { addItem, openCartDrawer } = useCart();
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showReturnModal, setShowReturnModal] = React.useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const isCancellable = ["pending", "confirmed", "processing"].includes(order.status);
  const isReturnable = order.status === "delivered" && !order.returnRequest;
  const isTrackable = ["confirmed", "processing", "shipped", "out_for_delivery"].includes(order.status);

  function handleBuyAgain() {
    let addedCount = 0;
    order.items.forEach((item) => {
      addItem(
        {
          id: item.productId,
          slug: item.slug || item.productId,
          name: item.name,
          blurb: item.name,
          brand: { slug: "artisan", name: item.brandName || "Artisan Guild" },
          categorySlug: "shop",
          priceInr: item.unitPrice,
          mrpInr: item.mrpInr ?? null,
          rating: null,
          image: {
            src: item.imageSrc || "/placeholder.png",
            alt: item.imageAlt || item.name,
            width: 600,
            height: 600,
          },
          availability: "in-stock",
          buckets: ["trending"],
        },
        item.variantName
          ? {
              id: item.variantId || "var_default",
              name: item.variantName,
              priceInr: item.unitPrice,
              mrpInr: item.mrpInr ?? null,
            }
          : undefined,
        item.quantity,
      );
      addedCount += item.quantity;
    });

    toast.success("Items Added to Cart", `${addedCount} ${addedCount === 1 ? "item" : "items"} added to your bag.`);
    openCartDrawer();
  }

  return (
    <>
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-raised px-5 py-3.5 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-soft">
            <div>
              <span className="text-ink-faint">ORDER PLACED</span>
              <p className="font-medium text-ink">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="h-6 w-px bg-line hidden sm:block" />
            <div>
              <span className="text-ink-faint">TOTAL AMOUNT</span>
              <p className="font-semibold text-ink font-mono">{fmt(order.total)}</p>
            </div>
            <div className="h-6 w-px bg-line hidden sm:block" />
            <div>
              <span className="text-ink-faint">SHIP TO</span>
              <p className="font-medium text-ink truncate max-w-[140px]">
                {order.shippingAddress.fullName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-caption text-ink-faint">ORDER #</span>
              <p className="font-mono text-body-sm font-bold text-ink">{order.orderNumber}</p>
            </div>
            <OrderStatusBadge status={order.status} size="sm" />
          </div>
        </div>

        {/* Card Content & Items */}
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left: Product preview thumbnails & list */}
            <div className="space-y-3 flex-1 min-w-0">
              <div className="divide-y divide-line">
                {order.items.map((item) => (
                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                    <div className="relative size-14 sm:size-16 rounded-xl bg-canvas-deep overflow-hidden shrink-0 border border-line">
                      <Image
                        src={item.imageSrc || "/placeholder.png"}
                        alt={item.imageAlt || item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-sm font-semibold text-ink truncate">{item.name}</h4>
                      {item.variantName && (
                        <p className="text-caption text-ink-soft">{item.variantName}</p>
                      )}
                      <p className="text-caption text-ink-faint mt-0.5">
                        Qty: {item.quantity} · {fmt(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Note or Delivery Estimate */}
              <div className="flex items-center gap-2 text-caption text-ink-soft pt-1">
                <Truck className="size-3.5 text-gold-dark dark:text-gold shrink-0" />
                <span>
                  {order.status === "delivered"
                    ? `Delivered on ${order.estimatedDelivery || "recently"}`
                    : order.status === "cancelled"
                    ? "Order was cancelled"
                    : `Estimated delivery: ${order.estimatedDelivery || "3–5 business days"}`}
                </span>
                {order.returnRequest && (
                  <span className="text-warning font-medium">
                    · Return Request: {order.returnRequest.status}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Actions Column */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 lg:w-48 pt-2 lg:pt-0 border-t lg:border-t-0 lg:border-l border-line lg:pl-5">
              {isTrackable ? (
                <Button asChild variant="primary" size="md" fullWidth className="gap-2">
                  <Link href={`/orders/${order.id}/tracking`}>
                    <Truck className="size-4" />
                    <span>Track Order</span>
                  </Link>
                </Button>
              ) : (
                <Button asChild variant="primary" size="md" fullWidth className="gap-2">
                  <Link href={`/orders/${order.id}`}>
                    <Eye className="size-4" />
                    <span>View Details</span>
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleBuyAgain}
                className="gap-2"
              >
                <ShoppingBag className="size-4" />
                <span>Buy Again</span>
              </Button>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInvoiceModal(true)}
                  className="flex-1 text-caption text-ink-soft hover:text-ink gap-1"
                >
                  <FileText className="size-3.5" />
                  <span>Invoice</span>
                </Button>

                {isCancellable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 text-caption text-danger hover:text-danger hover:bg-danger-surface gap-1"
                  >
                    <XCircle className="size-3.5" />
                    <span>Cancel</span>
                  </Button>
                )}

                {isReturnable && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowReturnModal(true)}
                    className="flex-1 text-caption text-gold-dark dark:text-gold hover:text-gold-dark gap-1"
                  >
                    <RotateCcw className="size-3.5" />
                    <span>Return</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CancelOrderModal
        orderId={order.id}
        orderNumber={order.orderNumber}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancelled={() => {
          onRefresh?.();
        }}
      />

      <ReturnOrderModal
        orderId={order.id}
        orderNumber={order.orderNumber}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSubmitted={() => {
          onRefresh?.();
        }}
      />

      <InvoiceModal
        order={order}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </>
  );
}
