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
 * Completed: deep sage (#53695F)
 * Current: primary sage (#71877B / #9BAFA3)
 * Upcoming: soft beige-gray
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
                  stage.state === "complete" ? "bg-[#53695F] dark:bg-[#71877B]" : "bg-line",
                )}
              />
            ) : null}

            <span
              aria-hidden="true"
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-pill border",
                stage.state === "complete" && "border-[#53695F] bg-[#53695F] dark:border-[#71877B] dark:bg-[#71877B] text-[#FCFBF7]",
                stage.state === "current" && "border-2 border-[#71877B] bg-[#EEF3EF] dark:bg-[#34403A] text-[#53695F] dark:text-[#E9E2D5]",
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
    label: "Order placed",
    description: "Your order details have been securely received by the store.",
    state: "complete",
  },
  {
    id: "processing",
    label: "Processing at artisan workshop",
    description: "The maker is preparing your handcrafted items with care.",
    state: "current",
  },
  {
    id: "dispatched",
    label: "Dispatched",
    description: "Courier tracking will become live once handed over.",
    state: "upcoming",
  },
  {
    id: "delivered",
    label: "Delivered",
    state: "upcoming",
  },
];
