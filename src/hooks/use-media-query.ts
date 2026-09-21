"use client";

import * as React from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Implemented with `useSyncExternalStore` rather than an effect + state pair:
 * the browser owns this value, React should subscribe to it, and the server
 * snapshot is `false` so SSR markup and the first client render always agree.
 *
 * Prefer CSS-driven responsiveness for layout and reach for this hook only when
 * *behaviour* (not just styling) has to change with breakpoint.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  const getSnapshot = React.useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  /** Server and first client render: assume the wide layout. */
  const getServerSnapshot = () => false;

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
