import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.ComponentProps<"div"> {
  /** Lucide icon or small illustration. Decorative — hidden from AT. */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary recovery path, e.g. "Browse products". */
  action?: { label: string; href?: Route; onClick?: () => void };
  /** Lower-emphasis secondary path. */
  secondaryAction?: { label: string; href?: Route; onClick?: () => void };
  size?: "sm" | "md" | "lg";
  /** Heading level for the title — use `h1` when this is the page's main content. */
  titleAs?: "h1" | "h2" | "h3";
  tone?: "default" | "botanical";
}

const sizeStyles = {
  sm: { wrap: "gap-3 py-8 px-4", frame: "size-11", title: "text-heading-md" },
  md: { wrap: "gap-4 py-12 px-5", frame: "size-14", title: "text-heading-lg" },
  lg: { wrap: "gap-5 py-16 px-6", frame: "size-16", title: "text-heading-xl" },
} as const;

/**
 * EmptyState — the "nothing here yet" surface.
 *
 * Always explains *why* it is empty and offers a next step; never a lone
 * illustration. Used by wishlist, orders, search, inventory and analytics.
 */
function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  tone = "botanical",
  titleAs: Title = "h2",
  className,
  children,
  ...props
}: EmptyStateProps) {
  const styles = sizeStyles[size];

  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        styles.wrap,
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className={cn(
            "grid place-items-center rounded-pill border",
            tone === "botanical"
              ? "border-line bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold"
              : "border-line bg-canvas-deep text-ink-soft",
            styles.frame,
            "[&_svg]:size-5",
          )}
        >
          {icon}
        </span>
      ) : null}

      <div className="flex max-w-md flex-col gap-2">
        <Title className={cn("text-ink", styles.title)}>{title}</Title>
        {description ? (
          <p className="text-body-sm text-ink-soft">{description}</p>
        ) : null}
      </div>

      {children}

      {action || secondaryAction ? (
        <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
          {action ? (
            action.href ? (
              <Button asChild>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick}>{action.label}</Button>
            )
          ) : null}
          {secondaryAction ? (
            secondaryAction.href ? (
              <Button asChild variant="ghost">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { EmptyState };
