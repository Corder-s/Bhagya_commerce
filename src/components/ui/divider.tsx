import { cn } from "@/lib/utils";
import * as React from "react";

export interface DividerProps extends Omit<React.ComponentProps<"div">, "ref"> {
  orientation?: "horizontal" | "vertical";
  /** Optional centred caption, e.g. "or continue with". */
  label?: React.ReactNode;
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingMap = {
  none: "my-0",
  sm: "my-3",
  md: "my-5",
  lg: "my-8",
} as const;

/**
 * Divider — hairline separator, optionally with a centred label.
 * Renders as `<hr>` in the semantic horizontal case so assistive tech treats it
 * as a thematic break rather than a decorative box.
 */
function Divider({
  orientation = "horizontal",
  label,
  spacing = "md",
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        data-slot="divider"
        role="separator"
        aria-orientation="vertical"
        className={cn("mx-3 w-px self-stretch bg-line", className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        data-slot="divider"
        className={cn(
          "flex items-center gap-4 text-caption text-ink-soft",
          spacingMap[spacing],
          className,
        )}
        {...props}
      >
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="shrink-0">{label}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
    );
  }

  return (
    <hr
      data-slot="divider"
      className={cn(
        "h-px w-full border-0 bg-line",
        spacingMap[spacing],
        className,
      )}
      {...props}
    />
  );
}

export { Divider };
