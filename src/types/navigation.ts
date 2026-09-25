import type { LucideIcon } from "lucide-react";
import type { Route } from "next";

/**
 * Icon names the navigation config is allowed to reference. Keeping this as a
 * union (rather than `string`) means a typo in `config/navigation.ts` fails the
 * type-check instead of silently rendering nothing.
 */
export type NavIconName =
  | "Search"
  | "Heart"
  | "ShoppingBag"
  | "UserRound"
  | "House"
  | "Compass"
  | "Package"
  | "LayoutDashboard"
  | "ReceiptIndianRupee"
  | "Boxes"
  | "Users"
  | "ChartLine"
  | "Megaphone"
  | "Sparkles"
  | "Store"
  | "Settings"
  | "Settings2"
  | "MapPin"
  | "Bell";

export interface NavItem {
  label: string;
  /**
   * Typed route: with `typedRoutes` enabled, a typo here fails the build rather
   * than shipping a link to a 404.
   */
  href: Route;
  icon?: NavIconName;
  description?: string;
  /** Renders a small "soon" affordance and disables navigation. */
  soon?: boolean;
  /** Requires an authenticated customer session (enforced from Phase 2). */
  requiresAuth?: boolean;
}

export interface FooterColumn {
  title: string;
  links: readonly { label: string; href: Route }[];
}

/** Lucide component map used by navigation renderers. */
export type NavIconMap = Record<NavIconName, LucideIcon>;

/** Standard async UI status for Phase 1 feature stubs. */
export type LoadableStatus = "idle" | "loading" | "success" | "empty" | "error";
