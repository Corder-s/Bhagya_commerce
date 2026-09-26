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
        primary: "border-[#708477]/40 bg-[#EDF2EE] text-[#566B60] dark:bg-[#3A433D] dark:text-[#F5F1E7] dark:border-[#A8B9AF]/40",
        gold: "border-[#D7A63A]/40 bg-[#F3E8D0] text-[#B9792E] dark:bg-[#4C3F25] dark:text-[#E2B84B] dark:border-[#D7A63A]/40",
        accent: "border-[#D7A63A]/40 bg-[#F3E8D0] text-[#B9792E] dark:bg-[#4C3F25] dark:text-[#E2B84B] dark:border-[#D7A63A]/40",
        orange: "border-[#D47A32]/40 bg-[#F9EBE1] text-[#D47A32] dark:bg-[#4A3323] dark:text-[#E9B27D] dark:border-[#D47A32]/40",
        botanical: "border-[#5D8067]/30 bg-[#DFEAE2] text-[#5D8067] dark:bg-[#294437] dark:text-[#78A383]",
        sand: "border-line bg-surface-sunken text-ink",
        outline: "border-line bg-transparent text-ink-soft",
        success: "border-[#5D8067]/30 bg-[#DFEAE2] text-[#5D8067] dark:bg-[#294437] dark:text-[#78A383] dark:border-[#5D8067]/40",
        warning: "border-[#B9792E]/30 bg-[#F3E8D5] text-[#B9792E] dark:bg-[#4A3B25] dark:text-[#BA9964] dark:border-[#B9792E]/40",
        danger: "border-[#A9574F]/30 bg-[#F2E3E0] text-[#A9574F] dark:bg-[#4A2D2A] dark:text-[#C4746B] dark:border-[#A9574F]/40",
        info: "border-[#6E8078]/30 bg-[#E5ECE8] text-[#6E8078] dark:bg-[#283730] dark:text-[#93A89F] dark:border-[#6E8078]/40",
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
