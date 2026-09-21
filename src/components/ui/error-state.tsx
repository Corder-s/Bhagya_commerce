"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps extends React.ComponentProps<"div"> {
  title?: string;
  description?: string;
  /** Digest from the server, shown small so users can quote it in support. */
  digest?: string;
  onRetry?: () => void;
  retryLabel?: string;
  /** Rendered as a secondary escape hatch (e.g. "Back to shop"). */
  secondaryAction?: React.ReactNode;
  /** `inline` is for a failed widget; `page` fills a route segment. */
  layout?: "inline" | "page";
  size?: "sm" | "md" | "lg";
  /** Heading level for the title — use `h1` on a route-level error page. */
  titleAs?: "h1" | "h2" | "h3";
}

const sizeStyles = {
  sm: { wrap: "gap-3 py-8 px-4", title: "text-heading-md", frame: "size-11" },
  md: { wrap: "gap-4 py-12 px-5", title: "text-heading-lg", frame: "size-14" },
  lg: { wrap: "gap-5 py-16 px-6", title: "text-heading-xl", frame: "size-16" },
} as const;

/**
 * ErrorState — recoverable failure UI.
 *
 * Rules it follows: say what failed in plain language, always offer a retry,
 * surface the error digest for support, and mark the region as an alert so it
 * is announced when it appears. Colour is reinforced by an icon and copy.
 */
function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this just now. It's usually temporary — try again in a moment.",
  digest,
  onRetry,
  retryLabel = "Try again",
  secondaryAction,
  layout = "inline",
  size = "md",
  titleAs: Title = "h2",
  className,
  children,
  ...props
}: ErrorStateProps) {
  const styles = sizeStyles[size];

  return (
    <div
      data-slot="error-state"
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        layout === "page" && "min-h-[50dvh]",
        styles.wrap,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid place-items-center rounded-pill border border-danger/25 bg-danger-surface text-danger",
          styles.frame,
          "[&_svg]:size-5",
        )}
      >
        <TriangleAlert />
      </span>

      <div className="flex max-w-md flex-col gap-2">
        <Title className={cn("text-ink", styles.title)}>{title}</Title>
        <p className="text-body-sm text-ink-soft">{description}</p>
        {digest ? (
          <p className="text-caption text-ink-faint">
            Reference: <span className="font-mono">{digest}</span>
          </p>
        ) : null}
      </div>

      {children}

      {onRetry || secondaryAction ? (
        <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry} variant="primary">
              <RefreshCw aria-hidden="true" />
              {retryLabel}
            </Button>
          ) : null}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

export { ErrorState };
