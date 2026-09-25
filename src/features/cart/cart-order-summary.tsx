"use client";

import { ArrowRight, Lock, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface CartOrderSummaryProps {
  className?: string;
  onCheckoutClick?: () => void;
  compact?: boolean;
}

export function CartOrderSummary({
  className,
  onCheckoutClick,
  compact = false,
}: CartOrderSummaryProps) {
  const {
    subtotal,
    itemCount,
    freeShippingThreshold,
    amountNeededForFreeShipping,
    isFreeShippingEligible,
    estimatedDeliveryFee,
    total,
  } = useCart();

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100),
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs",
        className,
      )}
    >
      <h3 className="font-display text-heading-lg font-medium text-ink">
        Order Summary
      </h3>

      {/* Free Delivery Meter */}
      <div className="mt-4 rounded-xl border border-line bg-gold-surface dark:bg-surface-elevated p-3.5">
        <div className="flex items-center gap-2 text-body-sm font-semibold text-gold-dark dark:text-gold">
          <Truck className="size-4 shrink-0" aria-hidden="true" />
          {isFreeShippingEligible ? (
            <span>You unlocked Free Delivery across India!</span>
          ) : (
            <span>
              Add <strong className="text-ink">{formatPrice(amountNeededForFreeShipping)}</strong> for Free Delivery
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-pill bg-canvas-deep">
          <div
            className="h-full bg-gradient-btn-gold transition-all duration-base ease-brand"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Line Items */}
      <dl className="mt-5 space-y-3 text-body-sm">
        <div className="flex justify-between text-ink-soft">
          <dt>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
          <dd className="font-medium text-ink tabular-nums">{formatPrice(subtotal)}</dd>
        </div>

        <div className="flex justify-between text-ink-soft">
          <dt className="flex items-center gap-1.5">
            <span>Estimated Delivery</span>
          </dt>
          <dd className="font-medium tabular-nums">
            {estimatedDeliveryFee === 0 ? (
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">FREE</span>
            ) : (
              <span className="text-ink">{formatPrice(estimatedDeliveryFee)}</span>
            )}
          </dd>
        </div>

        <div className="flex justify-between text-ink-soft">
          <dt>Taxes & GST</dt>
          <dd className="font-medium text-ink-subtle">Included in price</dd>
        </div>

        <div className="border-t border-line pt-3 flex justify-between text-body-md font-bold text-ink">
          <dt>Grand Total</dt>
          <dd className="text-heading-md font-bold text-gold-dark dark:text-gold tabular-nums">
            {formatPrice(total)}
          </dd>
        </div>
      </dl>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <Button
          asChild
          size="lg"
          variant="primary"
          fullWidth
          disabled={itemCount === 0}
          onClick={onCheckoutClick}
        >
          <Link href="/checkout">
            Proceed to Checkout
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>

        {!compact && (
          <Button asChild size="md" variant="ghost" fullWidth>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        )}
      </div>

      {/* Trust reassurance */}
      <div className="mt-6 border-t border-line pt-4 space-y-2 text-caption text-ink-soft">
        <div className="flex items-center gap-2">
          <Lock className="size-3.5 text-gold-dark dark:text-gold" aria-hidden="true" />
          <span>Encrypted 256-bit secure checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-gold-dark dark:text-gold" aria-hidden="true" />
          <span>100% authentic handcrafted items directly from makers</span>
        </div>
      </div>
    </div>
  );
}
