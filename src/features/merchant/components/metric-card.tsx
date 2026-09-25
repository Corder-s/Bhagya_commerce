"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { formatDelta, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: number | string;
  isCurrency?: boolean;
  delta?: number | null; // e.g. 12.4
  deltaLabel?: string;
  supportingText?: string;
  icon?: React.ReactNode;
  variant?: "default" | "gold" | "warning";
}

export function MetricCard({
  title,
  value,
  isCurrency = false,
  delta,
  deltaLabel = "vs yesterday",
  supportingText,
  icon,
  variant = "default",
}: MetricCardProps) {
  const formattedValue =
    typeof value === "number"
      ? isCurrency
        ? formatPrice(value)
        : new Intl.NumberFormat("en-IN").format(value)
      : value;

  const hasDelta = delta !== undefined && delta !== null;
  const isPositive = hasDelta && delta > 0;
  const isNegative = hasDelta && delta < 0;

  const DeltaIcon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;

  return (
    <Card
      variant="surface"
      padding="md"
      radius="xl"
      className={cn(
        "border-line shadow-card transition-all hover:border-[#C49A45]/40",
        variant === "gold" && "border-[#C49A45]/40 bg-[#C49A45]/5",
      )}
    >
      <CardContent className="space-y-3 p-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-caption font-semibold text-ink-soft uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <span className="size-8 rounded-lg bg-surface-subtle border border-line flex items-center justify-center text-[#9A6A20] dark:text-[#C49A45]">
              {icon}
            </span>
          )}
        </div>

        <div>
          <p className="font-display text-display-md font-bold text-ink tabular-nums leading-tight">
            {formattedValue}
          </p>
        </div>

        <div className="flex items-center justify-between text-caption pt-1 border-t border-line/60">
          {hasDelta ? (
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-bold tabular-nums text-xs px-1.5 py-0.5 rounded-md",
                  isPositive && "bg-[#2F5E3D]/15 text-[#2F5E3D]",
                  isNegative && "bg-danger/15 text-danger",
                  !isPositive && !isNegative && "bg-surface-subtle text-ink-soft",
                )}
              >
                <DeltaIcon className="size-3" strokeWidth={2.5} />
                {formatDelta(delta)}
              </span>
              <span className="text-ink-faint text-[11px]">{deltaLabel}</span>
            </div>
          ) : (
            <span className="text-ink-soft text-[11px]">
              {supportingText || "Real-time store data"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
