import type { ReactNode } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";

/**
 * Marketing route group — the public storefront (home, shop, brands,
 * collections, journal, start-selling and the support pages).
 *
 * Grouped so the customer-facing chrome is applied once and the URL stays clean
 * (`/shop`, not `/marketing/shop`).
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
