import * as React from "react";

import { EmptyState, type EmptyStateProps } from "@/components/ui/empty-state";
import { ErrorState, type ErrorStateProps } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { SuccessState, type SuccessStateProps } from "@/components/ui/success-state";
import type { LoadableStatus } from "@/types/navigation";

export interface StateViewProps {
  status: LoadableStatus;
  /** Loading presentation: a skeleton grid (default), rows, or a bare spinner. */
  loading?: "grid" | "rows" | "inline";
  rowCount?: number;
  empty: Pick<
    EmptyStateProps,
    "icon" | "title" | "description" | "action" | "titleAs"
  >;
  error?: Pick<
    ErrorStateProps,
    "title" | "description" | "digest" | "onRetry" | "secondaryAction"
  >;
  success?: Pick<SuccessStateProps, "title" | "description" | "details" | "actions">;
  children: React.ReactNode;
  /** Content shown once `status === "success"` (or omitted if success UI is set). */
}

/**
 * StateView — one switch that renders the correct global state.
 *
 * Data-driven features (products, orders, inventory, analytics) all have the
 * same four states. Routing them through a single component guarantees the
 * loading/empty/error/success treatments stay identical across the product
 * instead of being reinvented per page.
 */
function StateView({
  status,
  loading = "grid",
  rowCount = 6,
  empty,
  error,
  success,
  children,
}: StateViewProps) {
  if (status === "loading" || status === "idle") {
    if (loading === "inline") {
      return (
        <div role="status" aria-live="polite" className="flex items-center gap-3 py-4">
          <Skeleton className="h-4 w-40" />
          <span className="sr-only">Loading</span>
        </div>
      );
    }

    return (
      <div role="status" aria-live="polite" className="flex flex-col gap-4">
        <span className="sr-only">Loading</span>
        {loading === "grid" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: rowCount }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-3"
              >
                <Skeleton variant="media" />
                <Skeleton className="w-3/4" />
                <Skeleton className="w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          Array.from({ length: rowCount }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-md border border-line bg-surface p-4"
            >
              <Skeleton variant="circle" className="size-10 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="w-1/3" />
                <Skeleton className="w-1/5" />
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  if (status === "empty") {
    return <EmptyState {...empty} />;
  }

  if (status === "error") {
    return <ErrorState {...error} />;
  }

  if (status === "success" && success) {
    return <SuccessState {...success} />;
  }

  return <>{children}</>;
}

export { StateView };
