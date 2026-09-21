import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PageTransition — the route-level entrance, in CSS.
 *
 * Lives in a route group's `template.tsx`, never in the root layout: a
 * transformed ancestor breaks `position: sticky` for the site header and
 * `position: fixed` for the mobile tab bar, so the chrome stays outside this
 * wrapper.
 *
 * The animation is a keyframe rather than a JavaScript-driven tween so it starts
 * at first paint — no hydration delay, and no `style="opacity:0"` in the server
 * HTML if the bundle fails to load (see the `html.js` gate in
 * `styles/animations.css`).
 *
 * This is a server component: it costs no client JavaScript at all.
 */
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-page-transition="" className={cn("flex flex-1 flex-col", className)}>
      {children}
    </div>
  );
}
