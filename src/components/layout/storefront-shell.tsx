import * as React from "react";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { HeaderWithCounts } from "@/components/layout/header-with-counts";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileTabBar } from "@/components/navigation/mobile-tab-bar";
import { cn } from "@/lib/utils";

/**
 * StorefrontShell — the chrome for every customer-facing route
 * (marketing, shop/collections, cart/checkout and the customer account area).
 *
 * Content sits in `<main id="main">` so the skip link and every "back to
 * content" affordance has a single, stable target. Bottom padding on phones
 * clears the fixed tab bar — applied once here rather than per page.
 */
export function StorefrontShell({
  children,
  className,
}: {
  children: React.ReactNode;
  user?: unknown;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-dvh flex-col bg-canvas", className)}>
      <AnnouncementBar />
      <HeaderWithCounts />

      <main
        id="main"
        className="flex-1 pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] lg:pb-0"
      >
        {children}
      </main>

      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
