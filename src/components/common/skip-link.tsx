import * as React from "react";

/**
 * SkipLink — the first element in the tab order.
 *
 * Lets keyboard and screen-reader users jump past the header chrome straight to
 * `#main`. Off-screen until focused (`sr-only-focusable`), then pinned to the
 * top-left corner above the header's z-index.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed left-4 top-4 z-toast inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-body-sm font-medium text-primary-foreground shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Skip to content
    </a>
  );
}
