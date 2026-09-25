"use client";

import { useState } from "react";
import { Tag, X, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useCheckout } from "../checkout-context";

export function CheckoutOrderSummary() {
  const { items } = useCart();
  const { orderTotals, appliedCoupon, couponCodeInput, couponError, isSubmitting, setCouponInput, applyCoupon, removeCoupon } = useCheckout();
  const [collapsed, setCollapsed] = useState(false);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-xs overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 lg:cursor-default bg-surface"
        aria-expanded={!collapsed}
      >
        <span className="text-sm font-bold text-ink">
          Order Summary <span className="text-xs font-normal text-ink-subtle">({items.length} item{items.length !== 1 ? "s" : ""})</span>
        </span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-gold-dark dark:text-gold text-base">{fmt(orderTotals.total)}</span>
          <span className="lg:hidden text-ink-subtle">
            {collapsed ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
          </span>
        </div>
      </button>

      <div className={`${collapsed ? "hidden lg:block" : ""}`}>
        {/* Items list */}
        <div className="px-5 pb-4 space-y-3.5 border-t border-line/60 pt-4 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative size-12 rounded-xl overflow-hidden shrink-0 bg-canvas-deep border border-line">
                  {item.imageSrc && (
                    <Image src={item.imageSrc} alt={item.name} fill className="object-cover" sizes="48px" />
                  )}
                  <span className="absolute -top-1 -right-1 size-4.5 flex items-center justify-center rounded-full bg-primary text-[#151515] text-[9px] font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink truncate">{item.name}</p>
                  {item.mrpInr && item.mrpInr > item.unitPrice && (
                    <p className="text-[10px] text-ink-subtle line-through">{fmt(item.mrpInr)}</p>
                  )}
                </div>
              </div>
              <p className="text-xs font-bold text-ink shrink-0">{fmt(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Coupon Box */}
        <div className="px-5 py-3.5 border-t border-line/60 bg-canvas-deep/40">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Tag className="size-3.5 text-emerald-700 dark:text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{appliedCoupon.code}</p>
                  <p className="text-[10px] text-ink-soft">{appliedCoupon.description}</p>
                </div>
              </div>
              <button type="button" onClick={removeCoupon} className="text-ink-subtle hover:text-ink transition-colors cursor-pointer">
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 rounded-xl bg-surface border border-line focus:border-primary text-ink placeholder:text-ink-subtle text-xs outline-none transition-all focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={!couponCodeInput.trim() || isSubmitting}
                  className="px-4 py-2 rounded-xl bg-ink text-ink-inverse text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-600 dark:text-red-400">{couponError}</p>}
            </div>
          )}
        </div>

        {/* Price breakdown */}
        <div className="px-5 py-4 border-t border-line/60 space-y-2 text-xs">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span><span className="text-ink font-semibold">{fmt(orderTotals.subtotal)}</span>
          </div>
          {orderTotals.productSavings > 0 && (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
              <span>Product Savings</span>
              <span>− {fmt(orderTotals.productSavings)}</span>
            </div>
          )}
          {appliedCoupon && orderTotals.couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
              <span>Coupon discount</span>
              <span>− {fmt(orderTotals.couponDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ink-soft">
            <span>Delivery Fee</span>
            <span className={orderTotals.deliveryFee === 0 ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-ink font-semibold"}>
              {orderTotals.deliveryFee === 0 ? "FREE" : fmt(orderTotals.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Estimated Taxes</span>
            <span className="text-ink font-semibold">Included</span>
          </div>

          <div className="pt-3 border-t border-line flex justify-between items-baseline">
            <span className="text-sm font-bold text-ink">Total Amount</span>
            <span className="text-2xl font-bold text-gold-dark dark:text-gold">{fmt(orderTotals.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
