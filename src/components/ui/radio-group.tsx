"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "size-5 shrink-0 rounded-pill border border-line-strong bg-surface",
        "transition-[background-color,border-color] duration-fast ease-brand",
        "hover:border-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas-deep",
        "data-[state=checked]:border-primary data-[state=checked]:bg-surface",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        {/* Shape carries the state; colour only reinforces it. */}
        <span className="size-2.5 rounded-pill bg-primary" aria-hidden="true" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

/**
 * Convenience row: control + label text + optional description, clickable as a
 * single unit (label wraps nothing; `htmlFor` is used so hit area stays legal).
 */
function RadioGroupOption({
  value,
  label,
  description,
  id,
  className,
}: {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <RadioGroupItem value={value} id={id} className="mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <label htmlFor={id} className="text-body-sm font-medium text-ink">
          {label}
        </label>
        {description ? (
          <span className="text-caption text-ink-soft">{description}</span>
        ) : null}
      </div>
    </div>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupOption };
