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
        primary: "border-[#71877B]/40 bg-[#EEF3EF] text-[#53695F] dark:bg-[#46584F] dark:text-[#E9E2D5] dark:border-[#9BAFA3]/40",
        gold: "border-[#71877B]/40 bg-[#EEF3EF] text-[#53695F] dark:bg-[#46584F] dark:text-[#E9E2D5] dark:border-[#9BAFA3]/40",
        botanical: "border-[#5F8068]/30 bg-[#E3ECE6] text-[#5F8068] dark:bg-[#263B2D] dark:text-[#78A383]",
        sand: "border-line bg-surface-sunken text-ink",
        outline: "border-line bg-transparent text-ink-soft",
        success: "border-[#5F8068]/30 bg-[#E3ECE6] text-[#5F8068] dark:bg-[#263B2D] dark:text-[#78A383] dark:border-[#5F8068]/40",
        warning: "border-[#9A7B4E]/30 bg-[#F2EADB] text-[#9A7B4E] dark:bg-[#3D3323] dark:text-[#BA9964] dark:border-[#9A7B4E]/40",
        danger: "border-[#A85D55]/30 bg-[#F3E5E2] text-[#A85D55] dark:bg-[#3D2725] dark:text-[#C4746B] dark:border-[#A85D55]/40",
        info: "border-[#687A72]/30 bg-[#E5ECE8] text-[#687A72] dark:bg-[#25342D] dark:text-[#93A89F] dark:border-[#687A72]/40",
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
