import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The Bhagya botanical mark.
 *
 * A single leaf formed from two mirrored strokes around a centre vein, with a
 * seed dot at the base — origami-plain, drawn on a 32-unit grid so it stays
 * crisp from favicon (16px) to hero (96px). No gradients, no thin strokes below
 * 1.5 units: it must survive being printed small.
 *
 * Colour comes from `currentColor` so the same geometry works on ivory, on deep
 * green and in a single-colour favicon.
 */
function BhagyaLeaf({
  className,
  strokeWidth = 2,
  ...props
}: Omit<React.ComponentProps<"svg">, "strokeWidth"> & { strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8", className)}
      {...props}
    >
      {/* Leaf body — asymmetric for a hand-drawn feel */}
      <path
        d="M16 29.2c0-6.4.9-11.4 3.9-15.3C22.7 10.4 25.6 8.6 29 7.6c1 5.4.4 10.2-2 13.8-2.4 3.6-6.3 5.6-11 5.7Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M16 29.2c0-6.4-.9-11.4-3.9-15.3C9.3 10.4 6.4 8.6 3 7.6c-1 5.4-.4 10.2 2 13.8 2.4 3.6 6.3 5.6 11 5.7Z"
        fill="currentColor"
        opacity="0.62"
      />
      {/* Centre vein */}
      <path
        d="M16 29.2V12.6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="text-[var(--bhagya-ivory)]"
        opacity="0.85"
      />
      {/* Seed */}
      <circle cx="16" cy="30.2" r="1.5" fill="currentColor" />
    </svg>
  );
}

export interface BrandMarkProps extends React.ComponentProps<"span"> {
  /**
   *  full     leaf + wordmark + tagline — header and footer
   *  compact  leaf + wordmark — tight horizontal space
   *  mobile   leaf + short wordmark — small screens
   *  mark     leaf only — favicon, app icon, collapsed rails
   */
  variant?: "full" | "compact" | "mobile" | "mark";
  size?: "sm" | "md" | "lg";
  /** Set when the mark sits on a dark surface. */
  tone?: "default" | "inverse";
  /** Renders the tagline under the wordmark (full variant only). */
  showTagline?: boolean;
}

const sizeStyles = {
  sm: { leaf: "size-6", word: "text-body-sm tracking-[0.16em]", tag: "text-[0.5625rem]" },
  md: { leaf: "size-8", word: "text-[1.0625rem] tracking-[0.15em]", tag: "text-[0.625rem]" },
  lg: { leaf: "size-10", word: "text-heading-md tracking-[0.14em]", tag: "text-caption" },
} as const;

/**
 * BrandMark — the logo lockup.
 *
 * Wordmark is set in the UI sans with wide, deliberate letter-spacing: the
 * editorial serif is reserved for storytelling headings, so the brand stays
 * legible next to navigation. Renders as text, not an image, so it scales
 * without an asset request and remains selectable/readable to crawlers.
 */
function BrandMark({
  className,
  variant = "full",
  size = "md",
  tone = "default",
  showTagline = true,
  ...props
}: BrandMarkProps) {
  const styles = sizeStyles[size];
  const isMarkOnly = variant === "mark";

  return (
    <span
      data-slot="brand-mark"
      data-variant={variant}
      className={cn(
        "inline-flex items-center gap-2.5",
        tone === "inverse" ? "text-ink-inverse" : "text-primary",
        className,
      )}
      {...props}
    >
      <BhagyaLeaf className={cn(styles.leaf, "shrink-0")} />
      {!isMarkOnly ? (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              "font-sans font-semibold uppercase",
              styles.word,
              tone === "inverse" ? "text-ink-inverse" : "text-primary",
            )}
          >
            {variant === "mobile" ? "Bhagya" : "Bhagya Commerce"}
          </span>
          {showTagline && variant === "full" ? (
            <span
              className={cn(
                "mt-1 truncate font-display italic",
                styles.tag,
                tone === "inverse" ? "text-ink-inverse-soft" : "text-ink-soft",
              )}
            >
              Good for People. Great for Tomorrow.
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

/** Bare leaf for icons, favicons and decorative uses. */
function BhagyaGlyph({
  className,
  ...props
}: Omit<React.ComponentProps<"svg">, "strokeWidth"> & { strokeWidth?: number }) {
  return <BhagyaLeaf className={cn("size-5", className)} {...props} />;
}

export { BhagyaGlyph, BrandMark };
