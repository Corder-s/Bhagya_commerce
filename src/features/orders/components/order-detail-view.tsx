"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { CancelOrderModal } from "./cancel-order-modal";
import { ReturnOrderModal } from "./return-order-modal";
import { InvoiceModal } from "./invoice-modal";
import type { Order } from "@/features/orders/order-types";
import { orderService } from "@/services/order.service";
import { useCart } from "@/context/cart-context";
import { toast } from "@/lib/toast";

export function OrderDetailView({ orderId }: { orderId: string }) {
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showReturnModal, setShowReturnModal] = React.useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false);

  const { addItem, openCartDrawer } = useCart();

  const loadOrder = React.useCallback(async () => {
    try {
      const found = await orderService.getOrder(orderId);
      setOrder(found);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  React.useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  function handleBuyAgain() {
    if (!order) return;
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

    toast.success("Items Added to Cart", `${addedCount} items re-added to your bag.`);
    openCartDrawer();
  }

  if (loading) {
    return (
      <div className="flex min-h-[350px] flex-col items-center justify-center gap-3 py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        <p className="text-body-sm text-ink-soft">Loading order details…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card text-center max-w-lg mx-auto py-8">
        <CardContent className="space-y-4">
          <Package className="size-12 text-ink-subtle mx-auto" />
          <h3 className="text-heading-lg font-semibold text-ink">Order Not Found</h3>
          <p className="text-body-sm text-ink-soft">
            We couldn&apos;t locate an order with ID <strong className="font-mono text-ink">{orderId}</strong>.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button asChild variant="primary" size="md">
              <Link href="/account/orders">My Orders</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/shop">Browse Collections</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCod = order.payment?.method === "cod";
  const isCancellable = ["pending", "confirmed", "processing"].includes(order.status);
  const isReturnable = order.status === "delivered" && !order.returnRequest;
  const isTrackable = ["confirmed", "processing", "shipped", "out_for_delivery"].includes(order.status);

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <Card variant="surface" padding="none" radius="xl" className="border-line shadow-card overflow-hidden">
        <div className="border-b border-line bg-surface-raised p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-mono text-heading-lg font-bold text-ink">
                {order.orderNumber}
              </h2>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-caption text-ink-soft">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isTrackable && (
              <Button asChild variant="primary" size="md" className="gap-2">
                <Link href={`/orders/${order.id}/tracking`}>
                  <Truck className="size-4" />
                  <span>Track Shipment</span>
                </Link>
              </Button>
            )}

            <Button
              variant="outline"
              size="md"
              onClick={handleBuyAgain}
              className="gap-2"
            >
              <ShoppingBag className="size-4" />
              <span>Buy Again</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setShowInvoiceModal(true)}
              className="gap-2"
            >
              <FileText className="size-4" />
              <span>Invoice</span>
            </Button>

            {isCancellable && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowCancelModal(true)}
                className="text-danger hover:bg-danger-surface hover:text-danger gap-1.5"
              >
                <XCircle className="size-4" />
                <span>Cancel Order</span>
              </Button>
            )}

            {isReturnable && (
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowReturnModal(true)}
                className="text-gold-dark dark:text-gold gap-1.5"
              >
                <RotateCcw className="size-4" />
                <span>Request Return</span>
              </Button>
            )}
          </div>
        </div>

        {/* Quick summary grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line p-6 bg-surface">
          <div className="py-2 sm:py-0 sm:pr-6 space-y-1">
            <span className="text-caption text-ink-faint uppercase font-medium">Estimated Delivery</span>
            <p className="text-body-sm font-semibold text-ink">
              {order.estimatedDelivery || "3–5 business days"}
            </p>
          </div>
          <div className="py-2 sm:py-0 sm:px-6 space-y-1">
            <span className="text-caption text-ink-faint uppercase font-medium">Payment Status</span>
            <p className="text-body-sm font-semibold text-ink capitalize">
              {isCod ? "Cash on Delivery" : `Paid via ${order.payment?.method?.toUpperCase() || "Online"}`}
            </p>
          </div>
          <div className="py-2 sm:py-0 sm:pl-6 space-y-1">
            <span className="text-caption text-ink-faint uppercase font-medium">Shipping Destination</span>
            <p className="text-body-sm font-semibold text-ink truncate">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>
        </div>
      </Card>

      {/* Main Grid: Left Items & Totals, Right Address & Payment */}
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Left 2 Cols: Ordered Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h3 className="text-heading-md font-semibold text-ink flex items-center gap-2">
                <Package className="size-5 text-gold-dark dark:text-gold" />
                <span>Items in this Order ({order.items.length})</span>
              </h3>
              <span className="text-caption text-ink-soft">{order.deliveryMethod.name}</span>
            </div>

            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className="relative size-16 sm:size-20 rounded-xl bg-canvas-deep overflow-hidden shrink-0 border border-line">
                    <Image
                      src={item.imageSrc || "/placeholder.png"}
                      alt={item.imageAlt || item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-body-sm font-semibold text-ink">{item.name}</h4>
                    {item.variantName && (
                      <p className="text-caption text-ink-soft">{item.variantName}</p>
                    )}
                    {item.brandName && (
                      <p className="text-[11px] text-ink-faint mt-0.5">
                        Maker: {item.brandName}
                      </p>
                    )}
                    <p className="text-caption text-ink-soft mt-1">
                      Qty: {item.quantity} · {fmt(item.unitPrice)} each
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-body-sm font-bold text-ink font-mono">
                      {fmt(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-line pt-4 space-y-2.5 text-body-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Items Subtotal</span>
                <span className="text-ink font-medium font-mono">{fmt(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success font-medium">
                  <span>Savings / Coupon</span>
                  <span className="font-mono">-{fmt(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Shipping & Handling</span>
                <span className="text-ink font-medium">
                  {order.deliveryFee === 0 ? "FREE" : fmt(order.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Estimated Taxes (GST)</span>
                <span className="text-ink font-medium font-mono">{fmt(order.tax)}</span>
              </div>
              <div className="border-t border-line pt-3 flex justify-between items-baseline font-bold">
                <span className="text-body-md text-ink">Total Amount Paid</span>
                <span className="text-heading-lg text-gold-dark dark:text-gold font-display">
                  {fmt(order.total)}
                </span>
              </div>
            </div>
          </Card>

          {/* Order Event Timeline */}
          {order.events && order.events.length > 0 && (
            <Card variant="surface" padding="lg" radius="xl" className="border-line shadow-card space-y-4">
              <h3 className="text-heading-md font-semibold text-ink border-b border-line pb-4">
                Order Activity History
              </h3>
              <ol className="relative flex flex-col space-y-4">
                {order.events.map((evt, idx) => (
                  <li key={evt.id} className="flex items-start gap-3.5">
                    <div className="grid size-7 place-items-center rounded-full bg-gold-soft text-gold-dark dark:text-gold border border-gold/30 shrink-0 mt-0.5">
                      <Clock className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-ink">{evt.description}</p>
                      <time className="text-caption text-ink-faint">
                        {new Date(evt.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>

        {/* Right 1 Col: Shipping & Payment details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card space-y-3">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-ink-soft">
              <MapPin className="size-4 text-gold-dark dark:text-gold" />
              <span>Delivery Address</span>
            </div>
            <p className="text-body-sm font-bold text-ink">{order.shippingAddress.fullName}</p>
            <p className="text-caption text-ink-soft leading-relaxed">
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.postalCode}
              <br />
              Phone: {order.contact.phone || order.shippingAddress.phone}
            </p>
          </Card>

          {/* Payment Details */}
          <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card space-y-3">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-ink-soft">
              {isCod ? (
                <Banknote className="size-4 text-warning" />
              ) : (
                <CreditCard className="size-4 text-success" />
              )}
              <span>Payment Details</span>
            </div>
            <p className="text-body-sm font-bold text-ink">
              {isCod ? "Cash on Delivery" : `Online Payment (${order.payment?.method?.toUpperCase() || "UPI"})`}
            </p>
            <p className="text-caption text-ink-soft">
              {isCod
                ? "Payment collected at the time of doorstep delivery."
                : `Verified transaction reference: ${order.payment?.providerPaymentId || "TXN-VERIFIED-SSL"}`}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-faint pt-1">
              <ShieldCheck className="size-3.5 text-success" />
              <span>256-Bit SSL Encrypted & Protected</span>
            </div>
          </Card>

          {/* Need Help Card */}
          <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card space-y-3">
            <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wider text-ink-soft">
              <HelpCircle className="size-4 text-gold-dark dark:text-gold" />
              <span>Need Help?</span>
            </div>
            <p className="text-caption text-ink-soft leading-relaxed">
              Have questions regarding delivery, returns, or artisan craftsmanship for this order?
            </p>
            <Button asChild variant="outline" size="sm" fullWidth>
              <Link href="/contact">Contact Bhagya Support</Link>
            </Button>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CancelOrderModal
        orderId={order.id}
        orderNumber={order.orderNumber}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onCancelled={() => {
          loadOrder();
        }}
      />

      <ReturnOrderModal
        orderId={order.id}
        orderNumber={order.orderNumber}
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onSubmitted={() => {
          loadOrder();
        }}
      />

      <InvoiceModal
        order={order}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
