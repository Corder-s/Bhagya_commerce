import { ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { commerceRoutes } from "@/config/routes";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * CartSummaryShell — the order-summary rail shown beside a cart or checkout.
 *
 * It renders the *structure* of a real summary (subtotal, shipping, platform fee,
 * total, free-shipping progress) from explicitly empty inputs, so the maths and
 * layout are verifiable now and Phase 3 only has to feed it a cart object.
 * Nothing here invents a balance: with zero items it states zero and says so.
 */
export function CartSummaryShell({
  subtotal = 0,
  shipping = 0,
  fee = 0,
  freeShippingThreshold = 1499,
  className,
}: {
  subtotal?: number;
  shipping?: number;
  fee?: number;
  freeShippingThreshold?: number;
  className?: string;
}) {
  const total = subtotal + shipping + fee;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <Card variant="surface" padding="md" radius="lg" className={cn(className)}>
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-heading-md text-ink">Order summary</h2>

        {/* Free-shipping progress. Text states the threshold; the bar reinforces it. */}
        <div className="flex flex-col gap-2">
          <p className="text-caption text-ink-soft">
            {remaining > 0
              ? `Add ${formatPrice(remaining)} more for free shipping`
              : "Free shipping unlocked"}
          </p>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={freeShippingThreshold}
            aria-valuenow={Math.min(subtotal, freeShippingThreshold)}
            aria-label="Progress towards free shipping"
            className="h-1.5 w-full overflow-hidden rounded-pill bg-canvas-deep"
          >
            <div
              className="h-full rounded-pill bg-botanical transition-[width] duration-slow ease-brand"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <Divider spacing="sm" />

        <dl className="flex flex-col gap-2.5 text-body-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-ink-soft">
              <Truck className="size-4" aria-hidden="true" />
              Shipping
            </dt>
            <dd className="tabular-nums text-ink">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink-soft">Platform fee</dt>
            <dd className="tabular-nums text-ink">{formatPrice(fee)}</dd>
          </div>
        </dl>

        <Divider spacing="sm" />

        <div className="flex items-baseline justify-between gap-4">
          <span className="text-body-md font-semibold text-ink">Total payable</span>
          <span className="font-display text-heading-xl tabular-nums text-primary">
            {formatPrice(total)}
          </span>
        </div>

        <Button variant="primary" size="lg" fullWidth disabled>
          <ShoppingBag aria-hidden="true" />
          Checkout
        </Button>

        <p className="text-caption text-ink-soft">
          Payments are implemented in Phase 3. This summary is displayed with an
          empty cart — no amounts are simulated.
        </p>

        <Link
          href={commerceRoutes.cart}
          className="text-caption font-medium text-primary underline-offset-4 hover:underline"
        >
          Review your cart
        </Link>
      </CardContent>
    </Card>
  );
}
