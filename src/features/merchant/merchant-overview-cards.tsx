import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { formatDelta, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export type MerchantMetric = {
  id: string;
  label: string;
  /** `null` until the analytics service exists — rendered as "—", never as 0. */
  value: number | null;
  format?: "currency" | "number";
  /** Percentage change versus the previous period. */
  delta?: number | null;
  hint?: string;
};

/**
 * MerchantOverviewCards — the KPI row of the merchant dashboard.
 *
 * Two deliberate rules:
 *  1. No number is invented. Phase 1 passes `value: null`, which renders "—"
 *     plus a "not connected yet" hint instead of a confident zero.
 *  2. Direction is never colour-only: every delta carries an arrow icon, an
 *     explicit sign and a screen-reader phrase ("up 12.4 percent").
 */
export function MerchantOverviewCards({
  metrics,
}: {
  metrics: readonly MerchantMetric[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const hasValue = metric.value !== null;
        const value = metric.value;
        const formatted =
          value === null
            ? "—"
            : metric.format === "currency"
              ? formatPrice(value)
              : new Intl.NumberFormat("en-IN").format(value);

        const direction =
          metric.delta == null ? "flat" : metric.delta > 0 ? "up" : metric.delta < 0 ? "down" : "flat";

        const DeltaIcon =
          direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;

        return (
          <li key={metric.id}>
            <Card variant="surface" padding="md" className="h-full">
              <CardContent className="flex flex-col gap-2.5">
                <p className="label-text text-ink-faint">{metric.label}</p>

                <p
                  className={cn(
                    "font-display tabular-nums",
                    hasValue ? "text-ink" : "text-ink-faint",
                    "text-display-md leading-none",
                  )}
                >
                  {formatted}
                </p>

                {metric.delta != null ? (
                  <p
                    className={cn(
                      "flex items-center gap-1 text-caption font-medium",
                      direction === "up" && "text-success",
                      direction === "down" && "text-danger",
                      direction === "flat" && "text-ink-soft",
                    )}
                  >
                    <DeltaIcon className="size-3.5" aria-hidden="true" />
                    {formatDelta(metric.delta)}
                    <span className="sr-only">
                      {direction === "up"
                        ? "increase"
                        : direction === "down"
                          ? "decrease"
                          : "no change"}{" "}
                      versus the previous period
                    </span>
                  </p>
                ) : (
                  <p className="text-caption text-ink-soft">
                    {metric.hint ?? "Analytics service arrives in Phase 3"}
                  </p>
                )}
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
