"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

import { transition } from "@/lib/motion";
import * as React from "react";

/**
 * MotionProvider — one place that decides how motion behaves app-wide.
 *
 * `reducedMotion="user"` makes Framer Motion skip transform/layout animation
 * whenever the OS reports `prefers-reduced-motion: reduce`, so no component has
 * to check the media query itself.
 *
 * `LazyMotion` + the `domAnimation` feature set load only what the product
 * actually uses (fade, lift, stagger, exit) instead of the full `motion` bundle,
 * which keeps roughly 20 kB of gestures, drag and layout animation out of the
 * first load. `strict` enforces the pairing: components must use `m.*`, and the
 * build fails loudly if someone reaches for `motion.*` and re-inflates the
 * bundle. If drag or layout animation is ever needed, switch the feature set to
 * `domMax` here and nowhere else.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={transition.brand}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
