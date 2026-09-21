import type { ReactNode } from "react";

import { AccountSidebar } from "@/components/navigation/account-sidebar";
import { Container } from "@/components/ui/container";

/**
 * Account sub-layout — adds the secondary navigation rail inside the storefront
 * shell. Kept separate from the group layout so `/orders/[id]` and its tracking
 * page keep the full-width storefront frame.
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <AccountSidebar />

        {/* On mobile the rail is hidden and its destinations are reachable from
            the bottom tab bar plus this overview page. */}
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
