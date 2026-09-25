import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionProps extends React.ComponentProps<"section"> {
  /** Vertical rhythm preset. */
  spacing?: "none" | "sm" | "md" | "lg";
  /** Surface treatment — ivory is the app default, keep green for emphasis. */
  surface?: "none" | "ivory" | "canvas" | "soft-green" | "deep" | "sand";
  /**
   * Accessible name. Supply it (or `aria-labelledby`) for every section that
   * is a landmark, i.e. one that a screen-reader user would want to jump to.
   */
  label?: string;
  /** Headings level for the section's own heading, set by `SectionHeading`. */
  contained?: boolean;
}

const spacingStyles = {
  none: "py-0",
  sm: "py-[var(--section-y-sm)]",
  md: "py-[var(--section-y)]",
  lg: "py-[calc(var(--section-y)*1.35)]",
} as const;

const surfaceStyles = {
  none: "",
  ivory: "bg-canvas text-ink",
  canvas: "canvas-atmosphere text-ink",
  "soft-green": "bg-gold-surface text-ink",
  deep: "bg-deep text-ink-inverse",
  sand: "bg-canvas-deep text-ink",
} as const;

/**
 * Section — a page band with consistent vertical rhythm and surface.
 * Renders `<section>` so the page outline stays semantic; `label` becomes the
 * accessible name of the landmark rather than a visual heading.
 */
function Section({
  className,
  spacing = "md",
  surface = "none",
  label,
  contained = true,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      data-surface={surface === "deep" ? "inverse" : undefined}
      aria-label={label}
      className={cn(spacingStyles[spacing], surfaceStyles[surface], className)}
      {...props}
    >
      {contained ? (
        <div className="container-page">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

export { Section };
