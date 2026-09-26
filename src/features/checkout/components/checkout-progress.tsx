"use client";

import { Check } from "lucide-react";
import type { CheckoutStep } from "../checkout-types";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "contact",  label: "Contact"  },
  { id: "address",  label: "Address"  },
  { id: "delivery", label: "Delivery" },
  { id: "review",   label: "Review"   },
  { id: "payment",  label: "Payment"  },
];

interface Props {
  currentStep: CheckoutStep;
  completedSteps: CheckoutStep[];
  onStepClick: (step: CheckoutStep) => void;
}

export function CheckoutProgress({ currentStep, completedSteps, onStepClick }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Checkout progress">
      {/* Desktop stepper */}
      <ol className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-line z-0" />
        {STEPS.map((step, idx) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || idx < currentIndex;

          return (
            <li key={step.id} className="flex flex-col items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable && !isCurrent}
                aria-current={isCurrent ? "step" : undefined}
                className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-200 ${
                  isCompleted
                    ? "bg-[#53695F] border-[#53695F] text-[#FCFBF7] cursor-pointer shadow-xs font-extrabold"
                    : isCurrent
                    ? "border-2 border-[#71877B] bg-[#EEF3EF] dark:bg-[#34403A] text-[#53695F] dark:text-[#E9E2D5] font-extrabold shadow-xs"
                    : "bg-surface border-line text-ink-subtle cursor-default"
                }`}
              >
                {isCompleted ? <Check className="size-3.5 stroke-[3]" /> : <span>{idx + 1}</span>}
              </button>
              <span className={`text-[11px] font-medium tracking-tight ${isCurrent ? "text-ink font-bold" : isCompleted ? "text-ink-soft" : "text-ink-subtle"}`}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Mobile bar */}
      <div className="sm:hidden">
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-sage-cta transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Step {currentIndex + 1} of {STEPS.length} — <span className="text-primary font-bold">{STEPS[currentIndex].label}</span>
        </p>
      </div>
    </nav>
  );
}
