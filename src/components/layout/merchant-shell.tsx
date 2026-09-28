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
import { cn } from "@/lib/utils";

/**
 * MerchantShell — the selling workspace.
 * Light mode: Warm Nude Silk canvas (#FDF8F3) with Porcelain White sidebar (#FFFFFF).
 * Dark mode: Deep Espresso Velvet canvas (#1B120E) with Layered Cocoa sidebar (#261B15).
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
    <div className="flex min-h-dvh flex-col bg-[#F3EFE6] dark:bg-[#1B120E] text-[#252923] dark:text-[#F2EEE5] lg:flex-row antialiased selection:bg-[#FCECDA] dark:selection:bg-[#33241C] selection:text-[#1F1510] dark:selection:text-[#FAF4EE]">
      {/* Workspace rail */}
      <aside
        className="border-b border-[#47362E] bg-[#30231C] lg:sticky lg:top-0 lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:overflow-y-auto"
      >
        <div className="flex h-full flex-col gap-5 p-4 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={merchantRoutes.dashboard}
              aria-label="Bhagya Commerce — merchant workspace"
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E0A046]"
            >
              <BrandMark variant="compact" size="sm" />
            </Link>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="lg:hidden text-[#CFC7BA] hover:text-[#FFFFFF] hover:bg-[#3D322B]"
            >
              <Link href={marketingRoutes.home}>
                Shop
                <ArrowUpRight aria-hidden="true" className="text-[#E0A046]" />
              </Link>
            </Button>
          </div>

          {/* Store context block */}
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-3 border border-[#47362E] bg-[#241A14] shadow-xs">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#382A22] text-[#E0A046] border border-[#47362E]">
              <Store className="size-4 text-[#E0A046]" aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-bold text-[#F2EEE5]" title={activeStoreName}>
                {activeStoreName}
              </span>
              <span
                className={cn(
                  "mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit",
                  activeStoreStatus === "live"
                    ? "bg-[#DDEBE1] text-[#2D5E3A] border border-[#B8D9C0]"
                    : activeStoreStatus === "paused"
                    ? "bg-[#FDF3E7] text-[#A87832] border border-[#ECCFA6]"
                    : "bg-[#F3E8D5] text-[#5F4B25] border border-[#D7C6A8]",
                )}
              >
                {activeStoreStatus === "live" ? "Store Live" : activeStoreStatus === "paused" ? "Paused" : "Not Live Yet"}
              </span>
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

          <div className="mt-auto hidden flex-col gap-1.5 border-t border-[#47362E] pt-4 lg:flex">
            <Link
              href={marketingRoutes.home}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-[#CFC7BA] transition-colors hover:bg-[#3D322B] hover:text-[#FFFFFF]"
            >
              <ArrowUpRight className="size-4 text-[#E0A046]" aria-hidden="true" />
              Back to shop
            </Link>
            <Link
              href={marketingRoutes.help}
              className="flex min-h-10 items-center gap-2.5 rounded-lg px-3 text-sm font-medium text-[#CFC7BA] transition-colors hover:bg-[#3D322B] hover:text-[#FFFFFF]"
            >
              <HelpCircle className="size-4 text-[#E0A046]" aria-hidden="true" />
              Seller help
            </Link>
          </div>
        </div>
      </aside>

      {/* Workspace content */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#F3EFE6] dark:bg-[#1B120E]">
        <header className="sticky top-0 z-40 border-b border-[#47362E] bg-[#302821] backdrop-blur-md">
          <div className="flex h-[60px] items-center justify-between gap-4 px-4 sm:px-6">
            <p className="truncate text-base font-bold text-[#F6F1E7]">
              Merchant Workspace
            </p>
            <div className="flex items-center gap-2.5">
              <ThemeToggle />
              <IconButton
                label="Notifications"
                tooltip="Notifications"
                className="text-[#D4CDC1] hover:text-[#FFFFFF] hover:bg-[#3D342C]"
              >
                <Bell aria-hidden="true" className="size-4 text-[#E3B24D]" />
              </IconButton>
              <Button asChild size="sm" className="bg-[#E0A046] hover:bg-[#CC8930] text-[#241F19] font-bold border-0 shadow-sm transition-all">
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
