"use client";

import { X } from "lucide-react";
import * as React from "react";

import { mediaQueries } from "@/config/breakpoints";
import { announcements } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const ROTATE_MS = 6500;

/**
 * AnnouncementBar — thin brand strip above the header.
 *
 * Messages cross-fade on a long interval and rotation stops entirely when the
 * user prefers reduced motion or is on a small screen (where the strip would
 * eat scarce vertical space, so only the first message shows and the bars stay
 * dismissible). Dismissal is per browser session, not persisted.
 */
export function AnnouncementBar() {
  const [index, setIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);
  const prefersReducedMotion = useMediaQuery(mediaQueries.reducedMotion);
  const isMobile = useMediaQuery(mediaQueries.mobile);

  React.useEffect(() => {
    if (dismissed || prefersReducedMotion || isMobile) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % announcements.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(timer);
  }, [dismissed, isMobile, prefersReducedMotion]);

  if (dismissed) return null;

  const message = isMobile ? announcements[0] : announcements[index];

  return (
    <div
      data-surface="inverse"
      className="relative bg-[#151515] border-b border-[#26241F] text-[#FFFDF8] print:hidden"
    >
      <div className="container-wide flex min-h-9 items-center justify-center gap-3 py-1.5">
        <p
          aria-live="polite"
          className="text-center text-caption font-medium text-ink-inverse"
        >
          <span className="sr-only">{siteConfig.tagline}. </span>
          <span key={message} className="inline-block animate-fade-in">
            {message}
          </span>
        </p>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className={cn(
            "absolute right-2 grid size-8 place-items-center rounded-sm text-ink-inverse-soft",
            "transition-colors duration-fast ease-brand",
            "hover:bg-ink-inverse/10 hover:text-ink-inverse",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
          )}
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
