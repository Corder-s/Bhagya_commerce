"use client";

import { Heart, MapPin, Package, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { accountRoutes, merchantRoutes } from "@/config/routes";
import { orderService } from "@/services/order.service";
import { useWishlist } from "@/context/wishlist-context";

export function AccountSummary() {
  const [orderCount, setOrderCount] = React.useState<number | null>(null);
  const { wishlistCount } = useWishlist();

  React.useEffect(() => {
    async function load() {
      const orders = await orderService.getOrders();
      setOrderCount(orders.length);
    }
    load();
  }, []);

  const tiles = [
    {
      Icon: Package,
      label: "My Orders",
      value: orderCount,
      href: accountRoutes.orders,
      hint: "Track, return and reorder",
    },
    {
      Icon: Heart,
      label: "Wishlist",
      value: wishlistCount,
      href: accountRoutes.wishlist,
      hint: "Saved artisanal items",
    },
    {
      Icon: MapPin,
      label: "Addresses",
      value: 1,
      href: accountRoutes.addresses,
      hint: "Delivery and billing",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-4 sm:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Card variant="surface" padding="md" radius="xl" interactive className="h-full border-line shadow-card">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-xl bg-gold-soft text-gold-dark dark:text-gold border border-gold/20"
                  >
                    <tile.Icon className="size-4" />
                  </span>
                  <span className="font-display text-heading-xl tabular-nums text-ink">
                    {tile.value ?? "…"}
                  </span>
                </div>
                <Link
                  href={tile.href}
                  className="text-heading-md text-ink hover:text-gold-dark dark:hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {tile.label}
                </Link>
                <p className="text-caption text-ink-soft">
                  {tile.hint}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <Card variant="surface" padding="md" radius="xl" className="border-line shadow-card">
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-dark dark:text-gold border border-gold/20"
            >
              <Store className="size-4" />
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-heading-md text-ink">Want to sell too?</h3>
                <Badge tone="primary" size="sm">
                  One Identity
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
