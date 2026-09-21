import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckoutStep = {
  id: string;
  label: string;
  description?: string;
};

/**
 * CheckoutStepper — where the buyer is in the checkout flow.
 *
 * Rendered as an ordered list so the sequence is conveyed structurally, not by
 * horizontal position alone (which breaks down at 320px and in screen readers).
 * Completed steps get a tick *and* the word "completed" for assistive tech;
 * the current step is marked `aria-current="step"`.
 */
export function CheckoutStepper({
  steps,
  currentStepId,
  className,
}: {
  steps: readonly CheckoutStep[];
  currentStepId?: string;
  className?: string;
}) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === currentStepId),
  );

  return (
    <nav aria-label="Checkout progress" className={className}>
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? "step" : undefined}
              className="flex min-w-0 flex-1 items-center gap-3"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-pill border text-caption font-semibold tabular-nums",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-soft-green text-primary",
                  !isComplete && !isCurrent && "border-line bg-surface text-ink-faint",
                )}
              >
                {isComplete ? <Check className="size-4" strokeWidth={3} /> : index + 1}
              </span>

              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "truncate text-body-sm font-medium",
                    isCurrent ? "text-primary" : "text-ink",
                    !isComplete && !isCurrent && "text-ink-soft",
                  )}
                >
                  {step.label}
                </span>
                {step.description ? (
                  <span className="truncate text-caption text-ink-soft">
                    {step.description}
                  </span>
                ) : null}
                <span className="sr-only">
                  {isComplete
                    ? " — completed"
                    : isCurrent
                      ? " — current step"
                      : " — not started"}
                </span>
              </span>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "hidden h-px flex-1 sm:block",
                    isComplete ? "bg-primary" : "bg-line",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
