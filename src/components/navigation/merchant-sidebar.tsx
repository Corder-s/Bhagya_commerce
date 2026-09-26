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
 * Light mode: #FCFAF5 background, #DCE5DF active, #505A53 text, #566B60 active text.
 * Dark mode: #252925 background, #3A433D active, #D8D2C6 text, #F5F1E7 active text.
 * Active Indicator: Warm Yellow (#D7A63A).
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
                    ? "bg-[#DCE5DF] dark:bg-[#3A433D] font-semibold text-[#566B60] dark:text-[#F5F1E7] border border-[#CFC3B1] dark:border-[#5C625B] shadow-xs"
                    : "text-[#505A53] dark:text-[#D8D2C6] hover:bg-[#EDF2EE] dark:hover:bg-[#30332F] hover:text-[#20231F] dark:hover:text-[#F5F1E7]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#D7A63A] transition-opacity duration-150",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.icon ? (
                  <NavIcon
                    name={item.icon}
                    className={cn(
                      "size-[1.125rem] shrink-0 transition-colors",
                      active
                        ? "text-[#D7A63A]"
                        : "text-[#737D76] dark:text-[#B3ADA2] group-hover:text-[#566B60] dark:group-hover:text-[#F5F1E7]",
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
