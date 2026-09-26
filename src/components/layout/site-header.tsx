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
        "sticky top-0 z-header w-full bg-[#566B60] dark:bg-[#1D211E] text-[#F5F1E7] border-b border-[#43544B] dark:border-[#30332F]",
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
              className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#D7A63A] rounded-lg"
            >
              <BrandMark variant="full" size="md" />
            </Link>

            {/* All Categories Dropdown Trigger */}
            <Link
              href="/shop"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#47584F] dark:bg-[#252925] hover:bg-[#3E4D45] dark:hover:bg-[#30332F] border border-[#637A6E] dark:border-[#3E433D] hover:border-[#D7A63A]/60 text-xs font-medium text-[#F5F1E7] transition-colors"
            >
              <LayoutGrid className="size-3.5 text-[#D7A63A]" />
              <span>All Categories</span>
              <ChevronDown className="size-3 text-[#D8D2C6]" />
            </Link>
          </div>

          {/* ------------------------------------------------ Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2 lg:mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for organic products, brands, stores and more..."
                className="w-full h-10 pl-4 pr-11 rounded-full bg-[#FCFAF5] dark:bg-[#30332F] border border-[#DDD4C4] dark:border-[#4B514B] text-[#20231F] dark:text-[#F5F1E7] placeholder:text-[#737D76] dark:placeholder:text-[#B3ADA2] text-xs sm:text-sm focus:outline-none focus:border-[#708477] dark:focus:border-[#A8B9AF] focus:ring-2 focus:ring-[#D7A63A]/30 transition-all"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-1 top-1 size-8 rounded-full bg-[#D7A63A] hover:bg-[#C28F27] text-[#20231F] font-bold grid place-items-center transition-colors cursor-pointer shadow-xs"
              >
                <Search className="size-4" />
              </button>
            </div>
          </div>

          {/* ------------------------------------------------ Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-medium">
            {/* Mobile Search Trigger */}
            <div className="md:hidden">
              <SearchCommand className="text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10" />
            </div>

            {/* Sell on Bhagya */}
            <Link
              href={merchantRoutes.root}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10 transition-colors"
            >
              <Store className="size-4 text-[#D7A63A]" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-[#F5F1E7]">Sell on Bhagya</span>
                <span className="text-[10px] text-[#D8D2C6]">Open Your Store</span>
              </div>
            </Link>

            {/* Orders */}
            <Link
              href="/account/orders"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10 transition-colors"
            >
              <Package className="size-4 text-[#D7A63A]" />
              <span className="hidden xl:inline text-[#F5F1E7]">Orders</span>
            </Link>

            {/* Notifications */}
            <Link
              href={"/notifications" as any}
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10 transition-colors"
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
              <Bell className="size-4 text-[#D8D2C6] hover:text-[#F5F1E7]" />
              <span className="hidden xl:inline text-[#F5F1E7]">Alerts</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D7A63A] text-[#20231F] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10 transition-colors"
            >
              <Heart className="size-4 text-[#D8D2C6] hover:text-[#F5F1E7]" />
              <span className="hidden xl:inline text-[#F5F1E7]">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D7A63A] text-[#20231F] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={() => openCartDrawer()}
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10 transition-colors cursor-pointer"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="size-4 text-[#D7A63A]" />
              <span className="hidden xl:inline text-[#F5F1E7]">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D7A63A] text-[#20231F] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <ThemeToggle />

            {/* Account dropdown / Avatar */}
            <div className="flex items-center pl-1 border-l border-[#47584F] dark:border-[#373B36]">
              <AccountMenu />
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#D8D2C6] hover:text-[#F5F1E7] hover:bg-white/10"
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
