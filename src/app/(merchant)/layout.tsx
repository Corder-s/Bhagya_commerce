import type { ReactNode } from "react";

import { MerchantShell } from "@/components/layout/merchant-shell";

/**
 * Merchant route group — the selling workspace.
 *
 * Every `/merchant/*` route renders inside the workspace shell: no storefront
 * header, no cart, no bottom tab bar. Onboarding is included here so a new seller
 * never sees consumer chrome mid-setup, but the shell's rail is what makes the
 * workspace feel like a separate tool rather than a bolted-on page.
 *
 * There is no authentication yet (Phase 1), so no route is gated. When sessions
 * arrive, the guard belongs in this layout plus `proxy.ts`, not in each page.
 */
export default function MerchantLayout({ children }: { children: ReactNode }) {
  return <MerchantShell>{children}</MerchantShell>;
}
