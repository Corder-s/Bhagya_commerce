import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface SuccessStateProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
  /** Confirmation detail rows, e.g. order number and estimated delivery. */
  details?: readonly { label: string; value: React.ReactNode }[];
  actions?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Heading level for the title — use `h1` when this is the page's main content. */
  titleAs?: "h1" | "h2" | "h3";
}

const sizeStyles = {
  sm: { wrap: "gap-3 py-8 px-4", frame: "size-11", title: "text-heading-md" },
  md: { wrap: "gap-4 py-12 px-5", frame: "size-14", title: "text-heading-lg" },
  lg: { wrap: "gap-5 py-16 px-6", frame: "size-16", title: "text-heading-xl" },
} as const;

/**
 * SuccessState — terminal confirmation (order placed, store submitted,
 * password reset). Uses `role="status"` so it is announced without stealing
 * focus, and pairs the tick with explicit wording so colour is never the signal.
 */
function SuccessState({
  title,
  description,
  details,
  actions,
  size = "md",
  titleAs: Title = "h2",
  className,
  children,
  ...props
}: SuccessStateProps) {
  const styles = sizeStyles[size];

  return (
    <div
      data-slot="success-state"
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        styles.wrap,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "grid place-items-center rounded-pill border border-success/25 bg-success-surface text-success",
          styles.frame,
          "[&_svg]:size-6",
        )}
      >
        <Check strokeWidth={2.5} />
      </span>

      <div className="flex max-w-md flex-col gap-2">
        <Title className={cn("text-ink", styles.title)}>{title}</Title>
        {description ? (
          <p className="text-body-sm text-ink-soft">{description}</p>
        ) : null}
      </div>

      {details?.length ? (
        <dl className="mt-1 w-full max-w-sm divide-y divide-line rounded-md border border-line bg-surface text-left">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="flex items-baseline justify-between gap-4 px-4 py-3"
            >
              <dt className="text-caption text-ink-soft">{detail.label}</dt>
              <dd className="text-body-sm font-medium text-ink">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      {children}

      {actions ? (
        <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

export { SuccessState };
