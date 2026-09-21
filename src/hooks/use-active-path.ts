"use client";

import { usePathname } from "next/navigation";

/**
 * Active-route helpers for navigation.
 *
 * Matching rules:
 *  - `/`            matches only the home route
 *  - `/shop`        matches `/shop` and its descendants (`/shop/…`)
 *  - exact=false    opt into ancestor matching for section roots
 */
export function useActivePath(): {
  pathname: string;
  isActive: (href: string, options?: { exact?: boolean }) => boolean;
} {
  const pathname = usePathname();

  const isActive = (href: string, { exact = false }: { exact?: boolean } = {}) => {
    const clean = href.split("?")[0]?.split("#")[0] ?? href;
    if (clean === "/") return pathname === "/";
    return exact ? pathname === clean : pathname.startsWith(clean);
  };

  return { pathname, isActive };
}
