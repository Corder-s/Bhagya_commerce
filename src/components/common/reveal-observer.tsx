"use client";

import * as React from "react";

const VISIBLE = "visible";

/**
 * RevealObserver — one IntersectionObserver for every `[data-reveal]` element.
 *
 * Mounted once in the root layout. Why a single shared observer:
 *
 *  · Cost — a page can carry 60+ reveal elements. One observer watching many
 *    targets is a fraction of the main-thread work of one observer each, and it
 *    means the reveal components themselves stay server-rendered.
 *  · Correctness — elements can also arrive *after* the first effect runs (a
 *    route transition swaps the subtree, tabs render a panel on demand), so the
 *    observer is re-scanned on a `MutationObserver` rather than on mount only.
 *  · Fallback — if `IntersectionObserver` is missing, everything is marked
 *    visible immediately: an entrance animation is never worth hiding content.
 *
 * Elements reveal once and are then unobserved — a section that fades every time
 * it scrolls back into view is distracting.
 */
export function RevealObserver() {
  React.useEffect(() => {
    const root = document.documentElement;

    const markVisible = (element: Element) => {
      element.setAttribute("data-reveal-state", VISIBLE);
    };

    if (typeof IntersectionObserver === "undefined") {
      root.querySelectorAll("[data-reveal], [data-reveal-group]").forEach(markVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          markVisible(entry.target);
          observer.unobserve(entry.target);
        }
      },
      {
        // Fire a little before the element is fully on screen so the motion has
        // finished by the time it reaches comfortable reading position.
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.01,
      },
    );

    const scan = () => {
      root
        .querySelectorAll("[data-reveal]:not([data-reveal-state]), [data-reveal-group]:not([data-reveal-state])")
        .forEach((element) => observer.observe(element));
    };

    scan();

    // Route changes and lazily rendered panels add elements after mount.
    const mutations = new MutationObserver(scan);
    mutations.observe(document.body, { childList: true, subtree: true });

    // Safety net: whatever the cause, nothing stays hidden for long.
    const failsafe = window.setTimeout(() => {
      root.querySelectorAll("[data-reveal]:not([data-reveal-state])").forEach(markVisible);
    }, 3000);

    return () => {
      observer.disconnect();
      mutations.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
