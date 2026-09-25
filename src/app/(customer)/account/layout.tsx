import type { ReactNode } from "react";

import { AccountSidebar } from "@/components/navigation/account-sidebar";
import { Container } from "@/components/ui/container";
import { AuthGuard } from "@/features/auth/auth-guard";

/**
 * Account sub-layout — adds the secondary navigation rail inside the storefront
 * shell. Protected by AuthGuard to ensure private customer information is only
 * visible to authenticated sessions.
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <Container className="py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
          <AccountSidebar />

          {/* On mobile the rail is hidden and its destinations are reachable from
              the bottom tab bar plus this overview page. */}
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </AuthGuard>
  );
}
