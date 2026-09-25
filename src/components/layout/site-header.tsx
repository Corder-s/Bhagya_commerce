"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Heart,
  ShoppingBag,
  Store,
  Package,
  Search,
  ChevronDown,
  LayoutGrid,
  Menu,
} from "lucide-react";

import { BrandMark } from "@/components/common/brand-mark";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { AccountMenu } from "@/components/navigation/account-menu";
import { MobileMenuPanel } from "@/components/navigation/mobile-menu-panel";
import { SearchCommand } from "@/components/navigation/search-command";
import { marketingRoutes, commerceRoutes, merchantRoutes } from "@/config/routes";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useNotifications } from "@/hooks/use-notifications";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";

export interface SiteHeaderProps {
  cartCount?: number;
  wishlistCount?: number;
}

export function SiteHeader({
  cartCount: propCartCount,
  wishlistCount: propWishlistCount,
}: SiteHeaderProps = {}) {
  const scrolled = useScrolled(12);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { cartCount: ctxCartCount, openCartDrawer } = useCart();
  const { wishlistCount: ctxWishlistCount } = useWishlist();
  const { unreadCount } = useNotifications();

  const cartCount = propCartCount ?? ctxCartCount;
  const wishlistCount = propWishlistCount ?? ctxWishlistCount;

  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-header w-full bg-gradient-to-b from-[#151515] to-[#1D1C19] text-[#FFFDF8] border-b border-[#26241F]",
        "transition-all duration-base ease-brand",
        scrolled ? "shadow-md shadow-black/25" : "",
        "print:hidden",
      )}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between gap-3 h-[68px] sm:h-[72px]">
          {/* ------------------------------------------------ Left: Brand & Categories */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link
              href={marketingRoutes.home}
              aria-label="Bhagya Commerce — Home"
              className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#C49A45] rounded-lg"
            >
              <BrandMark variant="full" size="md" />
            </Link>

            {/* All Categories Dropdown Trigger */}
            <Link
              href="/shop"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#26241F] hover:bg-[#33302A] border border-[#33302A] hover:border-[#C49A45]/50 text-xs font-medium text-zinc-200 transition-colors"
            >
              <LayoutGrid className="size-3.5 text-[#C49A45]" />
              <span>All Categories</span>
              <ChevronDown className="size-3 text-zinc-400" />
            </Link>
          </div>

          {/* ------------------------------------------------ Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for organic products, brands, stores and more..."
                className="w-full h-10 pl-4 pr-11 rounded-full bg-[#FFFDF8] border border-[#E5D9C5] text-[#181818] placeholder:text-[#858078] text-xs sm:text-sm focus:outline-none focus:border-[#C49A45] focus:ring-2 focus:ring-[#C49A45]/25 transition-all"
                onFocus={(e) => {
                  // Trigger shortcut or modal search if needed
                }}
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-1 top-1 size-8 rounded-full bg-[#C49A45] hover:bg-[#9A6A20] text-[#151515] grid place-items-center transition-colors cursor-pointer"
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------ Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium">
            {/* Mobile Search Trigger */}
            <div className="md:hidden">
              <SearchCommand className="text-zinc-300 hover:text-white hover:bg-white/10" />
            </div>

            {/* Sell on Bhagya */}
            <Link
              href={merchantRoutes.root}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Store className="size-4 text-[#C49A45]" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-white">Sell on Bhagya</span>
                <span className="text-[10px] text-zinc-400">Open Your Store</span>
              </div>
            </Link>

            {/* Orders */}
            <Link
              href="/account/orders"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Package className="size-4 text-[#C49A45]" />
              <span className="hidden xl:inline">Orders</span>
            </Link>

            {/* Notifications */}
            <Link
              href={"/notifications" as any}
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="size-4 text-zinc-300 hover:text-[#C49A45]" />
              <span className="hidden xl:inline">Alerts</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C49A45] text-[#151515] text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Heart className="size-4 text-zinc-300 hover:text-[#C49A45]" />
              <span className="hidden xl:inline">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C49A45] text-[#151515] text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="size-4 text-[#C49A45]" />
              <span className="hidden xl:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#C49A45] text-[#151515] text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle />

            {/* Account dropdown / Avatar */}
            <div className="flex items-center pl-1 border-l border-[#33302A]">
              <AccountMenu />
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu sheet */}
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
