import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Badge — compact status or taxonomy label for Bhagya Commerce.
 * Semantic status colors mapped cleanly for both Light and Dark themes.
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
        neutral: "border-line bg-surface-sunken text-ink-soft",
        primary: "border-primary/40 bg-gold-soft/30 dark:bg-gold-soft/40 text-gold-dark dark:text-gold-light",
        gold: "border-primary/40 bg-gold-soft/30 dark:bg-gold-soft/40 text-gold-dark dark:text-gold-light",
        botanical: "border-primary/30 bg-gold-surface dark:bg-surface-elevated text-gold-dark dark:text-gold-light",
        sand: "border-line bg-surface-sunken text-ink",
        outline: "border-line bg-transparent text-ink-soft",
        success: "border-success/30 bg-success-surface text-success dark:bg-success-surface dark:text-[#73D393]",
        warning: "border-warning/30 bg-warning-surface text-warning dark:bg-warning-surface dark:text-[#DDBB72]",
        danger: "border-danger/30 bg-danger-surface text-danger dark:bg-danger-surface dark:text-[#F09284]",
        info: "border-info/30 bg-info-surface text-info dark:bg-info-surface dark:text-[#9DA99F]",
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
