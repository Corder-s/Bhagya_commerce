import * as React from "react";

import { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "size" | "children"> {
  /** Required: icon buttons have no visible text, so the label is the a11y name. */
  label: string;
  children: React.ReactNode;
  /** Optional tooltip text; falls back to `label` on fine pointers only. */
  tooltip?: string;
  size?: "icon" | "icon-sm";
}

/**
 * IconButton — a square, labelled affordance for toolbars, headers and cards.
 * The accessible name is mandatory; a tooltip is layered on top for mouse users
 * and never replaces the label.
 */
function IconButton({
  label,
  tooltip,
  children,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}: IconButtonProps) {
  const button = (
    <Button
      aria-label={label}
      title={tooltip ? undefined : label}
      variant={variant}
      size={size}
      className={cn(
        "rounded-md text-ink-soft hover:text-primary",
        "data-[state=open]:bg-soft-green data-[state=open]:text-primary",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );

  if (!tooltip) return button;

  return (
    <Tooltip content={tooltip} side="bottom">
      {button}
    </Tooltip>
  );
}

export { IconButton, buttonVariants };
