import * as React from "react";
import { ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The Bhagya signature gold shopping bag & leaf logo mark.
 */
function BhagyaLogoIcon({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 36 36"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8 shrink-0 text-[#C99A3D]", className)}
      {...props}
    >
      {/* Shopping bag outline */}
      <path
        d="M9 11C9 9.89543 9.89543 9 11 9H25C26.1046 9 27 9.89543 27 11L28.8 30C28.8 31.1046 27.9046 32 26.8 32H9.2C8.09543 32 7.2 31.1046 7.2 30L9 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Bag handles */}
      <path
        d="M13 11V7C13 4.79086 14.7909 3 17 3H19C21.2091 3 23 4.79086 23 7V11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Centre organic botanical leaf */}
      <path
        d="M18 25C18 20.5 19.5 17 22.5 14C20.5 15.5 19 18 18 25Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M18 25C18 20.5 16.5 17 13.5 14C15.5 15.5 17 18 18 25Z"
        fill="currentColor"
        opacity="0.65"
      />
      <circle cx="18" cy="26" r="1.2" fill="currentColor" />
    </svg>
  );
}

export interface BrandMarkProps extends React.ComponentProps<"span"> {
  variant?: "full" | "compact" | "mobile" | "mark";
  size?: "sm" | "md" | "lg";
  tone?: "default" | "inverse";
  showTagline?: boolean;
}

const sizeStyles = {
  sm: { icon: "size-6", word: "text-[0.95rem] tracking-[0.08em]", tag: "text-[0.5625rem]" },
  md: { icon: "size-8", word: "text-[1.15rem] tracking-[0.06em]", tag: "text-[0.625rem]" },
  lg: { icon: "size-10", word: "text-[1.35rem] tracking-[0.05em]", tag: "text-[0.7rem]" },
} as const;

function BrandMark({
  className,
  variant = "full",
  size = "md",
  tone = "default",
  showTagline = true,
  ...props
}: BrandMarkProps) {
  const styles = sizeStyles[size];
  const isMarkOnly = variant === "mark";

  return (
    <span
      data-slot="brand-mark"
      data-variant={variant}
      className={cn("inline-flex items-center gap-2.5 select-none", className)}
      {...props}
    >
      <BhagyaLogoIcon className={cn(styles.icon, "text-[#C99A3D]")} />
      {!isMarkOnly ? (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "font-serif font-bold text-[#C99A3D] tracking-wide",
              styles.word,
            )}
          >
            Bhagya
          </span>
          {showTagline && variant === "full" ? (
            <span
              className={cn(
                "truncate font-sans font-medium text-[10px] tracking-wider text-[#A89F91]",
                styles.tag,
              )}
            >
              Shop · Sell · Grow Together
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

function BhagyaGlyph({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return <BhagyaLogoIcon className={cn("size-5", className)} {...props} />;
}

export { BhagyaGlyph, BrandMark };
