"use client";

import * as React from "react";

import { useFieldControl } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  /** Grows with content up to `maxRows`. Falls back to a fixed box otherwise. */
  autoResize?: boolean;
  maxRows?: number;
}

/**
 * Textarea — long-form input (product descriptions, addresses, notes).
 * Inherits id / aria-describedby / aria-invalid from a surrounding `Field`.
 */
function Textarea({
  className,
  autoResize = false,
  maxRows = 10,
  rows = 4,
  id,
  value,
  onInput,
  ...props
}: TextareaProps) {
  const field = useFieldControl({ id });
  const elementRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = React.useCallback(
    (element: HTMLTextAreaElement) => {
      if (!autoResize) return;
      const lineHeight = Number.parseFloat(
        window.getComputedStyle(element).lineHeight || "24",
      );
      element.style.height = "auto";
      const max = lineHeight * maxRows + 24;
      element.style.height = `${Math.min(element.scrollHeight, max)}px`;
      element.style.overflowY =
        element.scrollHeight > max ? "auto" : "hidden";
    },
    [autoResize, maxRows],
  );

  // Keep auto-resize correct when the value is controlled from outside.
  React.useEffect(() => {
    if (elementRef.current && autoResize) resize(elementRef.current);
  }, [autoResize, resize, value]);

  return (
    <textarea
      ref={elementRef}
      data-slot="textarea"
      id={field.id}
      rows={rows}
      aria-describedby={field["aria-describedby"]}
      aria-invalid={field["aria-invalid"]}
      aria-required={field["aria-required"]}
      value={value}
      onInput={(event) => {
        resize(event.currentTarget);
        onInput?.(event);
      }}
      className={cn(
        "w-full rounded-md border border-line-strong bg-surface px-3.5 py-3 text-body-sm text-ink",
        "min-h-28 resize-y",
        autoResize && "resize-none",
        "transition-[border-color,box-shadow] duration-fast ease-brand",
        "placeholder:text-ink-faint",
        "hover:border-ink-subtle",
        "focus:border-primary focus:outline-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas-deep disabled:text-ink-faint",
        "aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
