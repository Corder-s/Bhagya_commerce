import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Card — a surface primitive, not a container to over-decorate.
 * Elevation is deliberately restrained: borders first, shadows only when a
 * card needs to lift off a busy background.
 */
const cardVariants = cva("relative flex flex-col", {
  variants: {
    variant: {
      /** Ivory/white surface with a hairline — the default in most UI. */
      surface: "bg-surface border border-line",
      /** No border or fill: for grouping inside dense layouts. */
      plain: "bg-transparent",
      /** Sits on ivory with a soft shadow instead of a border. */
      raised: "bg-surface shadow-sm",
      /** Botanical fill for editorial emphasis. */
      botanical: "bg-soft-green border border-soft-green-strong",
      /** Deep green — use sparingly, invert text inside. */
      inverse: "bg-deep text-ink-inverse border border-transparent",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-5 sm:p-6",
      lg: "p-6 sm:p-8",
    },
    radius: {
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
    },
    interactive: {
      true: [
        "transition-[border-color,box-shadow,transform] duration-base ease-brand",
        "hover:border-line-strong hover:shadow-md hover:-translate-y-0.5",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
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
      className={cn("text-heading-md text-ink", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-body-sm text-ink-soft", className)}
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
      className={cn("flex items-center gap-3 pt-4", className)}
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
