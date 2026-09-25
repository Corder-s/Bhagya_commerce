"use client";

import * as React from "react";

import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
}

const sizeStyles: Record<NonNullable<InputProps["inputSize"]>, string> = {
  sm: "h-10 text-xs rounded-xl",
  md: "h-11 text-sm rounded-xl",
  lg: "h-12 text-sm sm:text-base rounded-xl",
};

/**
 * Input — standardized text and search entry for Bhagya Commerce.
 */
function Input({
  className,
  type = "text",
  leadingIcon,
  trailingIcon,
  inputSize = "md",
  id,
  ...props
}: InputProps) {
  const field = useFieldControl({ id, invalid: undefined });

  const control = (
    <input
      data-slot="input"
      type={type}
      id={field.id}
      aria-describedby={field["aria-describedby"]}
      aria-invalid={field["aria-invalid"]}
      aria-required={field["aria-required"]}
      className={cn(
        "w-full border border-line bg-surface text-ink",
        "transition-[border-color,box-shadow] duration-fast ease-brand",
        "placeholder:text-ink-subtle",
        "hover:border-primary/50",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas-deep disabled:text-ink-subtle",
        "read-only:bg-canvas-deep",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        "[&::-webkit-search-cancel-button]:appearance-none",
        sizeStyles[inputSize],
        leadingIcon ? "pl-11" : "px-3.5",
        trailingIcon ? "pr-11" : "px-3.5",
        leadingIcon && trailingIcon ? "px-11" : undefined,
        className,
      )}
      {...props}
    />
  );

  if (!leadingIcon && !trailingIcon) return control;

  return (
    <div data-slot="input-wrapper" className="relative w-full">
      {leadingIcon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-ink-subtle [&_svg]:size-4"
        >
          {leadingIcon}
        </span>
      ) : null}
      {control}
      {trailingIcon ? (
        <span className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-subtle [&_svg]:size-4">
          {trailingIcon}
        </span>
      ) : null}
    </div>
  );
}

export { Input };
