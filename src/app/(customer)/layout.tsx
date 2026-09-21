import type { ReactNode } from "react";

import { StorefrontShell } from "@/components/layout/storefront-shell";

/**
 * Customer route group — the signed-in customer experience.
 *
 * Keeps the storefront chrome (a customer is shopping, not administrating), and
 * lets `/account/*` add its own secondary navigation inside the shell. Session
 * gating is deliberately absent in Phase 1: there is no auth to gate on yet, so
 * the pages render as their honest empty states.
 */
export default function CustomerLayout({ children }: { children: ReactNode }) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
