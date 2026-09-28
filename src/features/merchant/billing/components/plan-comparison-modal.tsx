"use client";

import { Check, Loader2, Sparkles, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { MerchantPlan, MerchantSubscription } from "@/features/merchant/billing/billing-types";
import { toast } from "@/lib/toast";
import { billingService } from "@/services/billing.service";

export interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: MerchantSubscription;
  plans: MerchantPlan[];
  onPlanChanged: (updated: MerchantSubscription) => void;
}

export function PlanComparisonModal({
  isOpen,
  onClose,
  currentSubscription,
  plans,
  onPlanChanged,
}: PlanComparisonModalProps) {
  const [billingCycle, setBillingCycle] = React.useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [updatingPlanId, setUpdatingPlanId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSelectPlan(planId: string) {
    if (planId === currentSubscription.planId) return;
    setUpdatingPlanId(planId);
    try {
      const updated = await billingService.changePlan(planId);
      onPlanChanged(updated);
      toast.success("Subscription Updated", `Your organization is now enrolled in the ${updated.planName} plan.`);
      onClose();
    } catch {
      toast.error("Plan Change Failed", "Could not complete the subscription update.");
    } finally {
      setUpdatingPlanId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h3 className="text-heading-md font-bold text-ink">Merchant Platform Plans</h3>
            <p className="text-body-sm text-ink-soft">
              Scale your direct artisan craft studio with transparent pricing and fair commissions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Billing cycle toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center rounded-pill border border-line bg-surface-subtle p-1">
            <button
              type="button"
              onClick={() => setBillingCycle("MONTHLY")}
              className={`px-4 py-1.5 rounded-pill text-body-sm font-semibold transition-all ${
                billingCycle === "MONTHLY"
                  ? "bg-primary text-[#1F1510] shadow-xs"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("YEARLY")}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-body-sm font-semibold transition-all ${
                billingCycle === "YEARLY"
                  ? "bg-primary text-[#1F1510] shadow-xs"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <span>Annual (Save 17%)</span>
              <span className="rounded-pill bg-success text-white text-[10px] px-1.5 py-0.2">
                Save
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentSubscription.planId;
            const price =
              billingCycle === "MONTHLY" ? plan.monthlyPriceInr : Math.round(plan.yearlyPriceInr / 12);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary"
                    : "border-line bg-surface hover:border-primary/50"
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-primary px-3 py-0.5 text-[10px] font-bold text-[#1F1510] uppercase tracking-wider">
                    Current Plan
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-body-lg font-bold text-ink">{plan.name}</h4>
                    <p className="text-caption text-ink-soft mt-1 min-h-[36px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="border-t border-line pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-ink font-mono">
                        ₹{price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-caption text-ink-soft">/mo</span>
                    </div>
                    <p className="text-[11px] text-ink-faint mt-0.5">
                      {plan.commissionPercent}% transaction commission
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="border-t border-line pt-4 space-y-2">
                    <p className="text-caption font-bold text-ink uppercase tracking-wider">
                      Included:
                    </p>
                    <ul className="space-y-2 text-caption text-ink-soft">
                      {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-line">
                  <Button
                    variant={isCurrent ? "outline" : "primary"}
                    size="md"
                    fullWidth
                    disabled={isCurrent || updatingPlanId !== null}
                    onClick={() => handleSelectPlan(plan.id)}
                    className="font-bold"
                  >
                    {updatingPlanId === plan.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : isCurrent ? (
                      "Active Plan"
                    ) : (
                      "Switch to Plan"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
