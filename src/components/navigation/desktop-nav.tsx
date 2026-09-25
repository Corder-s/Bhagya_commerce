"use client";

import Link from "next/link";
import * as React from "react";

import { useActivePath } from "@/hooks/use-active-path";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/navigation";

/**
 * DesktopNav — the centre of the header: Discover · Shop · Brands · Collections · Journal.
 *
 * Each destination is a text link with an underline that grows on hover, and an
 * active state driven by the pathname rather than by colour alone: the active
 * item also carries `aria-current="page"`, which is what assistive tech reads.
 */
export function DesktopNav({
  items,
  className,
}: {
  items: readonly NavItem[];
  className?: string;
}) {
  const { isActive } = useActivePath();

  // Two destinations can resolve to the same route before every section has its
  // own page (Discover and Shop both resolve to /shop today). Only the first
  // match claims the active state, so the bar never shows two current items.
  const claimed = new Set<string>();

  return (
    <nav aria-label="Primary" className={cn("hidden lg:block", className)}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const active = isActive(item.href) && !claimed.has(item.href);
          if (active) claimed.add(item.href);

          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative inline-flex min-h-11 items-center px-3.5 text-body-sm font-medium",
                  "transition-colors duration-fast ease-brand",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  active ? "text-primary font-semibold" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3.5 bottom-2 h-0.5 origin-left bg-gradient-to-r from-[#C49A45] to-[#B18332] transition-transform duration-base ease-brand",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
