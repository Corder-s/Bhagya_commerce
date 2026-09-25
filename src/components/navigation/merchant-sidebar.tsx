"use client";

import Link from "next/link";
import * as React from "react";

import { NavIcon } from "@/components/navigation/nav-icon";
import { merchantNav } from "@/config/navigation";
import { useActivePath } from "@/hooks/use-active-path";
import { cn } from "@/lib/utils";

/**
 * MerchantSidebar — workspace navigation for a store owner.
 *
 * Structurally separate from the storefront: no cart, no wishlist, no
 * editorial nav. Those would be noise in an operational context. A merchant who
 * also shops uses the "back to shop" affordance, which reinforces the one-user
 * identity model rather than treating the workspace as a different account.
 *
 * The active item uses `aria-current="page"` plus a filled rail and a green
 * surface, so state is triple-coded (fill, weight, ARIA).
 */
export function MerchantSidebar({
  className,
  orientation = "vertical",
}: {
  className?: string;
  /** Horizontal scroller on phones, vertical rail from `lg` up. */
  orientation?: "vertical" | "horizontal";
}) {
  const { isActive } = useActivePath();

  return (
    <nav aria-label="Merchant workspace" className={cn(className)}>
      <ul
        className={cn(
          "flex gap-0.5",
          orientation === "horizontal"
            ? "flex-row items-center"
            : "flex-col",
        )}
      >
        {merchantNav.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex min-h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm font-medium",
                  "transition-all duration-150 ease-out",
                  active
                    ? "bg-gold/15 font-semibold text-gold border border-gold/30 shadow-xs"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-2 left-0 w-1 rounded-r-full bg-gold transition-opacity duration-150",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.icon ? (
                  <NavIcon
                    name={item.icon}
                    className={cn(
                      "size-[1.125rem] shrink-0 transition-colors",
                      active ? "text-gold" : "text-zinc-400 group-hover:text-gold",
                    )}
                  />
                ) : null}
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
