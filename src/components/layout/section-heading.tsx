import type { Route } from "next";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * SectionHeading — the in-page heading pattern (h2 level).
 *
 * Keeps three things consistent across marketing and account surfaces: the
 * editorial serif for storytelling, a sans variant for functional sections, and
 * the "eyebrow → title → description → action" rhythm. Always renders an `h2`
 * so the document outline stays linear under each page's single `h1`.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  variant = "display",
  align = "start",
  className,
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { label: string; href: Route };
  /** `display` = editorial serif, `heading` = UI sans. */
  variant?: "display" | "heading";
  align?: "start" | "center";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        "md:flex-row md:items-end md:justify-between md:gap-10",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("flex max-w-2xl flex-col gap-2.5", align === "center" && "items-center")}>
        {eyebrow ? <p className="label-text text-gradient-gold font-semibold">{eyebrow}</p> : null}

        {variant === "display" ? (
          <h2
            id={id}
            className="font-display text-display-md font-medium text-ink text-balance"
          >
            {title}
          </h2>
        ) : (
          <h2 id={id} className="text-heading-xl text-ink text-balance">
            {title}
          </h2>
        )}

        {description ? (
          <p className="text-body-md text-ink-soft">{description}</p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm text-body-sm font-medium text-primary transition-colors duration-fast hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {action.label}
          <span
            aria-hidden="true"
            className="transition-transform duration-base ease-brand group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      ) : null}
    </div>
  );
}
