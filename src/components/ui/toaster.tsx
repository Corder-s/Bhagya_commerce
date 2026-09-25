"use client";

import dynamic from "next/dynamic";
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { mediaQueries } from "@/config/breakpoints";

/**
 * Sonner is pulled in on demand. Toasts are always a response to a user action,
 * so the library has no business in the first load of every route; the queue
 * lives in the (also lazily loaded) `toast` store, and anything raised before
 * this mounts is shown the moment it does.
 */
const SonnerToaster = dynamic(() => import("sonner").then((mod) => mod.Toaster), {
  ssr: false,
});

/**
 * Toaster — mounts the app's toast region once, in the root layout.
 *
 * Styled to the Bhagya surface system (white card, hairline, restrained
 * shadow). Phones get toasts at the top, clear of the bottom tab bar; larger
 * screens get them bottom-right, out of the reading column.
 */
function Toaster() {
  const isMobile = useMediaQuery(mediaQueries.mobile);

  return (
    <SonnerToaster
      position={isMobile ? "top-center" : "bottom-right"}
      offset={isMobile ? 16 : 24}
      gap={10}
      visibleToasts={3}
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex w-full items-start gap-3 rounded-lg border border-line bg-surface p-4 shadow-lg",
          title: "text-body-sm font-semibold text-ink",
          description: "mt-1 text-caption text-ink-soft",
          actionButton:
            "ml-auto shrink-0 rounded-sm px-2.5 py-1.5 text-caption font-semibold text-[#9A6A20] hover:bg-[#FAF5EA] focus-visible:outline-2 focus-visible:outline-offset-2",
          cancelButton:
            "ml-auto shrink-0 rounded-sm px-2.5 py-1.5 text-caption font-medium text-ink-soft hover:bg-canvas-deep focus-visible:outline-2 focus-visible:outline-offset-2",
          closeButton:
            "absolute right-2 top-2 grid size-7 place-items-center rounded-sm text-ink-faint transition-colors hover:bg-canvas-deep hover:text-ink",
          icon: "mt-0.5 shrink-0 [&_svg]:size-4",
          success: "[&_[data-icon]]:text-success",
          error: "[&_[data-icon]]:text-danger",
          warning: "[&_[data-icon]]:text-warning",
          info: "[&_[data-icon]]:text-info",
          loading: "[&_[data-icon]]:text-[#C49A45]",
        },
      }}
      style={
        {
          "--width": "min(24rem, calc(100vw - 2rem))",
        } as React.CSSProperties
      }
    />
  );
}

export { Toaster };
