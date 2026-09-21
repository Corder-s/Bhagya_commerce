import type { Route } from "next";

/**
 * Route registry.
 *
 * Routes are declared once, here, and referenced everywhere else (nav, footer,
 * sitemap, breadcrumbs, redirects). This keeps Phase 1 link targets honest —
 * nothing links to a path that does not exist — and makes later phases a matter
 * of filling in pages rather than hunting for strings.
 */

/* ---------------------------------- Shop --------------------------------- */
export const marketingRoutes = {
  home: "/",
  discover: "/shop",
  shop: "/shop",
  brands: "/brands",
  collections: "/collections",
  journal: "/journal",
  search: "/search",
  startSelling: "/start-selling",
  about: "/about",
  contact: "/contact",
  help: "/help",
  faq: "/faq",
  sustainability: "/sustainability",
  sellOnBhagya: "/start-selling",
  product: (slug: string) => `/products/${slug}` as Route,
} as const;

/* ---------------------------------- Auth --------------------------------- */
export const authRoutes = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
} as const;

/* -------------------------------- Customer ------------------------------- */
export const accountRoutes = {
  root: "/account",
  orders: "/account/orders",
  wishlist: "/account/wishlist",
  addresses: "/account/addresses",
  preferences: "/account/preferences",
} as const;

/* -------------------------------- Commerce ------------------------------- */
export const commerceRoutes = {
  cart: "/cart",
  checkout: "/checkout",
  payment: "/payment",
  orderSuccess: "/order-success",
  orders: "/account/orders",
  order: (id: string) => `/orders/${id}` as Route,
  orderTracking: (id: string) => `/orders/${id}/tracking` as Route,
} as const;

/* -------------------------------- Merchant ------------------------------- */
export const merchantRoutes = {
  root: "/merchant",
  onboarding: "/merchant/onboarding",
  dashboard: "/merchant/dashboard",
  products: "/merchant/products",
  product: (id: string) => `/merchant/products/${id}` as Route,
  orders: "/merchant/orders",
  order: (id: string) => `/merchant/orders/${id}` as Route,
  inventory: "/merchant/inventory",
  customers: "/merchant/customers",
  analytics: "/merchant/analytics",
  marketing: "/merchant/marketing",
  ai: "/merchant/ai",
  store: "/merchant/store",
  settings: "/merchant/settings",
} as const;

export const routeGroups = {
  marketing: "marketing",
  shop: "shop",
  auth: "auth",
  customer: "customer",
  merchant: "merchant",
} as const;

export type RouteGroup = (typeof routeGroups)[keyof typeof routeGroups];

/**
 * Resolves which application shell a pathname belongs to.
 * The merchant workspace gets its own chrome; auth gets a minimal, distraction
 * free shell; everything else shares the storefront shell.
 */
export function resolveRouteGroup(pathname: string): RouteGroup {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path.startsWith("/merchant")) return routeGroups.merchant;
  if (
    [
      authRoutes.login,
      authRoutes.register,
      authRoutes.forgotPassword,
      authRoutes.verifyOtp,
      authRoutes.resetPassword,
    ].includes(path as (typeof authRoutes)[keyof typeof authRoutes])
  ) {
    return routeGroups.auth;
  }
  if (path.startsWith("/account") || path.startsWith("/orders")) {
    return routeGroups.customer;
  }
  if (path.startsWith("/cart") || path.startsWith("/checkout")) {
    return routeGroups.shop;
  }
  return routeGroups.marketing;
}

/** Public, indexable routes for `sitemap.ts` (Phase 1: static surfaces only). */
export const publicRoutes: readonly string[] = [
  marketingRoutes.home,
  marketingRoutes.shop,
  marketingRoutes.brands,
  marketingRoutes.collections,
  marketingRoutes.journal,
  marketingRoutes.startSelling,
  marketingRoutes.about,
  marketingRoutes.contact,
  marketingRoutes.help,
  marketingRoutes.faq,
  marketingRoutes.sustainability,
  authRoutes.login,
  authRoutes.register,
];

/** Routes that must never be indexed or crawled. */
export const privateRoutePrefixes: readonly string[] = [
  "/account",
  "/orders",
  "/cart",
  "/checkout",
  "/payment",
  "/merchant",
  "/verify-otp",
  "/reset-password",
  "/forgot-password",
];
