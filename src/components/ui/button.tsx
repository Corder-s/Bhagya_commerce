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
    "font-sans font-medium whitespace-nowrap",
    "border border-transparent",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-base ease-brand",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-primary text-primary-foreground shadow-xs",
          "hover:bg-primary-hover hover:shadow-sm",
          "active:bg-primary-active",
          "disabled:bg-primary-disabled disabled:text-primary-foreground/80",
        ],
        secondary: [
          "bg-soft-green text-primary border-soft-green-strong",
          "hover:bg-soft-green-strong hover:text-deep",
          "active:bg-soft-green-strong active:text-primary-active",
          "disabled:bg-canvas-deep disabled:text-ink-faint disabled:border-line",
        ],
        outline: [
          "border-line-strong bg-transparent text-ink",
          "hover:border-ink hover:bg-surface/70",
          "active:bg-canvas-deep",
          "disabled:border-line disabled:text-ink-faint",
        ],
        ghost: [
          "bg-transparent text-ink-soft",
          "hover:bg-soft-green/70 hover:text-primary",
          "active:bg-soft-green-strong",
          "disabled:text-ink-faint",
        ],
        destructive: [
          "bg-danger text-white shadow-xs",
          "hover:bg-[#8f1e1e] hover:shadow-sm",
          "active:bg-[#7a1a1a]",
          "disabled:bg-danger/45",
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
        class: "bg-canvas text-primary hover:bg-soft-green active:bg-soft-green-strong",
      },
      {
        variant: "outline",
        tone: "inverse",
        class:
          "border-line-inverse text-ink-inverse hover:border-ink-inverse hover:bg-ink-inverse/10 active:bg-ink-inverse/15",
      },
      {
        variant: "ghost",
        tone: "inverse",
        class:
          "text-ink-inverse-soft hover:bg-ink-inverse/10 hover:text-ink-inverse active:bg-ink-inverse/15",
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
