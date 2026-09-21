import { Heart, MapPin, Package, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { accountRoutes, merchantRoutes } from "@/config/routes";

/**
 * AccountSummary — the customer's at-a-glance panel on `/account`.
 *
 * Counts are `null` in Phase 1 and rendered as "—" with a "Phase 2" note rather
 * than as `0`, which would read as real data. The selling card uses the same
 * one-identity language as the rest of the product: selling is an addition to
 * this account, not a different kind of account.
 */
export function AccountSummary({
  counts = { orders: null, wishlist: null, addresses: null },
}: {
  counts?: { orders: number | null; wishlist: number | null; addresses: number | null };
}) {
  const tiles = [
    {
      Icon: Package,
      label: "Orders",
      value: counts.orders,
      href: accountRoutes.orders,
      hint: "Track and reorder",
    },
    {
      Icon: Heart,
      label: "Wishlist",
      value: counts.wishlist,
      href: accountRoutes.wishlist,
      hint: "Saved for later",
    },
    {
      Icon: MapPin,
      label: "Addresses",
      value: counts.addresses,
      href: accountRoutes.addresses,
      hint: "Delivery and billing",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Card variant="surface" padding="md" interactive className="h-full">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
                  >
                    <tile.Icon className="size-4" />
                  </span>
                  <span className="font-display text-heading-xl tabular-nums text-ink">
                    {tile.value ?? "—"}
                  </span>
                </div>
                <Link
                  href={tile.href}
                  className="text-heading-md text-ink hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {tile.label}
                </Link>
                <p className="text-caption text-ink-soft">
                  {tile.hint}
                  {tile.value === null ? " · available in Phase 2" : null}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <Card variant="botanical" padding="md" radius="lg">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-md bg-surface text-primary"
            >
              <Store className="size-4" />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-heading-md text-ink">Want to sell too?</h3>
                <Badge tone="primary" size="sm">
                  Optional
                </Badge>
              </div>
              <p className="max-w-xl text-body-sm text-ink-soft">
                A store can be added to this same account. Your orders, wishlist and
                addresses stay exactly where they are — nothing is duplicated and
                nothing is reset.
              </p>
            </div>
          </div>

          <Button asChild variant="primary" size="md" className="shrink-0">
            <Link href={merchantRoutes.onboarding}>Start selling</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
