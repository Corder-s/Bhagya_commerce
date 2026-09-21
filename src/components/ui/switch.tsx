"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Switch — instant on/off preferences (notifications, store visibility).
 * Uses a check glyph in the thumb so state is not conveyed by colour alone.
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group inline-flex h-6 w-11 shrink-0 items-center rounded-pill border border-transparent",
        "bg-line-strong",
        "transition-colors duration-fast ease-brand",
        "hover:bg-ink-faint",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:bg-line disabled:opacity-70",
        "data-[state=checked]:bg-primary data-[state=checked]:hover:bg-primary-hover",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none flex size-5 items-center justify-center rounded-pill bg-surface shadow-xs",
          "translate-x-0.5 transition-transform duration-base ease-brand",
          "data-[state=checked]:translate-x-[1.375rem]",
        )}
      >
        {/* Glyph confirms "on" for users who cannot rely on the fill colour. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className="size-2.5 text-primary opacity-0 transition-opacity duration-fast ease-brand group-data-[state=checked]:opacity-100"
        >
          <path
            d="M1.5 6.4 4.3 9 10.5 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
