"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className,
  label = "quantity",
}: QuantitySelectorProps) {
  const isMin = value <= min;
  const isMax = value >= max;

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMin && !disabled) {
      onChange(Math.max(min, value - 1));
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMax && !disabled) {
      onChange(Math.min(max, value + 1));
    }
  };

  const sizeClasses = {
    sm: {
      container: "h-8 p-0.5 rounded-lg text-caption",
      btn: "size-7 rounded-md",
      icon: "size-3",
      text: "w-8 text-caption font-semibold",
    },
    md: {
      container: "h-11 p-1 rounded-xl text-body-sm",
      btn: "size-9 rounded-lg",
      icon: "size-4",
      text: "w-10 text-body-md font-semibold",
    },
    lg: {
      container: "h-12 p-1 rounded-xl text-body-md",
      btn: "size-10 rounded-lg",
      icon: "size-4.5",
      text: "w-12 text-body-lg font-semibold",
    },
  }[size];

  return (
    <div
      role="group"
      aria-label={`Select ${label}`}
      className={cn(
        "inline-flex items-center gap-1 border border-line-strong/80 bg-surface shadow-xs",
        disabled && "opacity-50 pointer-events-none",
        sizeClasses.container,
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMin || disabled}
        aria-label={`Decrease ${label}`}
        className={cn(
          "grid place-items-center text-ink-soft transition-colors",
          "hover:bg-soft-green hover:text-primary active:bg-soft-green-strong",
          "disabled:opacity-30 disabled:pointer-events-none",
          "focus-visible:outline-2 focus-visible:outline-offset-1",
          sizeClasses.btn,
        )}
      >
        <Minus className={sizeClasses.icon} aria-hidden="true" />
      </button>

      <span
        aria-live="polite"
        className={cn("text-center tabular-nums text-ink select-none", sizeClasses.text)}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMax || disabled}
        aria-label={`Increase ${label}`}
        className={cn(
          "grid place-items-center text-ink-soft transition-colors",
          "hover:bg-soft-green hover:text-primary active:bg-soft-green-strong",
          "disabled:opacity-30 disabled:pointer-events-none",
          "focus-visible:outline-2 focus-visible:outline-offset-1",
          sizeClasses.btn,
        )}
      >
        <Plus className={sizeClasses.icon} aria-hidden="true" />
      </button>
    </div>
  );
}
