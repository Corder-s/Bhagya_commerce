import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Badge — compact status or taxonomy label for Bhagya Commerce.
 */
const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border",
    "text-[10px] font-semibold uppercase tracking-wider",
    "[&_svg]:size-3 [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        neutral: "border-line bg-canvas-deep text-ink-soft",
        primary: "border-primary/40 bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold",
        gold: "border-primary/40 bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold",
        botanical: "border-primary/30 bg-gold-surface dark:bg-surface-elevated text-gold-dark dark:text-gold",
        sand: "border-line bg-canvas-deep text-ink",
        outline: "border-line bg-transparent text-ink-soft",
        success: "border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/15 text-amber-800 dark:text-amber-400",
        danger: "border-red-500/20 bg-red-500/15 text-red-700 dark:text-red-400",
        info: "border-sky-500/20 bg-sky-500/15 text-sky-700 dark:text-sky-400",
      },
      size: {
        sm: "px-2 py-0.5 text-[9px]",
        md: "px-2.5 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-xs normal-case tracking-normal",
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
