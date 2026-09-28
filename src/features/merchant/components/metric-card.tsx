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
    <div
      className={cn(
        "rounded-2xl border border-[#DDD4C4] dark:border-[#47362E] bg-[#FFFCF6] dark:bg-[#261B15] p-5 shadow-[0_2px_10px_rgba(50,40,25,0.05)] transition-all hover:border-[#D6A23A]/60",
        variant === "gold" && "bg-[#F8F4EA] dark:bg-[#30231C]",
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-caption font-semibold text-[#68736B] dark:text-[#A69E92] uppercase tracking-wider">
            {title}
          </span>
          {icon && (
            <span className="size-8 rounded-lg bg-[#EDF2EE] dark:bg-[#382A22] border border-[#DDD4C4] dark:border-[#47362E] flex items-center justify-center text-[#D6A23A]">
              {icon}
            </span>
          )}
        </div>

        <div>
          <p className="font-display text-display-md font-bold text-[#252923] dark:text-[#F2EEE5] tabular-nums leading-tight">
            {formattedValue}
          </p>
        </div>

        <div className="flex items-center justify-between text-caption pt-1.5 border-t border-[#DDD4C4]/60 dark:border-[#47362E]">
          {hasDelta ? (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-bold tabular-nums text-xs px-2 py-0.5 rounded-md",
                  isPositive && "bg-[#DDEBE1] dark:bg-[#1E3624] text-[#2D5E3A] dark:text-[#88C496] border border-[#B8D9C0] dark:border-[#2D5A38]",
                  isNegative && "bg-[#FCEBE9] dark:bg-[#3D1A16] text-[#A9574F] dark:text-[#F08C80] border border-[#F2A89F] dark:border-[#6B241D]",
                  !isPositive && !isNegative && "bg-[#EDF2EE] dark:bg-[#30231C] text-[#68736B] dark:text-[#A69E92] border border-[#DDD4C4] dark:border-[#47362E]",
                )}
              >
                <DeltaIcon className="size-3" strokeWidth={2.5} />
                {formatDelta(delta)}
              </span>
              <span className="text-[#68736B] dark:text-[#A69E92] font-medium text-[11px]">{deltaLabel}</span>
            </div>
          ) : (
            <span className="text-[#68736B] dark:text-[#A69E92] font-medium text-[11px]">
              {supportingText || "Real-time store data"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
