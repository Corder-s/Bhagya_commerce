import * as React from "react";

import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.ComponentProps<"div"> {
  variant?: "text" | "block" | "circle" | "media";
  /** Number of stacked text lines (text variant only). */
  lines?: number;
}

const variantStyles = {
  text: "h-3.5 rounded-xs",
  block: "h-24 rounded-md",
  circle: "rounded-pill aspect-square",
  media: "aspect-[4/5] rounded-lg",
} as const;

/**
 * Skeleton — layout-preserving placeholder.
 *
 * The shimmer is a CSS animation and therefore already neutralised by the
 * global `prefers-reduced-motion` rule, leaving a static tinted block.
 */
function Skeleton({
  className,
  variant = "text",
  lines = 1,
  ...props
}: SkeletonProps) {
  const base = cn(
    "relative overflow-hidden bg-canvas-deep",
    "before:absolute before:inset-0 before:-translate-x-full",
    "before:bg-gradient-to-r before:from-transparent before:via-surface/70 before:to-transparent",
    "before:animate-shimmer",
    variantStyles[variant],
    className,
  );

  if (variant === "text" && lines > 1) {
    return (
      <div
        data-slot="skeleton"
        aria-hidden="true"
        className="flex w-full flex-col gap-2"
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              base,
              index === lines - 1 && lines > 1 ? "w-3/5" : "w-full",
            )}
          />
        ))}
      </div>
    );
  }

  return <div data-slot="skeleton" aria-hidden="true" className={base} {...props} />;
}

/** Card-shaped skeleton used by grids of products, orders and analytics. */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-line bg-surface p-4",
        className,
      )}
    >
      <Skeleton variant="media" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-2/3" />
        <Skeleton className="w-1/3" />
      </div>
    </div>
  );
}

/** Full-page loading treatment for route-level `loading.tsx`. */
function SkeletonPage({
  title = "Loading",
  showHeader = true,
}: {
  title?: string;
  showHeader?: boolean;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="container-page flex flex-col gap-8 py-12"
    >
      <span className="sr-only">{title}</span>
      {showHeader ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonPage };
