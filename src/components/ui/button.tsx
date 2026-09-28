import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — Global Bhagya Commerce Button System
 * Inspired by LUNÉA reference:
 * - Primary / Accent: Glowing Golden Amber (Light #E89535, Dark #F0A349)
 * - Secondary: Warm Nude Silk (#F7EFE8 / #261B15)
 * - Dark: Rich Espresso (#241812 / #1B120E)
 */
const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2",
    "font-sans font-semibold whitespace-nowrap cursor-pointer",
    "border border-transparent",
    "transition-all duration-base ease-brand",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[#E89535] text-[#1F1510] font-semibold shadow-xs border border-[#D48024]",
          "hover:bg-[#D48024] hover:text-white hover:shadow-sm",
          "dark:bg-[#F0A349] dark:text-[#1F1510] dark:border-[#E89535] dark:hover:bg-[#E89535] dark:hover:text-[#1F1510]",
          "active:brightness-95",
        ],
        accent: [
          "bg-[#F0A349] text-[#1F1510] font-bold shadow-xs border border-[#E89535]",
          "hover:bg-[#E89535] hover:shadow-sm",
          "dark:bg-[#F0A349] dark:text-[#1F1510] dark:border-[#E89535] dark:hover:bg-[#E89535]",
          "active:brightness-95",
        ],
        orange: [
          "bg-[#E0732A] text-[#FFFFFF] font-bold shadow-xs border border-[#CA621C]",
          "hover:bg-[#CA621C] hover:shadow-sm",
          "dark:bg-[#E0732A] dark:text-[#FFFFFF] dark:border-[#FAD9C3]/40 dark:hover:bg-[#CA621C]",
          "active:brightness-95",
        ],
        secondary: [
          "bg-[#F7EFE8] text-[#1F1510] border border-[#ECE1D6] shadow-xs",
          "hover:border-[#DACAC7] hover:bg-[#F2E7DC] hover:text-[#1F1510]",
          "dark:bg-[#261B15] dark:text-[#FAF4EE] dark:border-[#38271E] dark:hover:bg-[#30231C] dark:hover:border-[#4D382B]",
          "active:bg-canvas-deep",
        ],
        outline: [
          "border border-line bg-surface text-ink font-semibold shadow-xs",
          "hover:border-primary hover:bg-[#F7EFE8] dark:hover:bg-[#261B15] hover:text-ink",
          "active:bg-canvas-deep",
        ],
        dark: [
          "bg-[#241812] text-[#FAF4EE] border border-[#38271E] shadow-sm",
          "hover:bg-[#33241C] hover:border-[#E89535]",
          "dark:bg-[#1B120E] dark:text-[#FAF4EE] dark:border-[#261811] dark:hover:bg-[#241812]",
          "active:bg-[#1F1510]",
        ],
        ghost: [
          "bg-transparent text-ink font-semibold",
          "hover:bg-[#F7EFE8] dark:hover:bg-[#261B15] hover:text-ink",
          "active:bg-[#F7EFE8] dark:active:bg-[#261B15]",
        ],
        gold: [
          "bg-[#E89535] text-[#1F1510] font-bold shadow-xs border border-[#D48024]",
          "hover:bg-[#D48024] hover:text-white",
          "dark:bg-[#F0A349] dark:text-[#1F1510] dark:border-[#E89535] dark:hover:bg-[#E89535]",
          "active:brightness-95",
        ],
        destructive: [
          "bg-danger text-white shadow-xs border border-danger/20 hover:opacity-90",
          "active:brightness-95",
        ],
        link: [
          "h-auto p-0 text-[#E89535] dark:text-[#F0A349] hover:text-[#D48024] dark:hover:text-[#E89535] underline-offset-4 font-medium",
          "hover:underline",
          "active:opacity-80",
        ],
      },
      size: {
        sm: "h-10 min-h-10 rounded-xl px-3.5 text-xs pointer-coarse:min-h-11",
        md: "h-11 min-h-11 rounded-xl px-5 text-sm",
        lg: "h-12 min-h-12 rounded-xl px-6 text-sm sm:text-base",
        icon: "size-11 min-h-11 min-w-11 rounded-xl p-0",
        "icon-sm": "size-9 min-h-9 min-w-9 rounded-lg p-0 pointer-coarse:size-11",
      },
      tone: {
        default: "",
        inverse: "",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    compoundVariants: [
      {
        variant: "primary",
        tone: "inverse",
        class:
          "bg-[#F0A349] text-[#1F1510] border border-[#E89535] shadow-xs hover:bg-[#E89535]",
      },
      {
        variant: "secondary",
        tone: "inverse",
        class:
          "bg-[#241812] text-[#FAF4EE] border border-[#38271E] hover:border-[#E89535]",
      },
      {
        variant: "outline",
        tone: "inverse",
        class:
          "border border-white/30 bg-white/10 text-white hover:border-[#E89535] hover:bg-white/20 hover:text-white backdrop-blur-xs",
      },
      {
        variant: "ghost",
        tone: "inverse",
        class: "text-white/80 hover:bg-white/10 hover:text-white",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      tone: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      tone,
      fullWidth,
      asChild = false,
      isLoading = false,
      loading = false,
      loadingLabel,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const busy = isLoading || loading;

    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-busy={busy || undefined}
          aria-disabled={disabled || busy ? true : undefined}
          className={cn(
            buttonVariants({ variant, size, tone, fullWidth, className })
          )}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        className={cn(
          buttonVariants({ variant, size, tone, fullWidth, className })
        )}
        {...props}
      >
        {busy ? (
          <>
            <span
              aria-hidden="true"
              className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
            {loadingLabel ? <span>{loadingLabel}</span> : children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
