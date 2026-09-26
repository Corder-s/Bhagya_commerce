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
import { marketingRoutes, merchantRoutes } from "@/config/routes";
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
        "sticky top-0 z-header w-full bg-[#53695F] dark:bg-[#1D2522] text-[#FCFBF7] border-b border-[#3E4F47] dark:border-[#34403A]",
        "transition-all duration-base ease-brand",
        scrolled ? "shadow-md shadow-black/15 dark:shadow-black/35" : "",
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
              className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#9BAFA3] rounded-lg"
            >
              <BrandMark variant="full" size="md" />
            </Link>

            {/* All Categories Dropdown Trigger */}
            <Link
              href="/shop"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#3E4F47] dark:bg-[#27312D] hover:bg-[#34403A] dark:hover:bg-[#34403A] border border-[#5F756B] dark:border-[#48534D] hover:border-[#9BAFA3]/50 text-xs font-medium text-[#FCFBF7] transition-colors"
            >
              <LayoutGrid className="size-3.5 text-[#DCE5DF]" />
              <span>All Categories</span>
              <ChevronDown className="size-3 text-[#CCD2CB]" />
            </Link>
          </div>

          {/* ------------------------------------------------ Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for organic products, brands, stores and more..."
                className="w-full h-10 pl-4 pr-11 rounded-full bg-[#FCFBF7] dark:bg-[#27312D] border border-[#DDD5C7] dark:border-[#48534D] text-[#202420] dark:text-[#F3F1E8] placeholder:text-[#7D877F] dark:placeholder:text-[#A7B0A9] text-xs sm:text-sm focus:outline-none focus:border-[#71877B] dark:focus:border-[#9BAFA3] focus:ring-2 focus:ring-[#71877B]/25 transition-all"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-1 top-1 size-8 rounded-full bg-[#71877B] hover:bg-[#53695F] text-[#FCFBF7] grid place-items-center transition-colors cursor-pointer"
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------ Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium">
            {/* Mobile Search Trigger */}
            <div className="md:hidden">
              <SearchCommand className="text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10" />
            </div>

            {/* Sell on Bhagya */}
            <Link
              href={merchantRoutes.root}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10 transition-colors"
            >
              <Store className="size-4 text-[#DCE5DF]" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-[#FCFBF7]">Sell on Bhagya</span>
                <span className="text-[10px] text-[#DCE5DF]">Open Your Store</span>
              </div>
            </Link>

            {/* Orders */}
            <Link
              href="/account/orders"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10 transition-colors"
            >
              <Package className="size-4 text-[#DCE5DF]" />
              <span className="hidden xl:inline text-[#FCFBF7]">Orders</span>
            </Link>

            {/* Notifications */}
            <Link
              href={"/notifications" as any}
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10 transition-colors"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="size-4 text-[#CCD2CB] hover:text-[#FCFBF7]" />
              <span className="hidden xl:inline text-[#FCFBF7]">Alerts</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#71877B] text-[#FCFBF7] text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10 transition-colors"
            >
              <Heart className="size-4 text-[#CCD2CB] hover:text-[#FCFBF7]" />
              <span className="hidden xl:inline text-[#FCFBF7]">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#71877B] text-[#FCFBF7] text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="size-4 text-[#DCE5DF]" />
              <span className="hidden xl:inline text-[#FCFBF7]">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#71877B] text-[#FCFBF7] text-[10px] font-bold flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle />

            {/* Account dropdown / Avatar */}
            <div className="flex items-center pl-1 border-l border-[#3E4F47] dark:border-[#34403A]">
              <AccountMenu />
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#CCD2CB] hover:text-[#FCFBF7] hover:bg-white/10"
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
