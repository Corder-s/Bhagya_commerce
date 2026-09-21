import type { ReactNode } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";

/**
 * Shop route group — cart, checkout, payment and order confirmation.
 *
 * Grouped separately from marketing because the commerce flow will later need its
 * own concerns (cart-session provider, reduced chrome during checkout, analytics
 * steps) without those leaking into editorial pages. The URL stays flat: `/cart`.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
