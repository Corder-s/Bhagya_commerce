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
 * Light mode: #FDF8F3 background, #FCECDA active, #695A50 text, #1F1510 active text.
 * Dark mode: #1B120E background, #33241C active, #D4C4B6 text, #FAF4EE active text.
 * Active Indicator: Glowing Amber (#E89535 / #F0A349).
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
                    ? "bg-[#4A4038] font-bold text-[#FFFFFF] border border-[#5C4E44] shadow-xs"
                    : "text-[#CFC7BA] font-medium hover:bg-[#3D322B] hover:text-[#FFFFFF]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#E0A046] transition-opacity duration-150",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.icon ? (
                  <NavIcon
                    name={item.icon}
                    className={cn(
                      "size-[1.125rem] shrink-0 transition-colors",
                      active
                        ? "text-[#E0A046]"
                        : "text-[#CFC7BA] group-hover:text-[#E0A046]",
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
