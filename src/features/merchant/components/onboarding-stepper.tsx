"use client";

import { Check } from "lucide-react";
import * as React from "react";

import type { OnboardingStepId } from "@/features/merchant/merchant-types";
import { cn } from "@/lib/utils";

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  shortLabel?: string;
  description?: string;
}

export const ONBOARDING_STEPS: readonly OnboardingStep[] = [
  { id: "business", label: "Business Details", shortLabel: "Business", description: "Legal entity & contact" },
  { id: "store", label: "Store Identity", shortLabel: "Store", description: "Name, URL slug & story" },
  { id: "category", label: "Category", shortLabel: "Category", description: "Artisan craft specialty" },
  { id: "branding", label: "Branding", shortLabel: "Branding", description: "Logo, banner & accents" },
  { id: "review", label: "Review", shortLabel: "Review", description: "Verify & launch store" },
] as const;

export function OnboardingStepper({
  currentStepId,
  completedSteps = [],
  onStepClick,
  className,
}: {
  currentStepId: OnboardingStepId;
  completedSteps?: OnboardingStepId[];
  onStepClick?: (stepId: OnboardingStepId) => void;
  className?: string;
}) {
  const currentIndex = Math.max(
    0,
    ONBOARDING_STEPS.findIndex((s) => s.id === currentStepId),
  );

  return (
    <nav aria-label="Merchant onboarding progress" className={cn("w-full max-w-4xl mx-auto py-3", className)}>
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {ONBOARDING_STEPS.map((step, index) => {
          const isComplete = completedSteps.includes(step.id) || index < currentIndex;
          const isCurrent = step.id === currentStepId;
          const isClickable = isComplete && Boolean(onStepClick);

          return (
            <React.Fragment key={step.id}>
              <li
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-col items-center gap-1.5 shrink-0"
              >
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  className={cn(
                    "group flex flex-col items-center gap-1.5 transition-all outline-none",
                    isClickable ? "cursor-pointer" : "cursor-default",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 sm:size-9 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-fast",
                      isComplete && "bg-[#C49A45] text-[#151515] font-extrabold shadow-xs group-hover:scale-105",
                      isCurrent && "border-2 border-[#C49A45] bg-[#C49A45]/15 text-[#9A6A20] dark:text-[#C49A45] shadow-xs font-extrabold ring-4 ring-[#C49A45]/10",
                      !isComplete && !isCurrent && "border border-line bg-surface text-ink-subtle",
                    )}
                  >
                    {isComplete ? <Check className="size-4" strokeWidth={3} /> : index + 1}
                  </span>

                  <span
                    className={cn(
                      "text-[11px] sm:text-xs font-medium tracking-tight whitespace-nowrap",
                      isCurrent ? "text-ink font-bold" : "text-ink-soft",
                      !isComplete && !isCurrent && "text-ink-subtle",
                      isClickable && "group-hover:text-gold transition-colors",
                    )}
                  >
                    <span className="hidden md:inline">{step.label}</span>
                    <span className="md:hidden">{step.shortLabel || step.label}</span>
                  </span>
                </button>

                <span className="sr-only">
                  {isComplete
                    ? " — completed"
                    : isCurrent
                      ? " — current step"
                      : " — not started"}
                </span>
              </li>

              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className={cn(
                    "h-0.5 flex-1 min-w-3 sm:min-w-8 mx-1 -mt-6 transition-colors duration-fast",
                    index < currentIndex ? "bg-[#C49A45]" : "bg-line",
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
