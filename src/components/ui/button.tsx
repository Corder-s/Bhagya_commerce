import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — Global Bhagya Commerce Button System
 *
 * Variants adapt seamlessly to Light and Dark modes using design tokens.
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
          "bg-gradient-btn-gold text-[#151515] font-bold shadow-sm shadow-primary/20 border border-gold-light/40",
          "hover:brightness-105 hover:shadow-md hover:shadow-primary/30",
          "active:brightness-95",
        ],
        secondary: [
          "bg-surface text-ink border border-primary/70 shadow-xs",
          "hover:border-primary hover:bg-gold-soft/20 dark:hover:bg-gold/10 hover:text-gold-dark dark:hover:text-gold hover:shadow-sm",
          "active:bg-canvas-deep",
        ],
        outline: [
          "border border-line bg-surface text-ink shadow-xs",
          "hover:border-primary hover:bg-canvas-deep hover:text-gold-dark dark:hover:text-gold",
          "active:bg-canvas-deep",
        ],
        dark: [
          "bg-charcoal text-white border border-line-strong shadow-md",
          "hover:shadow-lg hover:border-primary/50 hover:bg-charcoal-soft",
          "active:bg-black",
        ],
        ghost: [
          "bg-transparent text-ink-soft",
          "hover:bg-canvas-deep hover:text-ink",
          "active:bg-canvas-deep",
        ],
        gold: [
          "bg-gradient-btn-gold text-[#151515] font-bold shadow-md shadow-primary/20 border border-gold-light/40",
          "hover:shadow-lg hover:brightness-105",
          "active:brightness-95",
        ],
        destructive: [
          "bg-danger text-white shadow-sm border border-danger/20 hover:opacity-90",
          "active:brightness-95",
        ],
        link: [
          "h-auto p-0 text-gold-dark dark:text-gold underline-offset-4 font-medium",
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
          "bg-gradient-btn-gold text-[#151515] border border-gold-light/50 shadow-md hover:brightness-105",
      },
      {
        variant: "secondary",
        tone: "inverse",
        class:
          "bg-charcoal-soft text-white border border-line-strong hover:border-primary",
      },
      {
        variant: "outline",
        tone: "inverse",
        class:
          "border border-white/30 bg-white/10 text-white hover:border-gold hover:bg-white/20 hover:text-white backdrop-blur-xs",
      },
      {
        variant: "ghost",
        tone: "inverse",
        class:
          "text-ink-inverse hover:bg-charcoal-soft hover:text-gold",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      tone: "default",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingLabel?: string;
}

function Button({
  className,
  variant,
  size,
  tone,
  fullWidth,
  asChild = false,
  loading = false,
  loadingLabel = "Loading",
  disabled,
  children,
  type,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  if (asChild) {
    return (
      <Component
        data-slot="button"
        data-variant={variant ?? "primary"}
        data-loading={loading || undefined}
        className={cn(buttonVariants({ variant, size, tone, fullWidth }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      data-slot="button"
      data-variant={variant ?? "primary"}
      data-loading={loading || undefined}
      type={type ?? "button"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, tone, fullWidth }), className)}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-pill border-2 border-current border-t-transparent opacity-80"
          />
          <span className="sr-only">{loadingLabel}</span>
          <span className="inline-flex items-center gap-2 opacity-70">
            {children}
          </span>
        </span>
      ) : (
        children
      )}
    </Component>
  );
}

export { Button, buttonVariants };
