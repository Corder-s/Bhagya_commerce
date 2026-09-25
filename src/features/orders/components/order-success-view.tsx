"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Banknote,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Printer,
  Sparkles,
} from "lucide-react";
import { m } from "framer-motion";

import { OrderTimeline, type TrackingStage } from "@/features/orders/order-timeline";
import type { Order } from "@/features/orders/order-types";
import { orderStorage } from "@/lib/storage/order-storage";
import { orderService } from "@/services/order.service";

export function OrderSuccessView() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadOrder() {
      const targetId = queryOrderId || orderStorage.getLastOrderId();
      if (targetId) {
        const found = await orderService.getOrder(targetId);
        setOrder(found);
      }
      setLoading(false);
    }
    loadOrder();
  }, [queryOrderId]);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="size-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-ink-soft text-sm mt-4">Retrieving your order confirmation…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5">
        <div className="size-16 rounded-full bg-gold-soft text-gold-dark dark:text-gold flex items-center justify-center mx-auto">
          <Package className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-ink">No Recent Order Found</h1>
        <p className="text-ink-soft text-sm">
          We couldn't find an active order session. If you recently completed a payment, check your email or visit your account orders.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-btn-gold text-[#151515] font-semibold text-sm transition-all shadow-sm hover:opacity-95"
          >
            <ShoppingBag className="size-4" /> Explore Shop
          </Link>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-line text-ink-soft text-sm font-medium hover:border-primary/40 hover:bg-gold-surface transition-colors"
          >
            My Account
          </Link>
        </div>
      </div>
    );
  }

  const isCod = order.payment?.method === "cod";

  const trackingStages: readonly TrackingStage[] = [
    {
      id: "placed",
      label: "Order Confirmed",
      description: isCod
        ? "Order verified with Cash on Delivery"
        : `Payment verified via ${order.payment?.method?.toUpperCase() || "Online"}`,
      timestamp: new Date(order.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      state: "complete",
    },
    {
      id: "packed",
      label: "Handcrafted & Quality Checked",
      description: "Artisan workshop preparing and packaging your order",
      state: "current",
    },
    {
      id: "shipped",
      label: "In Transit with Courier",
      description: `Shipped via ${order.deliveryMethod.name}`,
      state: "upcoming",
    },
    {
      id: "delivered",
      label: "Doorstep Delivery",
      description: `Estimated by ${order.estimatedDelivery || "3–5 days"}`,
      state: "upcoming",
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <m.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-line bg-surface p-6 sm:p-8 text-center relative overflow-hidden shadow-xs"
      >
        <div className="size-16 sm:size-20 rounded-full bg-success-surface text-success flex items-center justify-center mx-auto ring-8 ring-success-surface/60 mb-4">
          <CheckCircle2 className="size-8 sm:size-10" />
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gold-soft text-gold-dark dark:text-gold border border-gold-light/40 mb-2">
          <Sparkles className="size-3" /> Confirmed Bhagya Order
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-ink">
          {isCod ? "Order Placed Successfully!" : "Payment & Order Confirmed!"}
        </h1>

        <p className="text-ink-soft text-sm sm:text-base max-w-lg mx-auto mt-2">
          Thank you for choosing Bhagya. We’ve sent a confirmation email to{" "}
          <span className="text-ink font-bold">{order.contact.email}</span>.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-canvas-deep border border-line rounded-xl px-5 py-3 text-xs">
          <div>
            <span className="text-ink-subtle">Order Number:</span>{" "}
            <span className="font-mono font-bold text-gold-dark dark:text-gold">{order.orderNumber}</span>
          </div>
          <div className="hidden sm:block text-line-strong">|</div>
          <div>
            <span className="text-ink-subtle">Estimated Delivery:</span>{" "}
            <span className="font-bold text-ink">{order.estimatedDelivery}</span>
          </div>
          <div className="hidden sm:block text-line-strong">|</div>
          <div>
            <span className="text-ink-subtle">Payment:</span>{" "}
            <span className="font-bold text-success">
              {isCod ? "Cash on Delivery (Pending)" : `Paid ${fmt(order.total)}`}
            </span>
          </div>
        </div>
      </m.div>

      {/* Two Column Layout: Order Details & Live Timeline */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Left 3 Cols: Items & Shipping Summary */}
        <div className="md:col-span-3 space-y-6">
          {/* Purchased Items */}
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-ink flex items-center justify-between">
              <span>Items in this Order ({order.items.length})</span>
              <span className="text-xs font-semibold text-ink-subtle">
                {order.deliveryMethod.name}
              </span>
            </h2>

            <div className="divide-y divide-line">
              {order.items.map((item) => (
                <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                  <div className="relative size-14 rounded-xl bg-canvas-deep overflow-hidden shrink-0 border border-line">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt || item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{item.name}</p>
                    {item.variantName && (
                      <p className="text-xs text-ink-soft">{item.variantName}</p>
                    )}
                    <p className="text-xs text-ink-subtle mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-ink">
                      {fmt(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price calculation breakdown */}
            <div className="border-t border-line pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">{fmt(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Savings & Discounts</span>
                  <span className="font-semibold">-{fmt(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Delivery Fee ({order.deliveryMethod.name})</span>
                <span className="font-semibold text-ink">
                  {order.deliveryFee === 0 ? "FREE" : fmt(order.deliveryFee)}
                </span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between items-baseline">
                <span className="text-sm font-bold text-ink">
                  {isCod ? "Amount Payable on Delivery" : "Total Paid"}
                </span>
                <span className="text-lg font-bold text-gold-dark dark:text-gold">{fmt(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Information Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-canvas-deep p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-subtle uppercase tracking-wider">
                <MapPin className="size-4 text-gold-dark dark:text-gold" />
                <span>Shipping Address</span>
              </div>
              <p className="text-sm font-bold text-ink">{order.shippingAddress.fullName}</p>
              <p className="text-xs text-ink-soft leading-relaxed">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state} –{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-xs text-ink-subtle pt-1">Phone: {order.contact.phone}</p>
            </div>

            <div className="rounded-xl border border-line bg-canvas-deep p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-subtle uppercase tracking-wider">
                {isCod ? (
                  <Banknote className="size-4 text-warning" />
                ) : (
                  <CreditCard className="size-4 text-success" />
                )}
                <span>Payment Details</span>
              </div>
              <p className="text-sm font-bold text-ink">
                {isCod
                  ? "Cash on Delivery"
                  : `Online Payment (${order.payment?.method?.toUpperCase() || "UPI"})`}
              </p>
              <p className="text-xs text-ink-soft">
                {isCod
                  ? "Pay ₹" + order.total.toLocaleString("en-IN") + " to the courier at delivery via cash or UPI QR."
                  : "Transaction authorized & captured securely via 256-bit SSL."}
              </p>
              <div className="pt-1">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    isCod
                      ? "bg-warning-surface text-warning border border-amber-500/30"
                      : "bg-success-surface text-success border border-emerald-500/30"
                  }`}
                >
                  {isCod ? "Payment Pending on Delivery" : "Paid Securely"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Order Tracking Timeline & Next Actions */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center justify-between">
              <span>Order Status</span>
              <span className="text-xs font-bold text-success">Processing</span>
            </h3>

            <OrderTimeline stages={trackingStages} className="pt-2" />
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-3">
            <Link
              href={`/orders/${order.id}`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-sm transition-all shadow-sm hover:opacity-95"
            >
              <span>Track Full Order</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-line bg-surface text-ink hover:bg-canvas text-sm font-semibold transition-colors"
            >
              <ShoppingBag className="size-4" />
              <span>Continue Shopping</span>
            </Link>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-line bg-canvas text-ink-soft hover:text-ink text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print Order Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
