import { marketingRoutes } from "@/config/routes";
import type { NavItem } from "@/types/navigation";

/**
 * Primary storefront navigation — desktop centre group.
 * Kept intentionally short: five destinations, no mega-menu yet.
 */
export const primaryNav: readonly NavItem[] = [
  {
    label: "Shop",
    href: marketingRoutes.shop,
    description: "Every product, filtered your way",
  },
  {
    label: "Brands",
    href: marketingRoutes.brands,
    description: "Independent makers and their stories",
  },
  {
    label: "Collections",
    href: marketingRoutes.collections,
    description: "Curated sets for a season or a room",
  },
  {
    label: "Journal",
    href: marketingRoutes.journal,
    description: "Notes on craft, care and conscious living",
  },
] as const;

/** Right-side utility actions in the header. */
export const utilityNav: readonly NavItem[] = [
  { label: "Search", href: "/search", icon: "Search" },
  { label: "Wishlist", href: "/account/wishlist", icon: "Heart" },
  { label: "Cart", href: "/cart", icon: "ShoppingBag" },
  { label: "Account", href: "/account", icon: "UserRound" },
] as const;

/**
 * Mobile bottom tab bar — a different information architecture from the
 * desktop nav, not a shrunk copy of it.
 */
export const mobileTabNav: readonly NavItem[] = [
  { label: "Home", href: marketingRoutes.home, icon: "House" },
  { label: "Discover", href: marketingRoutes.shop, icon: "Compass" },
  { label: "Wishlist", href: "/account/wishlist", icon: "Heart" },
  { label: "Orders", href: "/account/orders", icon: "Package" },
  { label: "Account", href: "/account", icon: "UserRound" },
] as const;

/** Merchant workspace rail navigation. */
export const merchantNav: readonly NavItem[] = [
  { label: "Overview", href: "/merchant/dashboard", icon: "LayoutDashboard" },
  { label: "Products", href: "/merchant/products", icon: "Package" },
  { label: "Orders", href: "/merchant/orders", icon: "ReceiptIndianRupee" },
  { label: "Inventory", href: "/merchant/inventory", icon: "Boxes" },
  { label: "Customers", href: "/merchant/customers", icon: "Users" },
  { label: "Analytics", href: "/merchant/analytics", icon: "ChartLine" },
  { label: "Marketing", href: "/merchant/marketing", icon: "Megaphone" },
  { label: "Bhagya AI", href: "/merchant/ai", icon: "Sparkles" },
  { label: "Store", href: "/merchant/store", icon: "Store" },
  { label: "Settings", href: "/merchant/settings", icon: "Settings" },
] as const;

/** Customer account sidebar. */
export const accountNav: readonly NavItem[] = [
  { label: "Overview", href: "/account", icon: "LayoutDashboard" },
  { label: "Orders", href: "/account/orders", icon: "Package" },
  { label: "Wishlist", href: "/account/wishlist", icon: "Heart" },
  { label: "Addresses", href: "/account/addresses", icon: "MapPin" },
  { label: "Preferences", href: "/account/preferences", icon: "Settings2" },
] as const;

/**
 * Footer link columns — Shop, For Business, Company, Support.
 *
 * The brand statement is the fifth column and lives in `SiteFooter` itself,
 * because it carries the newsletter form rather than a list of links.
 */
export const footerNav = [
  {
    title: "Shop",
    links: [
      { label: "Discover", href: marketingRoutes.discover },
      { label: "All Products", href: marketingRoutes.shop },
      { label: "Categories", href: "/shop#categories" },
      { label: "Collections", href: marketingRoutes.collections },
      { label: "New Arrivals", href: "/shop?sort=newest" },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "Start Selling", href: marketingRoutes.startSelling },
      { label: "Merchant Platform", href: "/merchant" },
      { label: "Pricing & Fees", href: "/start-selling#pricing" },
      { label: "Brand Directory", href: marketingRoutes.brands },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: marketingRoutes.about },
      { label: "Journal", href: marketingRoutes.journal },
      { label: "Sustainability", href: marketingRoutes.sustainability },
      { label: "Contact", href: marketingRoutes.contact },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: marketingRoutes.help },
      { label: "Shipping", href: "/help#shipping" },
      { label: "Returns", href: "/help#returns" },
      { label: "Privacy", href: "/help#privacy" },
      { label: "Terms", href: "/help#terms" },
    ],
  },
] as const;

/** Announcement bar rotation (marketing copy, no behaviour yet). */
export const announcements: readonly string[] = [
  "Free shipping across India on orders above ₹1,499",
  "Every order plants a native tree — 41,280 planted so far",
  "Now onboarding conscious brands for the festive season",
] as const;
