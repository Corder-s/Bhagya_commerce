"use client";

import dynamic from "next/dynamic";
import * as React from "react";

/**
 * Loaded only when the sheet is opened — see `mobile-menu-panel.tsx`.
 * `ssr: false` because the panel exists purely to render a portal on demand, so
 * there is nothing useful to pre-render.
 */
const MobileMenuPanel = dynamic(
  () => import("@/components/navigation/mobile-menu-panel").then((mod) => mod.MobileMenuPanel),
  { ssr: false },
);

/**
 * MobileMenu — the phone "everything else" entry point.
 *
 * The trigger stays in the header's server-rendered markup, so the hamburger is
 * always one tap away; the sheet itself is fetched the first time it is opened.
 * Keeping the trigger dumb means the header does not carry drawer internals.
 */
export function MobileMenu({
  trigger,
  className,
}: {
  /** A single interactive element — receives the click handler and `aria-*`. */
  trigger: React.ReactElement<{
    onClick?: React.MouseEventHandler<HTMLElement>;
    "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
    "aria-expanded"?: boolean;
  }>;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  const triggerNode = React.cloneElement(trigger, {
    onClick: () => setOpen(true),
    "aria-haspopup": "dialog",
    "aria-expanded": open,
  });

  return (
    <>
      {triggerNode}
      {open ? (
        <MobileMenuPanel open={open} onOpenChange={setOpen} className={className} />
      ) : null}
    </>
  );
}
