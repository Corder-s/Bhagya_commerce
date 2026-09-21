"use client";

import * as React from "react";

/**
 * Returns true once the window has scrolled past `threshold` pixels.
 * Used by the site header to condense (border + shadow + tighter padding) —
 * a single passive listener, rAF-throttled, no scroll-linked animation.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > threshold);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return scrolled;
}
