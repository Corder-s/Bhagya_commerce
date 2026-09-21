import { ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

import { CartSummaryShell } from "@/features/cart/cart-summary-shell";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Cart",
  description: "Your Bhagya Commerce cart.",
  path: "/cart",
  noIndex: true,
});

/**
 * Cart.
 *
 * Empty state plus the real summary structure. There is no cart *service* in
 * Phase 1, so the page shows an honest empty cart rather than pre-filled mock
 * items — the layout and the summary maths are already in place for Phase 2.
 */
export default function CartPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        title="Your cart"
        description="Items you add are held for 60 minutes before being released back to the makers."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="rounded-lg border border-line bg-surface">
          <EmptyState
            size="lg"
            icon={<ShoppingBag />}
            title="Your cart is empty"
            description="Nothing here yet. Cart items, quantities and price recalculation are wired up in Phase 2 — this page already owns the layout they slot into."
            action={{ label: "Browse the shop", href: marketingRoutes.shop }}
            secondaryAction={{ label: "View your wishlist", href: "/account/wishlist" }}
          />
        </div>

        <CartSummaryShell className="lg:sticky lg:top-24" />
      </div>
    </Container>
  );
}
