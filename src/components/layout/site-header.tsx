"use client";

import { Heart, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { AccountMenu } from "@/components/navigation/account-menu";
import { DesktopNav } from "@/components/navigation/desktop-nav";
import { MobileMenuPanel } from "@/components/navigation/mobile-menu-panel";
import { SearchCommand } from "@/components/navigation/search-command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { layoutConstants } from "@/config/breakpoints";
import { primaryNav } from "@/config/navigation";
import { accountRoutes, commerceRoutes, marketingRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  /** Counts are placeholders until cart/wishlist state lands in Phase 2. */
  cartCount?: number;
  wishlistCount?: number;
  user?: { name: string; email?: string; avatarUrl?: string | null } | null;
}

/**
 * SiteHeader — sticky storefront header.
 *
 * Layout contract:
 *   desktop  left brand · centre destinations · right utilities + "Start Selling"
 *   tablet   left brand · right utilities + CTA (centre group folds away at lg)
 *   mobile   left brand, right search · cart · menu — nothing else
 *
 * The mobile bar is a separate composition, not a compressed desktop bar: the
 * five centre destinations move into the sheet behind the menu button, and
 * wishlist/account move into the bottom tab bar, which is where thumbs already
 * are. On scroll the bar only tightens and gains a hairline — the logo stays the
 * same size, because a logo that shrinks mid-scroll reads as a glitch.
 */
export function SiteHeader({
  cartCount = 0,
  wishlistCount = 0,
  user = null,
}: SiteHeaderProps) {
  const scrolled = useScrolled(layoutConstants.headerCondenseAt);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-header w-full",
        "border-b transition-[background-color,border-color,box-shadow] duration-base ease-brand",
        scrolled
          ? "border-line bg-canvas/85 shadow-sm backdrop-blur-md"
          : "border-transparent bg-canvas",
        "print:hidden",
      )}
    >
      <div className="container-wide">
        <div
          className={cn(
            "flex items-center justify-between gap-3",
            "transition-[height] duration-base ease-brand",
            scrolled ? "h-[60px] lg:h-[68px]" : "h-[var(--header-h-sm)] lg:h-[var(--header-h)]",
          )}
        >
          {/* ------------------------------------------------------- Left */}
          <Link
            href={marketingRoutes.home}
            aria-label={`${siteConfig.name} — home`}
            className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <span className="hidden sm:block">
              <BrandMark variant="compact" size="md" />
            </span>
            <span className="sm:hidden">
              <BrandMark variant="mobile" size="sm" />
            </span>
          </Link>

          {/* ----------------------------------------------------- Centre */}
          <DesktopNav items={primaryNav} className="absolute left-1/2 -translate-x-1/2" />

          {/* ------------------------------------------------------ Right */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <SearchCommand />

            <span className="relative hidden sm:inline-flex">
              <IconButton label="Wishlist" asChild>
                <Link href={accountRoutes.wishlist}>
                  <Heart aria-hidden="true" />
                </Link>
              </IconButton>
              {wishlistCount > 0 ? (
                <CountBubble count={wishlistCount} label="items in wishlist" />
              ) : null}
            </span>

            <span className="relative inline-flex">
              <IconButton label="Cart" asChild>
                <Link href={commerceRoutes.cart}>
                  <ShoppingBag aria-hidden="true" />
                </Link>
              </IconButton>
              {cartCount > 0 ? (
                <CountBubble count={cartCount} label="items in cart" />
              ) : null}
            </span>

            <span className="hidden sm:inline-flex">
              <AccountMenu user={user} />
            </span>

            <div className="ml-1.5 hidden lg:block">
              <Button asChild size="md" variant="primary">
                <Link href={marketingRoutes.startSelling}>Start Selling</Link>
              </Button>
            </div>

            {/* Mobile menu trigger — the sheet owns the rest of the navigation. */}
            <IconButton
              label="Open menu"
              className="-mr-1 lg:hidden aria-expanded:bg-soft-green aria-expanded:text-primary"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <Menu aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <MobileMenuPanel
          open={menuOpen}
          onOpenChange={setMenuOpen}
          className="lg:hidden"
        />
      ) : null}
    </header>
  );
}

/** Cart/wishlist count — announced, and capped so the header never widens. */
function CountBubble({ count, label }: { count: number; label: string }) {
  return (
    <span className="pointer-events-none absolute -right-0.5 -top-0.5">
      <Badge tone="primary" size="sm" className="px-1.5 tabular-nums">
        {count > 99 ? "99+" : count}
        <span className="sr-only"> {label}</span>
      </Badge>
    </span>
  );
}
