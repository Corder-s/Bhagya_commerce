/**
 * Motion system — JavaScript layer.
 *
 * Division of labour, decided deliberately:
 *
 *   Entrance motion (scroll reveal, route transition) → CSS, in
 *   `styles/animations.css`. It must start at first paint and must never hide
 *   content when JavaScript does not run, which is exactly what a CSS keyframe
 *   scoped to `html.js` guarantees and a JS-driven tween cannot.
 *
 *   Interaction motion (a control responding to a tap, a panel responding to a
 *   tab change) → Framer Motion, here. These start at rest and animate because
 *   the user acted, so there is nothing to gate and nothing to hide.
 *
 * Keep this file small: if a value is needed in more than one place, it belongs
 * here rather than inline, and the CSS equivalents stay in step with the
 * `--ease-*` and `--duration-*` tokens in `styles/tokens.css`.
 */

import type { Transition, Variants } from "framer-motion";

/** The brand curve — a fast start, a long settle. Mirrors `--ease-brand`. */
export const EASE_BRAND = [0.22, 1, 0.36, 1] as const;

/** Softer variant, for anything that moves further than a few pixels. */
export const EASE_SOFT = [0.16, 1, 0.3, 1] as const;

/** Shared timing, in seconds. Mirrors the `--duration-*` tokens. */
export const duration = {
  fast: 0.15,
  base: 0.24,
  slow: 0.42,
} as const;

export const transition = {
  brand: { duration: duration.base, ease: EASE_BRAND },
  /** Overshoot-free spring: used where a value tracks a pointer or a size. */
  spring: { type: "spring", stiffness: 420, damping: 34, mass: 0.7 },
} as const satisfies Record<string, Transition>;

/**
 * `pop` — a control acknowledging a state change.
 *
 * A scale bounce reads as "that registered" without moving the layout around
 * it, which is why it is used for the wishlist toggle rather than a colour
 * change alone (colour alone would also fail the accessibility rule).
 */
export const pop: Variants = {
  rest: { scale: 1 },
  popped: { scale: [1, 1.22, 1], transition: { duration: duration.slow, ease: EASE_BRAND } },
};

/** Subtle press feedback for large custom controls. */
export const press = {
  whileTap: { scale: 0.985 },
} as const;
