import { ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import * as React from "react";


export interface Crumb {
  label: string;
  href?: Route;
}

/**
 * Breadcrumb — way-finding for catalogue and account depth.
 * Renders an ordered list in `<nav aria-label="Breadcrumb">` with `aria-current`
 * on the final item so the current page is announced rather than highlighted.
 */
function Breadcrumb({
  items,
  className,
  collapseFrom = 4,
}: {
  items: readonly Crumb[];
  className?: string;
  /** Collapses the middle of long trails behind an ellipsis. */
  collapseFrom?: number;
}) {
  if (items.length === 0) return null;

  const shouldCollapse = items.length > collapseFrom;
  const head = items[0];
  const middle = shouldCollapse ? items.slice(1, items.length - 2) : [];
  const tail = shouldCollapse ? items.slice(items.length - 2) : items.slice(1);

  if (!head) return null;

  const renderCrumb = (item: Crumb, isLast: boolean, key: string) => (
    <li key={key} className="flex items-center gap-2">
      {isLast || !item.href ? (
        <span
          aria-current="page"
          className="max-w-[16rem] truncate text-body-sm font-medium text-ink"
        >
          {item.label}
        </span>
      ) : (
        <Link
          href={item.href}
          className="max-w-[14rem] truncate rounded-xs text-body-sm text-ink-soft transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {item.label}
        </Link>
      )}
    </li>
  );

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2">
        {renderCrumb(head, items.length === 1, "crumb-head")}
        {shouldCollapse ? (
          <li className="flex items-center gap-2">
            <ChevronRight
              className="size-3.5 shrink-0 text-ink-faint"
              aria-hidden="true"
            />
            <span title={middle.map((item) => item.label).join(" / ")}>
              <MoreHorizontal
                className="size-4 text-ink-faint"
                aria-hidden="true"
              />
              <span className="sr-only">
                {middle.length} hidden items:{" "}
                {middle.map((item) => item.label).join(", ")}
              </span>
            </span>
          </li>
        ) : null}
        {tail.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight
              className="size-3.5 shrink-0 text-ink-faint"
              aria-hidden="true"
            />
            {renderCrumb(item, index === tail.length - 1, `${item.label}-${index}`)}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
