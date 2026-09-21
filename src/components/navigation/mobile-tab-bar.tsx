"use client";

import Link from "next/link";
import * as React from "react";

import { NavIcon } from "@/components/navigation/nav-icon";
import { mobileTabNav } from "@/config/navigation";
import { useActivePath } from "@/hooks/use-active-path";
import { cn } from "@/lib/utils";

/**
 * MobileTabBar — the phone navigation, built for thumbs.
 *
 * This is a different information architecture from the desktop nav, not a
 * shrunken copy: five high-frequency destinations, each a 64px-tall target with
 * a label under the icon (labels keep it usable for everyone, including users
 * who cannot distinguish the icons). The active tab is marked by colour, a
 * bolder label **and** `aria-current`, so the state is not colour-only.
 *
 * Hidden from `lg` up and from print; the desktop header takes over there.
 */
export function MobileTabBar() {
  const { isActive } = useActivePath();

  return (
    <nav
      aria-label="Primary mobile"
      className={cn(
        "fixed inset-x-0 bottom-0 z-header lg:hidden",
        "border-t border-line bg-surface/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom)]",
        "print:hidden",
      )}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {mobileTabNav.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={`${item.href}-${item.label}`}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-[var(--tabbar-h)] flex-col items-center justify-center gap-1",
                  "text-[0.6875rem] font-medium",
                  "transition-colors duration-fast ease-brand",
                  active ? "text-primary" : "text-ink-soft hover:text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-0 h-0.5 w-8 rounded-pill bg-primary transition-opacity duration-base",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                {item.icon ? (
                  <NavIcon
                    name={item.icon}
                    className="size-[1.375rem]"
                    strokeWidth={active ? 2 : 1.75}
                  />
                ) : null}
                <span className={cn(active && "font-semibold")}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
