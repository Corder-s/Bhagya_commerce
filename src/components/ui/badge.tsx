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
        primary: "border-[#E89535]/40 bg-[#FFF6ED] text-[#D48024] dark:bg-[#33241C] dark:text-[#F0A349] dark:border-[#E89535]/40",
        gold: "border-[#E89535]/40 bg-[#FFF6ED] text-[#D48024] dark:bg-[#33241C] dark:text-[#F0A349] dark:border-[#E89535]/40",
        accent: "border-[#E89535]/40 bg-[#FFF6ED] text-[#D48024] dark:bg-[#33241C] dark:text-[#F0A349] dark:border-[#E89535]/40",
        orange: "border-[#E0732A]/40 bg-[#FFF3EB] text-[#E0732A] dark:bg-[#3C2216] dark:text-[#FAD9C3] dark:border-[#E0732A]/40",
        botanical: "border-[#4E7C59]/30 bg-[#EAF3ED] text-[#4E7C59] dark:bg-[#25392B] dark:text-[#78A383]",
        sand: "border-line bg-surface-sunken text-ink",
        outline: "border-line bg-transparent text-ink-soft",
        success: "border-[#4E7C59]/30 bg-[#EAF3ED] text-[#4E7C59] dark:bg-[#25392B] dark:text-[#78A383] dark:border-[#4E7C59]/40",
        warning: "border-[#D9882B]/30 bg-[#FDF3E7] text-[#D9882B] dark:bg-[#3C2B18] dark:text-[#F7C07E] dark:border-[#D9882B]/40",
        danger: "border-[#B84A39]/30 bg-[#FAEBE9] text-[#B84A39] dark:bg-[#3F1E1A] dark:text-[#E8958B] dark:border-[#B84A39]/40",
        info: "border-[#6B7A75]/30 bg-[#EBF1F0] text-[#6B7A75] dark:bg-[#202E2B] dark:text-[#A4B8B3] dark:border-[#6B7A75]/40",
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
