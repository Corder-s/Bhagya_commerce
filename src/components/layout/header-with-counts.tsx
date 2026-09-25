"use client";

import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { SiteHeader } from "@/components/layout/site-header";

/**
 * HeaderWithCounts — thin client wrapper that reads cart/wishlist totals from
 * context and passes them down to the SiteHeader. The account menu reads live
 * authentication state directly from AuthContext.
 */
export function HeaderWithCounts() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <SiteHeader cartCount={cartCount} wishlistCount={wishlistCount} />
  );
}
