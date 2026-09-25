import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card — surface primitive for Bhagya Commerce
 * All cards adapt seamlessly to light and dark themes using semantic design tokens.
 */
const cardVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      /** Primary surface with soft adaptive border */
      surface: "bg-surface border border-line shadow-xs",
      /** Plain grouping container without borders */
      plain: "bg-transparent",
      /** Raised card with subtle elevation */
      raised: "bg-surface border border-line shadow-sm",
      /** Secondary canvas / accent surface */
      botanical: "bg-canvas-deep border border-line",
      /** Dark charcoal surface */
      inverse: "bg-charcoal text-ink-inverse border border-line-strong",
    },
    padding: {
      none: "p-0",
      sm: "p-3.5 sm:p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    },
    radius: {
      md: "rounded-xl",
      lg: "rounded-2xl",
      xl: "rounded-3xl",
    },
    interactive: {
      true: [
        "transition-[border-color,box-shadow,transform] duration-base ease-brand cursor-pointer",
        "hover:border-primary/70 hover:shadow-md hover:-translate-y-0.5",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
      ],
      false: "",
    },
  },
  defaultVariants: {
    variant: "surface",
    padding: "md",
    radius: "lg",
    interactive: false,
  },
});

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({
  className,
  variant,
  padding,
  radius,
  interactive,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ variant, padding, radius, interactive }),
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 pb-4", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-base sm:text-lg font-bold text-ink", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-xs sm:text-sm text-ink-soft", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-3 pt-4 border-t border-line/60", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cardVariants,
};
