import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckoutStep = {
  id: string;
  label: string;
  description?: string;
};

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
    <nav aria-label="Checkout progress" className={cn("w-full max-w-4xl mx-auto py-2", className)}>
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step.id}>
              <li
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-7 sm:size-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-all",
                    isComplete && "bg-primary text-[#151515] font-extrabold shadow-xs",
                    isCurrent && "border-2 border-primary bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold shadow-xs font-extrabold",
                    !isComplete && !isCurrent && "border border-line bg-surface text-ink-subtle",
                  )}
                >
                  {isComplete ? <Check className="size-3.5 sm:size-4" strokeWidth={3} /> : index + 1}
                </span>

                <span
                  className={cn(
                    "text-[11px] sm:text-xs font-medium tracking-tight whitespace-nowrap",
                    isCurrent ? "text-ink font-bold" : "text-ink-soft",
                    !isComplete && !isCurrent && "text-ink-subtle",
                  )}
                >
                  {step.label}
                </span>
                <span className="sr-only">
                  {isComplete
                    ? " — completed"
                    : isCurrent
                      ? " — current step"
                      : " — not started"}
                </span>
              </li>

              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1 min-w-4 sm:min-w-8 mx-1 -mt-5 transition-colors",
                    index < currentIndex ? "bg-primary" : "bg-line",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
