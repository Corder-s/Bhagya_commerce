"use client";

import Link from "next/link";
import * as React from "react";

import { NavIcon } from "@/components/navigation/nav-icon";
import { accountNav } from "@/config/navigation";
import { useActivePath } from "@/hooks/use-active-path";
import { cn } from "@/lib/utils";

/**
 * AccountSidebar — customer account navigation on desktop.
 *
 * On phones the same routes are surfaced by the bottom tab bar plus the account
 * overview page, so this rail is hidden below `lg` rather than being squeezed.
 */
export function AccountSidebar({ className }: { className?: string }) {
  const { isActive } = useActivePath();

  return (
    <nav aria-label="Account" className={cn("hidden lg:block", className)}>
      <h2 className="label-text mb-3 px-3 text-ink-faint">Your account</h2>
      <ul className="flex flex-col gap-0.5">
        {accountNav.map((item) => {
          const active = isActive(item.href, { exact: item.href === "/account" });
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-md px-3 text-body-sm",
                  "transition-colors duration-fast ease-brand",
                  active
                    ? "bg-soft-green font-semibold text-primary"
                    : "font-medium text-ink-soft hover:bg-canvas-deep hover:text-ink",
                )}
              >
                {item.icon ? (
                  <NavIcon
                    name={item.icon}
                    className={cn("size-[1.125rem]", active ? "text-primary" : "text-ink-faint")}
                  />
                ) : null}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
