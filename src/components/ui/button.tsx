import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — Global Bhagya Commerce Button System
 *
 * Primary Light: bg #708477 text #FFFFFF (Hover #566B60)
 * Primary Dark: bg #A8B9AF text #20231F (Hover #82968A)
 * Accent Yellow: bg #D7A63A text #20231F (Hover #C28F27)
 * Accent Orange: bg #D47A32 text #FFFFFF (Hover #B86524)
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
          "bg-[#708477] text-[#FFFFFF] font-semibold shadow-xs border border-[#566B60]",
          "hover:bg-[#566B60] hover:shadow-sm",
          "dark:bg-[#A8B9AF] dark:text-[#20231F] dark:border-[#82968A] dark:hover:bg-[#82968A] dark:hover:text-[#FFFFFF]",
          "active:brightness-95",
        ],
        accent: [
          "bg-[#D7A63A] text-[#20231F] font-bold shadow-xs border border-[#C28F27]",
          "hover:bg-[#C28F27] hover:shadow-sm",
          "dark:bg-[#E2B84B] dark:text-[#20231F] dark:border-[#D7A63A] dark:hover:bg-[#D7A63A]",
          "active:brightness-95",
        ],
        orange: [
          "bg-[#D47A32] text-[#FFFFFF] font-bold shadow-xs border border-[#B86524]",
          "hover:bg-[#B86524] hover:shadow-sm",
          "dark:bg-[#D47A32] dark:text-[#FFFFFF] dark:border-[#E9B27D]/40 dark:hover:bg-[#B86524]",
          "active:brightness-95",
        ],
        secondary: [
          "bg-[#F7F4EC] text-[#566B60] border border-[#708477]/50 shadow-xs",
          "hover:border-[#708477] hover:bg-[#EDF2EE] hover:text-[#20231F]",
          "dark:bg-[#30332F] dark:text-[#F5F1E7] dark:border-[#A8B9AF]/60 dark:hover:bg-[#373B36] dark:hover:border-[#A8B9AF]",
          "active:bg-canvas-deep",
        ],
        outline: [
          "border border-line bg-surface text-ink shadow-xs",
          "hover:border-primary hover:bg-[#EDF2EE] dark:hover:bg-[#30332F] hover:text-ink",
          "active:bg-canvas-deep",
        ],
        dark: [
          "bg-[#30332F] text-[#F5F1E7] border border-[#4B514B] shadow-sm",
          "hover:bg-[#373B36] hover:border-[#708477]",
          "active:bg-[#252925]",
        ],
        ghost: [
          "bg-transparent text-ink-soft",
          "hover:bg-[#EDF2EE] dark:hover:bg-[#30332F] hover:text-ink",
          "active:bg-[#EDF2EE] dark:active:bg-[#30332F]",
        ],
        gold: [
          "bg-[#D7A63A] text-[#20231F] font-bold shadow-xs border border-[#C28F27]",
          "hover:bg-[#C28F27]",
          "dark:bg-[#E2B84B] dark:text-[#20231F] dark:border-[#D7A63A] dark:hover:bg-[#D7A63A]",
          "active:brightness-95",
        ],
        destructive: [
          "bg-danger text-white shadow-xs border border-danger/20 hover:opacity-90",
          "active:brightness-95",
        ],
        link: [
          "h-auto p-0 text-[#566B60] dark:text-[#A8B9AF] hover:text-[#D7A63A] dark:hover:text-[#E2B84B] underline-offset-4 font-medium",
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
          "bg-[#A8B9AF] text-[#20231F] border border-[#708477] shadow-xs hover:bg-[#708477] hover:text-[#FFFFFF]",
      },
      {
        variant: "secondary",
        tone: "inverse",
        class:
          "bg-[#30332F] text-[#F5F1E7] border border-[#4B514B] hover:border-[#A8B9AF]",
      },
      {
        variant: "outline",
        tone: "inverse",
        class:
          "border border-white/30 bg-white/10 text-white hover:border-[#D7A63A] hover:bg-white/20 hover:text-white backdrop-blur-xs",
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
