"use client";

import * as React from "react";
import {
  CreditCard,
  Building2,
  Wallet,
  Banknote,
  ChevronRight,
} from "lucide-react";
import { m, AnimatePresence } from "framer-motion";

import type { MockOutcome, PaymentMethod } from "../payment-types";

export interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  mockOutcome: MockOutcome;
  onSelectOutcome?: (outcome: MockOutcome) => void;
  showMockSelector?: boolean;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelectMethod,
  mockOutcome,
  onSelectOutcome,
  showMockSelector = true,
}: PaymentMethodSelectorProps) {
  const [upiVpa, setUpiVpa] = React.useState("");

  return (
    <div className="space-y-4">
      {/* Test / Mock Outcome Bar for verification */}
      {showMockSelector && onSelectOutcome && (
        <div className="rounded-xl border border-dashed border-primary/40 bg-surface/80 p-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark dark:text-gold">
                Gateway Simulation Mode
              </span>
              <p className="text-[11px] text-ink-soft">
                Select test scenario to verify response
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {(["SUCCESS", "FAILED", "PENDING", "CANCELLED"] as MockOutcome[]).map((outcome) => (
                <button
                  key={outcome}
                  type="button"
                  onClick={() => onSelectOutcome(outcome)}
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md transition-all cursor-pointer ${
                    mockOutcome === outcome
                      ? outcome === "SUCCESS"
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                        : outcome === "FAILED"
                        ? "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30"
                        : outcome === "PENDING"
                        ? "bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/30"
                        : "bg-ink text-ink-inverse"
                      : "bg-canvas-deep text-ink-soft hover:text-ink border border-transparent"
                  }`}
                >
                  {outcome}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Methods List */}
      <div className="space-y-3" role="radiogroup" aria-label="Payment methods">
        {/* 1. UPI */}
        <div
          onClick={() => onSelectMethod("upi")}
          className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedMethod === "upi"
              ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
              : "border-line bg-surface hover:border-primary/50"
          }`}
        >
          <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`size-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  selectedMethod === "upi"
                    ? "border-primary bg-surface"
                    : "border-line-strong"
                }`}
              >
                {selectedMethod === "upi" && (
                  <div className="size-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">UPI</h3>
                <p className="text-xs text-ink-soft">Pay instantly using any UPI app</p>
                {/* Brand badges */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-medium text-ink">
                    <span className="text-[#4285F4] font-bold">G</span>Pay
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-medium text-[#7c3aed] dark:text-[#a78bfa]">
                    PhonePe
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-medium text-[#00b9f5]">
                    Paytm
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-bold text-[#f7941d]">
                    BHIM
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <span className="font-extrabold italic text-sm tracking-wider text-ink">UPI ❯</span>
              <ChevronRight className="size-4 text-ink-subtle" />
            </div>
          </div>

          <AnimatePresence>
            {selectedMethod === "upi" && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-line/60 px-4 py-3 bg-canvas-deep/60 space-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                <label className="text-[11px] font-semibold text-ink-soft">Enter UPI ID / VPA</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi or username@okhdfcbank"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="flex-1 rounded-xl bg-surface border border-line px-3 py-1.5 text-xs text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Credit / Debit Card */}
        <div
          onClick={() => onSelectMethod("card")}
          className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedMethod === "card"
              ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
              : "border-line bg-surface hover:border-primary/50"
          }`}
        >
          <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`size-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  selectedMethod === "card"
                    ? "border-primary bg-surface"
                    : "border-line-strong"
                }`}
              >
                {selectedMethod === "card" && (
                  <div className="size-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Credit / Debit Card</h3>
                <p className="text-xs text-ink-soft">Pay securely using your card</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-[#1a1f71] dark:text-[#7ba0ff] text-xs">VISA</span>
                  <span className="font-bold text-[#eb001b] dark:text-[#ff6b6b] text-xs">mastercard</span>
                  <span className="font-bold text-[#0c4078] dark:text-[#60a5fa] text-xs">RuPay❯</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <CreditCard className="size-5 text-ink-subtle" />
              <ChevronRight className="size-4 text-ink-subtle" />
            </div>
          </div>
        </div>

        {/* 3. Net Banking */}
        <div
          onClick={() => onSelectMethod("netbanking")}
          className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedMethod === "netbanking"
              ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
              : "border-line bg-surface hover:border-primary/50"
          }`}
        >
          <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`size-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  selectedMethod === "netbanking"
                    ? "border-primary bg-surface"
                    : "border-line-strong"
                }`}
              >
                {selectedMethod === "netbanking" && (
                  <div className="size-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Net Banking</h3>
                <p className="text-xs text-ink-soft">Pay using your bank account</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-bold text-[#004c8f] dark:text-[#60a5fa]">
                    SBI
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-bold text-[#004b87] dark:text-[#93c5fd]">
                    HDFC
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-bold text-[#f58220] dark:text-[#fb923c]">
                    ICICI
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-canvas-deep border border-line text-[10px] font-bold text-[#97144d] dark:text-[#f472b6]">
                    AXIS
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <Building2 className="size-5 text-ink-subtle" />
              <ChevronRight className="size-4 text-ink-subtle" />
            </div>
          </div>
        </div>

        {/* 4. Wallets */}
        <div
          onClick={() => onSelectMethod("wallet")}
          className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedMethod === "wallet"
              ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
              : "border-line bg-surface hover:border-primary/50"
          }`}
        >
          <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`size-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  selectedMethod === "wallet"
                    ? "border-primary bg-surface"
                    : "border-line-strong"
                }`}
              >
                {selectedMethod === "wallet" && (
                  <div className="size-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Wallets</h3>
                <p className="text-xs text-ink-soft">Pay using popular wallets</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-[#00b9f5]">paytm</span>
                  <span className="text-[10px] font-bold text-[#ff9900]">amazon pay</span>
                  <span className="text-[10px] font-bold text-[#00a9e0]">MobiKwik</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <Wallet className="size-5 text-ink-subtle" />
              <ChevronRight className="size-4 text-ink-subtle" />
            </div>
          </div>
        </div>

        {/* 5. Cash on Delivery */}
        <div
          onClick={() => onSelectMethod("cod")}
          className={`rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
            selectedMethod === "cod"
              ? "border-primary bg-gold-soft/20 dark:bg-gold/10 shadow-xs ring-1 ring-primary"
              : "border-line bg-surface hover:border-primary/50"
          }`}
        >
          <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className={`size-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                  selectedMethod === "cod"
                    ? "border-primary bg-surface"
                    : "border-line-strong"
                }`}
              >
                {selectedMethod === "cod" && (
                  <div className="size-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Cash on Delivery</h3>
                <p className="text-xs text-ink-soft">Pay in cash when your order is delivered</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-ink-soft">
              <Banknote className="size-5 text-ink-subtle" />
              <ChevronRight className="size-4 text-ink-subtle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
