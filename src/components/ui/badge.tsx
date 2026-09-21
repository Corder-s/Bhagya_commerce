import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Badge — compact status or taxonomy label.
 *
 * Tone maps to meaning, and every *status* badge is expected to ship with an
 * icon or an explicit word so nothing depends on colour alone.
 */
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-pill border",
    "text-label font-semibold uppercase tracking-[0.09em]",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        neutral: "border-line bg-canvas-deep text-ink-soft",
        primary: "border-transparent bg-primary text-primary-foreground",
        botanical: "border-soft-green-strong bg-soft-green text-primary",
        gold: "border-gold/40 bg-gold-soft text-gold-deep",
        sand: "border-sand-strong bg-sand/60 text-ink",
        outline: "border-line-strong bg-transparent text-ink-soft",
        success: "border-success/25 bg-success-surface text-success",
        warning: "border-warning/25 bg-warning-surface text-warning",
        danger: "border-danger/25 bg-danger-surface text-danger",
        info: "border-info/25 bg-info-surface text-info",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.625rem]",
        md: "px-2.5 py-1 text-label",
        lg: "px-3 py-1.5 text-caption normal-case tracking-normal",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, tone, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ tone, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
