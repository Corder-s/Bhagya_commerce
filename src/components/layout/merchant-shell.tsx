import { ArrowUpRight, Bell, HelpCircle, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { MerchantSidebar } from "@/components/navigation/merchant-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { marketingRoutes, merchantRoutes } from "@/config/routes";

/**
 * MerchantShell — the selling workspace.
 *
 * Intentionally *not* the storefront with a different accent: it is a
 * productivity surface with a fixed rail, a persistent store context and a
 * single exit back to shopping. The store name lives in the rail header because
 * every merchant question ("which store am I looking at?") is answered there.
 *
 * The rail is a horizontal scroller on tablets and a drawer-free stacked list on
 * phones, so nothing is clipped at 320px.
 */
export function MerchantShell({
  children,
  storeName = "Your store",
  storeStatus = "not-live",
}: {
  children: React.ReactNode;
  storeName?: string;
  /** Drives the context badge; real values come from the store service. */
  storeStatus?: "not-live" | "live" | "paused";
}) {
  const statusTone =
    storeStatus === "live" ? "success" : storeStatus === "paused" ? "warning" : "outline";
  const statusLabel =
    storeStatus === "live" ? "Live" : storeStatus === "paused" ? "Paused" : "Not live yet";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas-deep lg:flex-row">
      {/* Workspace rail */}
      <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-5 p-4 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={merchantRoutes.dashboard}
              aria-label="Bhagya Commerce — merchant workspace"
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <BrandMark variant="compact" size="sm" />
            </Link>
            <Button asChild variant="ghost" size="sm" className="lg:hidden">
              <Link href={marketingRoutes.home}>
                Shop
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3 rounded-md border border-line bg-canvas px-3 py-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-soft-green text-primary">
              <Store className="size-4" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-body-sm font-semibold text-ink">
                {storeName}
              </span>
              <Badge tone={statusTone} size="sm" className="mt-0.5 w-fit">
                {statusLabel}
              </Badge>
            </div>
          </div>

          {/* Horizontal scroll on small screens, vertical list on desktop */}
          <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0">
            <div className="lg:hidden">
              <MerchantSidebar orientation="horizontal" />
            </div>
            <div className="hidden lg:block">
              <MerchantSidebar orientation="vertical" />
            </div>
          </div>

          <div className="mt-auto hidden flex-col gap-2 border-t border-line pt-4 lg:flex">
            <Link
              href={marketingRoutes.home}
              className="flex min-h-10 items-center gap-2.5 rounded-md px-3 text-body-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-canvas-deep hover:text-primary"
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
              Back to shop
            </Link>
            <Link
              href={marketingRoutes.help}
              className="flex min-h-10 items-center gap-2.5 rounded-md px-3 text-body-sm font-medium text-ink-soft transition-colors duration-fast hover:bg-canvas-deep hover:text-primary"
            >
              <HelpCircle className="size-4" aria-hidden="true" />
              Seller help
            </Link>
          </div>
        </div>
      </aside>

      {/* Workspace content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-header border-b border-line bg-surface/90 backdrop-blur-md">
          <div className="flex h-[60px] items-center justify-between gap-4 px-4 sm:px-6">
            <p className="truncate text-body-sm font-medium text-ink-soft">
              Merchant workspace
            </p>
            <div className="flex items-center gap-1">
              <IconButton label="Notifications" tooltip="Notifications">
                <Bell aria-hidden="true" />
              </IconButton>
              <span className="ml-1.5 hidden sm:block">
                <Button asChild variant="outline" size="sm">
                  <Link href={merchantRoutes.store}>View store</Link>
                </Button>
              </span>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
