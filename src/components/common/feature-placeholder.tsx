import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface FeaturePlaceholderProps extends React.ComponentProps<"div"> {
  /** Phase this surface is scheduled for, e.g. "Phase 2". */
  phase?: string;
  /** What will live here, in the product's own words. */
  summary: string;
  /** Concrete build steps, shown as a checklist so scope stays honest. */
  upcoming?: readonly string[];
  /** Data or capability this surface will depend on. */
  dependencies?: readonly string[];
  eyebrow?: string;
}

/**
 * FeaturePlaceholder — the honest "this route exists, its feature does not"
 * surface used by Phase 1 route shells.
 *
 * It is deliberately plain: it explains what belongs here and what it will need,
 * so the shell documents the architecture instead of pretending to be finished
 * functionality. Every one of these is replaced by real UI in later phases.
 */
export function FeaturePlaceholder({
  phase = "Phase 2",
  summary,
  upcoming,
  dependencies,
  eyebrow,
  className,
  children,
  ...props
}: FeaturePlaceholderProps) {
  return (
    <Card
      variant="surface"
      padding="lg"
      className={cn("max-w-3xl", className)}
      {...props}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="botanical" size="md">
            {phase}
          </Badge>
          {eyebrow ? <span className="label-text text-ink-faint">{eyebrow}</span> : null}
        </div>

        <p className="max-w-2xl text-body-md text-ink-soft">{summary}</p>

        {upcoming?.length ? (
          <div className="flex flex-col gap-2.5">
            <h2 className="label-text text-ink-faint">Planned for this surface</h2>
            <ul className="flex flex-col gap-2">
              {upcoming.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body-sm text-ink-soft">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="mt-1 size-3.5 shrink-0 text-[#C49A45]"
                  >
                    <path
                      d="M2.5 8.5 6 12l7.5-8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {dependencies?.length ? (
          <div className="flex flex-col gap-2.5 border-t border-line pt-4">
            <h2 className="label-text text-ink-faint">Depends on</h2>
            <ul className="flex flex-wrap gap-2">
              {dependencies.map((item) => (
                <li key={item}>
                  <Badge tone="outline" size="lg">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {children}
      </div>
    </Card>
  );
}
