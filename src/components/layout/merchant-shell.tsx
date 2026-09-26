"use client";

import { ArrowUpRight, Bell, HelpCircle, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { MerchantSidebar } from "@/components/navigation/merchant-sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { marketingRoutes, merchantRoutes } from "@/config/routes";
import { useAuth } from "@/context/auth-context";

/**
 * MerchantShell — the selling workspace.
 * Uses the designated Soft Charcoal system (#24231F / #1C1B18 / #2B2A25).
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
    <div className="flex min-h-dvh flex-col bg-[#24231F] text-[#F5F1E8] lg:flex-row antialiased selection:bg-[#C49A45] selection:text-[#151515]">
      {/* Workspace rail — dark header/nav #1C1B18 with soft border */}
      <aside
        data-surface="inverse"
        className="border-b border-[#444139] bg-[#1C1B18] lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:overflow-y-auto"
      >
        <div className="flex h-full flex-col gap-5 p-4 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={merchantRoutes.dashboard}
              aria-label="Bhagya Commerce — merchant workspace"
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C49A45]"
            >
              <BrandMark variant="compact" size="sm" />
            </Link>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="lg:hidden text-[#C8C1B4] hover:text-[#C49A45] hover:bg-[#2B2A25]"
            >
              <Link href={marketingRoutes.home}>
                Shop
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Store context block */}
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 border border-[#444139] bg-[#2B2A25] shadow-xs">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#35332C] text-[#C49A45] border border-[#5B533F]">
              <Store className="size-4" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-semibold text-[#F5F1E8]">
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

          <div className="mt-auto hidden flex-col gap-1.5 border-t border-[#3A3831] pt-4 lg:flex">
            <Link
              href={marketingRoutes.home}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-[#C8C1B4] transition-colors hover:bg-[#2B2A25] hover:text-[#C49A45]"
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
              Back to shop
            </Link>
            <Link
              href={marketingRoutes.help}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-[#C8C1B4] transition-colors hover:bg-[#2B2A25] hover:text-[#C49A45]"
            >
              <HelpCircle className="size-4" aria-hidden="true" />
              Seller help
            </Link>
          </div>
        </div>
      </aside>

      {/* Workspace content */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#24231F]">
        <header className="sticky top-0 z-40 border-b border-[#3A3831] bg-[#1C1B18]/95 backdrop-blur-md">
          <div className="flex h-[60px] items-center justify-between gap-4 px-4 sm:px-6">
            <p className="truncate text-sm font-medium text-[#C8C1B4]">
              Merchant Workspace
            </p>
            <div className="flex items-center gap-2">
              <IconButton
                label="Notifications"
                tooltip="Notifications"
                className="text-[#C8C1B4] hover:text-[#C49A45] hover:bg-[#2B2A25]"
              >
                <Bell aria-hidden="true" />
              </IconButton>
              <Button asChild variant="outline" size="sm" className="border-[#444139] bg-[#2B2A25] text-[#F5F1E8] hover:bg-[#302F29] hover:border-[#5B533F]">
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
