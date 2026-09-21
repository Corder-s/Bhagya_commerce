import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "inline-block shrink-0 animate-spin rounded-pill border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "size-3 border",
        sm: "size-4 border-2",
        md: "size-5 border-2",
        lg: "size-8 border-[3px]",
      },
      tone: {
        default: "text-primary",
        inverse: "text-ink-inverse",
        muted: "text-ink-faint",
      },
    },
    defaultVariants: { size: "sm", tone: "default" },
  },
);

export interface SpinnerProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof spinnerVariants> {
  /** Announced to assistive tech; set `null` when a parent already announces. */
  label?: string | null;
}

function Spinner({
  className,
  size,
  tone,
  label = "Loading",
  ...props
}: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role={label ? "status" : undefined}
      className={cn(spinnerVariants({ size, tone }), className)}
      {...props}
    >
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

export { Spinner, spinnerVariants };
