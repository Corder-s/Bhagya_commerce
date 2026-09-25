import * as React from "react";

import { BhagyaGlyph } from "@/components/common/brand-mark";
import { cn } from "@/lib/utils";
import type { TileTone } from "@/types/catalogue";

const toneStyles: Record<TileTone, string> = {
  "soft-green": "bg-[#F3E6C8] text-[#9A6A20]",
  sand: "bg-sand text-ink",
  deep: "bg-deep text-ink-inverse",
  canvas: "bg-canvas-deep text-ink-soft",
};

/**
 * MediaTile — the stand-in for a record whose photograph has not been shot yet.
 *
 * Used by category, journal and collection cards when `image` is null. It is a
 * *designed* tile, not a broken image: brand tone plus the Bhagya leaf motif,
 * and optionally the record's name when nothing else on the card says it. It is
 * `aria-hidden` because the card's own text names the thing — the tile is
 * decoration, so the accessible tree stays clean.
 */
export function MediaTile({
  label,
  tone = "soft-green",
  className,
}: {
  /** Omit when the surrounding card already names the record. */
  label?: string;
  tone?: TileTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-full items-center justify-center overflow-hidden",
        toneStyles[tone],
        className,
      )}
    >
      {/* Oversized leaf — geometry instead of stock photography. */}
      <BhagyaGlyph
        className={cn(
          "absolute -right-6 -bottom-8 size-40 opacity-[0.14]",
          tone === "deep" && "opacity-[0.22]",
        )}
      />
      {label ? (
        <span className="relative px-6 text-center font-display text-heading-lg">
          {label}
        </span>
      ) : null}
    </span>
  );
}
