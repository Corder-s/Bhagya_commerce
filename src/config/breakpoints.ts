/** Breakpoints mirrored from Tailwind, for use in JS (matchMedia, resize logic). */
export const breakpoints = {
  xs: 320,
  sm: 375,
  smMd: 390,
  md: 430,
  mdLg: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1440,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

/** Media queries for `useMediaQuery`. Mirrors the Tailwind defaults. */
export const mediaQueries = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1440px)",
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
  dark: "(prefers-color-scheme: dark)",
  pointerFine: "(hover: hover) and (pointer: fine)",
} as const;

/** Header behaviour thresholds. */
export const layoutConstants = {
  headerHeight: 72,
  headerHeightMobile: 60,
  tabBarHeight: 64,
  /** Scroll distance (px) after which the header condenses. */
  headerCondenseAt: 24,
} as const;
