"use client";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * HeaderWithCounts — thin client wrapper that reads cart/wishlist totals from
 * context and passes them down to the server-compatible SiteHeader. This keeps
 * the actual header markup server-renderable while the badge counts update live.
 */
export function HeaderWithCounts({
  user,
}: {
  user?: { name: string; email?: string; avatarUrl?: string | null } | null;
}) {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <SiteHeader cartCount={cartCount} wishlistCount={wishlistCount} user={user} />
  );
}
