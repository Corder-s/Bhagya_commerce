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
 * Light mode: #FCFBF7 surface, #DCE5DF active, #3E4942 text, #53695F active text.
 * Dark mode: #27312D surface, #3C4D45 active, #CCD2CB text, #E1E9E3 active text.
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
                    ? "bg-[#DCE5DF] dark:bg-[#3C4D45] font-semibold text-[#53695F] dark:text-[#E1E9E3] border border-[#B5C7BD] dark:border-[#59665E] shadow-xs"
                    : "text-[#3E4942] dark:text-[#CCD2CB] hover:bg-[#EEF3EF] dark:hover:bg-[#34403A] hover:text-[#202420] dark:hover:text-[#F3F1E8]",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-2 left-0 w-1 rounded-r-full bg-[#71877B] dark:bg-[#9BAFA3] transition-opacity duration-150",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.icon ? (
                  <NavIcon
                    name={item.icon}
                    className={cn(
                      "size-[1.125rem] shrink-0 transition-colors",
                      active
                        ? "text-[#53695F] dark:text-[#9BAFA3]"
                        : "text-[#7D877F] dark:text-[#A7B0A9] group-hover:text-[#53695F] dark:group-hover:text-[#9BAFA3]",
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
