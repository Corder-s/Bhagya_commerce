import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — Global Bhagya Commerce Button System
 *
 * Primary Light: bg #71877B text #FFFFFF (Hover #53695F)
 * Primary Dark: bg #9BAFA3 text #1D2522 (Hover #71877B)
 * Secondary Light: cream bg, sage border, dark sage text
 * Secondary Dark: dark sage surface, soft sage border, cream text
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
          "bg-[#71877B] text-[#FCFBF7] font-semibold shadow-xs border border-[#53695F]",
          "hover:bg-[#53695F] hover:shadow-sm",
          "dark:bg-[#9BAFA3] dark:text-[#1D2522] dark:border-[#71877B] dark:hover:bg-[#71877B] dark:hover:text-[#FCFBF7]",
          "active:brightness-95",
        ],
        secondary: [
          "bg-[#F8F5ED] text-[#53695F] border border-[#71877B]/50 shadow-xs",
          "hover:border-[#71877B] hover:bg-[#EEF3EF] hover:text-[#3E4F47]",
          "dark:bg-[#27312D] dark:text-[#F3F1E8] dark:border-[#9BAFA3]/60 dark:hover:bg-[#34403A] dark:hover:border-[#9BAFA3]",
          "active:bg-canvas-deep",
        ],
        outline: [
          "border border-line bg-surface text-ink shadow-xs",
          "hover:border-primary hover:bg-[#EEF3EF] dark:hover:bg-[#27312D] hover:text-ink",
          "active:bg-canvas-deep",
        ],
        dark: [
          "bg-[#27312D] text-[#FCFBF7] border border-[#48534D] shadow-sm",
          "hover:bg-[#34403A] hover:border-[#71877B]",
          "active:bg-[#1D2522]",
        ],
        ghost: [
          "bg-transparent text-ink-soft",
          "hover:bg-[#EEF3EF] dark:hover:bg-[#27312D] hover:text-ink",
          "active:bg-[#EEF3EF] dark:active:bg-[#27312D]",
        ],
        gold: [
          "bg-[#71877B] text-[#FCFBF7] font-semibold shadow-xs border border-[#53695F]",
          "hover:bg-[#53695F]",
          "dark:bg-[#9BAFA3] dark:text-[#1D2522] dark:border-[#71877B] dark:hover:bg-[#71877B] dark:hover:text-[#FCFBF7]",
          "active:brightness-95",
        ],
        destructive: [
          "bg-danger text-white shadow-xs border border-danger/20 hover:opacity-90",
          "active:brightness-95",
        ],
        link: [
          "h-auto p-0 text-[#71877B] dark:text-[#9BAFA3] underline-offset-4 font-medium",
          "hover:underline hover:opacity-90",
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
          "bg-[#9BAFA3] text-[#1D2522] border border-[#71877B] shadow-xs hover:bg-[#71877B] hover:text-[#FCFBF7]",
      },
      {
        variant: "secondary",
        tone: "inverse",
        class:
          "bg-[#27312D] text-[#FCFBF7] border border-[#48534D] hover:border-[#9BAFA3]",
      },
      {
        variant: "outline",
        tone: "inverse",
        class:
          "border border-white/30 bg-white/10 text-white hover:border-[#9BAFA3] hover:bg-white/20 hover:text-white backdrop-blur-xs",
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
    const Comp = asChild ? Slot : "button";
    const busy = isLoading || loading;

    const content = (
      <>
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
      </>
    );

    return (
      <Comp
        ref={ref}
        disabled={disabled || busy}
        aria-busy={busy || undefined}
        className={cn(
          buttonVariants({ variant, size, tone, fullWidth, className })
        )}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
