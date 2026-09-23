import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — the single source of truth for actions across Bhagya.
 *
 * States covered: default · hover · active · focus-visible · disabled ·
 * loading. Every size meets or exceeds a 44px touch target on coarse pointers.
 *
 * Variants map to brand intent:
 *  primary     forest green, reserved for the primary action of a view
 *  secondary   neutral/soft-green surface, safe for repeated actions
 *  outline     transparent with a dark border, for secondary emphasis
 *  ghost       chrome-less, for toolbars and nav
 *  destructive irreversible actions only (never colour-only: pair with a label)
 */
const buttonVariants = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2",
    "font-sans font-semibold whitespace-nowrap",
    "border border-transparent",
    "transition-all duration-base ease-brand",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-[#0b4d36] via-[#167a50] to-[#0b4d36] text-white shadow-md shadow-[#0b4d36]/25 border border-emerald-400/25",
          "hover:from-[#0d5c41] hover:via-[#1e8f5e] hover:to-[#0d5c41] hover:shadow-lg hover:shadow-[#0b4d36]/35 hover:brightness-105",
          "active:brightness-95",
          "disabled:bg-none disabled:bg-primary-disabled disabled:text-primary-foreground/80 disabled:shadow-none disabled:border-transparent",
        ],
        secondary: [
          "bg-gradient-to-r from-soft-green via-[#e3efe6] to-soft-green text-primary border border-primary/25 shadow-xs",
          "hover:border-primary/50 hover:bg-soft-green-strong hover:text-deep hover:shadow-sm",
          "active:bg-soft-green-strong active:text-primary-active",
          "disabled:bg-none disabled:bg-canvas-deep disabled:text-ink-faint disabled:border-line disabled:shadow-none",
        ],
        outline: [
          "border-2 border-primary/45 bg-surface/90 text-primary backdrop-blur-xs shadow-xs",
          "hover:border-primary hover:bg-primary hover:text-white hover:shadow-md",
          "active:bg-primary-active active:text-white",
          "disabled:border-line disabled:bg-transparent disabled:text-ink-faint disabled:shadow-none",
        ],
        ghost: [
          "bg-transparent text-ink",
          "hover:bg-soft-green/80 hover:text-primary",
          "active:bg-soft-green-strong active:text-primary-active",
          "disabled:text-ink-faint",
        ],
        gold: [
          "bg-gradient-to-r from-[#8a6d2f] via-[#c59e4e] to-[#8a6d2f] text-white font-semibold shadow-md shadow-gold/25 border border-amber-300/30",
          "hover:brightness-110 hover:shadow-lg hover:shadow-gold/35",
          "active:brightness-95",
          "disabled:bg-none disabled:bg-gold-soft disabled:text-ink-faint disabled:shadow-none disabled:border-transparent",
        ],
        destructive: [
          "bg-gradient-to-r from-[#991b1b] via-[#bd2929] to-[#991b1b] text-white shadow-sm border border-red-400/25",
          "hover:from-[#ab1f1f] hover:via-[#cf3333] hover:to-[#ab1f1f] hover:shadow-md hover:brightness-105",
          "active:brightness-95",
          "disabled:bg-none disabled:bg-danger/45 disabled:shadow-none disabled:border-transparent",
        ],
        link: [
          "h-auto p-0 text-primary underline-offset-4",
          "hover:underline",
          "active:text-primary-active",
        ],
      },
      size: {
        sm: "h-10 min-h-10 rounded-sm px-3.5 text-body-sm pointer-coarse:min-h-11",
        md: "h-11 min-h-11 rounded-md px-5 text-body-sm",
        lg: "h-12 min-h-12 rounded-md px-6 text-body-md",
        /** Icon-only square. Pair with an accessible label. */
        icon: "size-11 min-h-11 min-w-11 rounded-md p-0",
        "icon-sm": "size-9 min-h-9 min-w-9 rounded-sm p-0 pointer-coarse:size-11 pointer-coarse:min-h-11 pointer-coarse:min-w-11",
      },
      tone: {
        /** Default tone inherits the variant. `inverse` adapts to dark surfaces. */
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
          "bg-gradient-to-r from-white via-[#fbf9f2] to-white text-primary border border-white/50 shadow-md hover:bg-soft-green hover:text-deep hover:shadow-lg active:bg-soft-green-strong",
      },
      {
        variant: "secondary",
        tone: "inverse",
        class:
          "bg-white/15 text-white border border-white/35 backdrop-blur-sm hover:bg-white/25 hover:border-white/60 hover:text-white hover:shadow-sm active:bg-white/30",
      },
      {
        variant: "outline",
        tone: "inverse",
        class:
          "border-2 border-white/80 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-primary hover:shadow-md active:bg-white/90",
      },
      {
        variant: "ghost",
        tone: "inverse",
        class:
          "text-white/90 hover:bg-white/15 hover:text-white active:bg-white/25",
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
  /** Render as the child element (e.g. a Next.js `<Link>`) while keeping styles. */
  asChild?: boolean;
  /** Swaps in a spinner and blocks interaction without changing layout. */
  loading?: boolean;
  /** Announced while `loading` is true. */
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
