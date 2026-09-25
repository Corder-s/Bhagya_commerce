import { Check, Clock, Package } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type TrackingStage = {
  id: string;
  label: string;
  description?: string;
  timestamp?: string;
  state: "complete" | "current" | "upcoming";
};

const stageIcon = {
  complete: Check,
  current: Clock,
  upcoming: Package,
} as const;

/**
 * OrderTimeline — shipment progress for `/orders/[id]/tracking`.
 *
 * Phase 1 renders the structure with a single, explicitly-unstarted stage:
 * showing a fake "out for delivery" would be worse than showing nothing. Each
 * stage carries an icon, a word and a screen-reader state, so progress never
 * depends on colour.
 */
export function OrderTimeline({
  stages,
  className,
}: {
  stages: readonly TrackingStage[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {stages.map((stage, index) => {
        const Icon = stageIcon[stage.state];
        const isLast = index === stages.length - 1;

        return (
          <li key={stage.id} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Rail */}
            {!isLast ? (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[0.9375rem] top-8 h-[calc(100%-2rem)] w-px",
                  stage.state === "complete" ? "bg-emerald-600 dark:bg-emerald-500" : "bg-line",
                )}
              />
            ) : null}

            <span
              aria-hidden="true"
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-pill border",
                stage.state === "complete" && "border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500 text-white",
                stage.state === "current" && "border-primary bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold",
                stage.state === "upcoming" && "border-line bg-surface text-ink-subtle",
              )}
            >
              <Icon className="size-4" />
            </span>

            <div className="flex min-w-0 flex-col gap-0.5 pt-1">
              <p
                className={cn(
                  "text-body-sm font-medium",
                  stage.state === "upcoming" ? "text-ink-soft" : "text-ink",
                )}
              >
                {stage.label}
                <span className="sr-only">
                  {stage.state === "complete"
                    ? " — completed"
                    : stage.state === "current"
                      ? " — in progress"
                      : " — not started"}
                </span>
              </p>
              {stage.description ? (
                <p className="text-caption text-ink-soft">{stage.description}</p>
              ) : null}
              {stage.timestamp ? (
                <p className="text-caption text-ink-faint">
                  <time>{stage.timestamp}</time>
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** The truthful Phase 1 timeline: a shipment that has not started yet. */
export const placeholderTrackingStages: readonly TrackingStage[] = [
  {
    id: "placed",
    label: "Order confirmed",
    description: "Live order data arrives with the orders service in Phase 3.",
    state: "current",
  },
  {
    id: "packed",
    label: "Packed by the maker",
    state: "upcoming",
  },
  {
    id: "shipped",
    label: "Picked up and in transit",
    state: "upcoming",
  },
  {
    id: "delivered",
    label: "Delivered",
    state: "upcoming",
  },
] as const;
