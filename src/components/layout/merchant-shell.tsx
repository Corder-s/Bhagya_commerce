"use client";

import { ArrowUpRight, Bell, HelpCircle, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { MerchantSidebar } from "@/components/navigation/merchant-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { marketingRoutes, merchantRoutes } from "@/config/routes";
import { useAuth } from "@/context/auth-context";

/**
 * MerchantShell — the selling workspace.
 * Light mode: #F2EEE4 background with #FCFAF5 sidebar.
 * Dark mode: #252925 background with #30332F sidebar.
 */
export function MerchantShell({
  children,
  storeName,
  storeStatus,
}: {
  children: React.ReactNode;
  storeName?: string;
  storeStatus?: "not-live" | "live" | "paused";
}) {
  const { user } = useAuth();

  const activeStoreName =
    storeName || user?.organizationMembership?.storeName || "Varanasi Heritage Silks";
  const activeStoreStatus =
    storeStatus || (user?.organizationMembership?.storeId ? "live" : "not-live");

  const statusTone =
    activeStoreStatus === "live" ? "success" : activeStoreStatus === "paused" ? "warning" : "neutral";
  const statusLabel =
    activeStoreStatus === "live" ? "Live" : activeStoreStatus === "paused" ? "Paused" : "Not live yet";

  return (
    <div className="flex min-h-dvh flex-col bg-background text-ink lg:flex-row antialiased selection:bg-[#DCE5DF] dark:selection:bg-[#3A433D] selection:text-[#20231F] dark:selection:text-[#F5F1E7]">
      {/* Workspace rail */}
      <aside
        className="border-b border-line bg-surface dark:bg-[#252925] lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:overflow-y-auto"
      >
        <div className="flex h-full flex-col gap-5 p-4 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={merchantRoutes.dashboard}
              aria-label="Bhagya Commerce — merchant workspace"
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7A63A]"
            >
              <BrandMark variant="compact" size="sm" />
            </Link>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="lg:hidden text-ink-soft hover:text-primary hover:bg-[#EDF2EE] dark:hover:bg-[#30332F]"
            >
              <Link href={marketingRoutes.home}>
                Shop
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Store context block */}
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 border border-line bg-[#EDF2EE] dark:bg-[#30332F] shadow-xs">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface dark:bg-[#373B36] text-primary border border-line">
              <Store className="size-4 text-[#D7A63A]" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-ink">
                {activeStoreName}
              </span>
              <Badge tone={statusTone} size="sm" className="mt-0.5 w-fit">
                {statusLabel}
              </Badge>
            </div>
          </div>

          {/* Horizontal scroll on small screens, vertical list on desktop */}
          <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:overflow-visible lg:px-0 no-scrollbar">
            <div className="lg:hidden">
              <MerchantSidebar orientation="horizontal" />
            </div>
            <div className="hidden lg:block">
              <MerchantSidebar orientation="vertical" />
            </div>
          </div>

          <div className="mt-auto hidden flex-col gap-1.5 border-t border-line pt-4 lg:flex">
            <Link
              href={marketingRoutes.home}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-[#EDF2EE] dark:hover:bg-[#30332F] hover:text-ink"
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
              Back to shop
            </Link>
            <Link
              href={marketingRoutes.help}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-ink-soft transition-colors hover:bg-[#EDF2EE] dark:hover:bg-[#30332F] hover:text-ink"
            >
              <HelpCircle className="size-4" aria-hidden="true" />
              Seller help
            </Link>
          </div>
        </div>
      </aside>

      {/* Workspace content */}
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="sticky top-0 z-40 border-b border-line bg-surface/90 dark:bg-[#252925]/90 backdrop-blur-md">
          <div className="flex h-[60px] items-center justify-between gap-4 px-4 sm:px-6">
            <p className="truncate text-sm font-medium text-ink-soft">
              Merchant Workspace
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <IconButton
                label="Notifications"
                tooltip="Notifications"
                className="text-ink-soft hover:text-ink hover:bg-[#EDF2EE] dark:hover:bg-[#30332F]"
              >
                <Bell aria-hidden="true" />
              </IconButton>
              <Button asChild variant="outline" size="sm" className="border-line bg-surface hover:bg-[#EDF2EE] dark:hover:bg-[#30332F]">
                <Link href={merchantRoutes.store}>View store</Link>
              </Button>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
