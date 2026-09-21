import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Reveal primitives — scroll-triggered entrance, driven by CSS.
 *
 * Why not Framer Motion's `whileInView` here: it renders the hidden state into
 * the server HTML (`style="opacity:0"`), which means the page is invisible until
 * JavaScript hydrates. That is a bad trade for a marketing surface — it costs
 * content in no-JS and failed-hydration cases, and it delays first paint.
 *
 * Instead the hidden state is scoped to `html.js`, a class an inline script in
 * the document head adds before first paint. So:
 *   · JavaScript on  → content animates in, no flash (the class is already set)
 *   · JavaScript off → content is simply visible, which is the correct fallback
 *
 * The observer that flips `data-reveal-state` lives in `RevealObserver`, mounted
 * once in the root layout. These components are therefore server components with
 * no client JavaScript of their own.
 *
 * Variants are `data-reveal` (single element) and `data-reveal-group` (a list
 * whose direct children stagger — see the `--reveal-index` rules in
 * `styles/animations.css`).
 */

/** Tags the reveal components can render. */
type RevealTag = "div" | "section" | "ul" | "ol" | "li" | "article" | "header";

const TAGS = {
  div: "div",
  section: "section",
  ul: "ul",
  ol: "ol",
  li: "li",
  article: "article",
  header: "header",
} as const satisfies Record<RevealTag, keyof React.JSX.IntrinsicElements>;

type RevealStyle = React.CSSProperties & { "--reveal-delay"?: string };

interface RevealBaseProps {
  children: React.ReactNode;
  className?: string;
  /** Entrance delay in seconds — used to sequence a column of copy. */
  delay?: number;
  as?: RevealTag;
}

/**
 * Reveal — fades and lifts one element as it enters the viewport.
 *
 * Prefer `RevealGroup` when several siblings animate together: one observer and
 * one stagger rhythm reads better than a pile of hand-tuned delays.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealBaseProps) {
  const Tag = TAGS[as];

  return (
    <Tag
      data-reveal=""
      style={{ "--reveal-delay": `${delay}s` } as RevealStyle}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

/**
 * RevealGroup — staggers its direct children on one timeline.
 *
 * The stagger itself is CSS (`--reveal-index` × `--reveal-stagger`), assigned by
 * `nth-child`, so children need no props and no index bookkeeping. Set
 * `stagger` in seconds to retune the rhythm; the default is 60ms, which reads as
 * deliberate rather than slow.
 */
export function RevealGroup({
  children,
  className,
  step = 0.06,
  as = "div",
}: RevealBaseProps & {
  /** Delay between consecutive children, in seconds. */
  step?: number;
}) {
  const Tag = TAGS[as];

  return (
    <Tag
      data-reveal-group=""
      style={{ "--reveal-stagger": `${step}s` } as RevealStyle}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

/**
 * RevealItem — a child of `RevealGroup`.
 *
 * Kept for readability at call sites (the item says what it is) and to allow an
 * `as` of `li` inside a `ul` group. It carries no behaviour of its own: the
 * stagger belongs to the parent.
 */
export function RevealItem({
  children,
  className,
  as = "div",
}: Omit<RevealBaseProps, "delay">) {
  const Tag = TAGS[as];

  return <Tag className={cn(className)}>{children}</Tag>;
}
