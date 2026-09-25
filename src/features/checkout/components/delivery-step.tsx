"use client";

import { Truck, Zap, Gift, ChevronRight } from "lucide-react";
import { useCheckout } from "../checkout-context";
import { deliveryMethods } from "@/data/delivery-methods";
import type { DeliveryMethod } from "@/data/delivery-methods";

const ICONS: Record<string, React.ElementType> = {
  standard: Truck,
  express: Zap,
  gift: Gift,
};

export function DeliveryStep() {
  const { deliveryMethod, selectDeliveryMethod, goToNextStep, goToPreviousStep, orderTotals } = useCheckout();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink mb-1">Delivery Method</h2>
        <p className="text-sm text-ink-soft">Choose how you want your order delivered.</p>
      </div>

      <div className="space-y-3">
        {deliveryMethods.map((method: DeliveryMethod) => {
          const Icon = ICONS[method.id] ?? Truck;
          const isSelected = deliveryMethod.id === method.id;
          const isFreeEligible = method.freeAbove && orderTotals.subtotal >= method.freeAbove;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => selectDeliveryMethod(method)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
                  : "border-line bg-surface hover:border-primary/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 size-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? "bg-gold-soft/40 dark:bg-gold/20 text-gold-dark dark:text-gold" : "bg-canvas-deep text-ink-soft"}`}>
                  <Icon className={`size-5 ${isSelected ? "text-gold-dark dark:text-gold" : "text-ink-soft"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink">{method.name}</span>
                      {method.isPopular && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold font-bold">Popular</span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {isFreeEligible ? (
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">FREE</span>
                      ) : (
                        <span className="text-sm font-bold text-ink">₹{method.price}</span>
                      )}
                      {method.freeAbove && !isFreeEligible && (
                        <p className="text-xs text-ink-subtle">Free above ₹{method.freeAbove}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-ink-soft mt-1">{method.description}</p>
                  <p className="text-xs text-gold-dark dark:text-gold mt-1 font-semibold">{method.estimatedDays}</p>
                </div>
                <div className={`mt-1 size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "border-primary bg-primary" : "border-line-strong"}`}>
                  {isSelected && <div className="size-2 rounded-full bg-[#151515]" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={goToPreviousStep} className="px-6 py-3 rounded-xl border border-line bg-surface text-ink hover:bg-canvas-deep text-sm font-medium transition-all duration-200 cursor-pointer">
          Back
        </button>
        <button
          type="button"
          onClick={() => goToNextStep()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] cursor-pointer"
        >
          Review Order <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
