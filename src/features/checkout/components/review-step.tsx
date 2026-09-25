"use client";

import { useCart } from "@/context/cart-context";
import { useCheckout } from "../checkout-context";
import { ChevronRight, Edit2 } from "lucide-react";
import Image from "next/image";

export function ReviewStep() {
  const { contact, shippingAddress, deliveryMethod, appliedCoupon, orderTotals, setStep, goToNextStep, goToPreviousStep } = useCheckout();
  const { items } = useCart();

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink mb-1">Order Review</h2>
        <p className="text-sm text-ink-soft">Verify everything before heading to payment.</p>
      </div>

      {/* Contact */}
      <div className="rounded-xl border border-line bg-surface divide-y divide-line">
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-1">Contact</p>
            <p className="text-sm font-semibold text-ink">{contact.email}</p>
            <p className="text-sm text-ink-soft">{contact.phone}</p>
          </div>
          <button type="button" onClick={() => setStep("contact")} className="flex items-center gap-1 text-xs text-gold-dark dark:text-gold hover:underline font-semibold transition-colors">
            <Edit2 className="size-3" /> Edit
          </button>
        </div>

        {/* Address */}
        <div className="p-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-1">Delivery Address</p>
            {shippingAddress ? (
              <>
                <p className="text-sm font-bold text-ink">{shippingAddress.fullName}</p>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {shippingAddress.addressLine1}
                  {shippingAddress.addressLine2 ? `, ${shippingAddress.addressLine2}` : ""}
                  <br />
                  {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.postalCode}
                </p>
                <p className="text-xs text-ink-subtle mt-1">{shippingAddress.phone}</p>
              </>
            ) : (
              <p className="text-sm text-ink-subtle">No address selected</p>
            )}
          </div>
          <button type="button" onClick={() => setStep("address")} className="flex items-center gap-1 text-xs text-gold-dark dark:text-gold hover:underline font-semibold transition-colors shrink-0">
            <Edit2 className="size-3" /> Edit
          </button>
        </div>

        {/* Delivery */}
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-1">Delivery Method</p>
            <p className="text-sm font-semibold text-ink">{deliveryMethod.name}</p>
            <p className="text-xs text-gold-dark dark:text-gold font-medium">{deliveryMethod.estimatedDays}</p>
          </div>
          <button type="button" onClick={() => setStep("delivery")} className="flex items-center gap-1 text-xs text-gold-dark dark:text-gold hover:underline font-semibold transition-colors">
            <Edit2 className="size-3" /> Edit
          </button>
        </div>
      </div>

      {/* Items */}
      <div>
        <p className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-3">Items ({items.length})</p>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl border border-line bg-surface">
              <div className="relative size-14 rounded-lg overflow-hidden shrink-0 bg-canvas-deep border border-line">
                {item.imageSrc && (
                  <Image src={item.imageSrc} alt={item.name} fill className="object-cover" sizes="56px" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">{item.name}</p>
                <p className="text-xs text-ink-subtle">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-ink shrink-0">{fmt(item.unitPrice * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price summary */}
      <div className="rounded-xl border border-line bg-surface p-4 space-y-2">
        <div className="flex justify-between text-sm text-ink-soft">
          <span>Subtotal</span><span className="font-semibold text-ink">{fmt(orderTotals.subtotal)}</span>
        </div>
        {orderTotals.productSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Product savings</span><span className="text-emerald-700 dark:text-emerald-400 font-semibold">−{fmt(orderTotals.productSavings)}</span>
          </div>
        )}
        {appliedCoupon && orderTotals.couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-ink-soft">Coupon ({appliedCoupon.code})</span><span className="text-emerald-700 dark:text-emerald-400 font-semibold">−{fmt(orderTotals.couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-ink-soft">
          <span>Delivery</span>
          <span className={orderTotals.deliveryFee === 0 ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-ink font-semibold"}>
            {orderTotals.deliveryFee === 0 ? "FREE" : fmt(orderTotals.deliveryFee)}
          </span>
        </div>
        <div className="pt-2 border-t border-line flex justify-between items-baseline">
          <span className="font-bold text-ink">Total</span>
          <span className="font-bold text-gold-dark dark:text-gold text-lg">{fmt(orderTotals.total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={goToPreviousStep} className="px-6 py-3 rounded-xl border border-line bg-surface text-ink hover:bg-canvas-deep text-sm font-medium transition-all duration-200">
          Back
        </button>
        <button
          type="button"
          onClick={() => goToNextStep()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99]"
        >
          Proceed to Payment <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
