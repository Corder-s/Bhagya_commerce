import * as React from "react";

import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.ComponentProps<"header">, "title"> {
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: readonly Crumb[];
  /** Actions render on the trailing edge on desktop, below on mobile. */
  actions?: React.ReactNode;
  /** `display` uses the editorial serif; `heading` stays in the UI sans. */
  variant?: "display" | "heading" | "compact";
  align?: "start" | "center";
  /** Tabs, filters or meta rows that belong to the header block. */
  meta?: React.ReactNode;
}

/**
 * PageHeader — the single h1 for a route, with breadcrumbs and actions.
 *
 * Every page gets exactly one `PageHeader`; section headings inside the page use
 * `h2`/`h3`. That keeps the document outline linear and skimmable for screen
 * readers and search engines.
 */
function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  variant = "heading",
  align = "start",
  meta,
  className,
  ...props
}: PageHeaderProps) {
  const titleStyles = {
    display: "font-display text-display-md font-medium text-ink",
    heading: "text-heading-xl text-ink",
    compact: "text-heading-lg text-ink",
  }[variant];

  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-5 border-b border-line pb-6 sm:pb-8",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {breadcrumbs?.length ? (
        <Breadcrumb items={breadcrumbs} className="-mb-1" />
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-5",
          "lg:flex-row lg:items-end lg:justify-between lg:gap-8",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-col gap-2.5",
            align === "center" && "items-center",
          )}
        >
          {eyebrow ? (
            <p className="label-text text-gold-deep">{eyebrow}</p>
          ) : null}
          <h1 className={cn(titleStyles, "text-balance")}>{title}</h1>
          {description ? (
            <p className="max-w-2xl text-body-md text-ink-soft">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div
            className={cn(
              "flex shrink-0 flex-wrap items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>

      {meta ? <div className="flex flex-wrap items-center gap-4">{meta}</div> : null}
    </header>
  );
}

export { PageHeader };
