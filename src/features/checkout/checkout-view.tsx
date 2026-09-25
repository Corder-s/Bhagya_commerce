"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { CheckoutProvider, useCheckout } from "./checkout-context";
import { CheckoutProgress } from "./components/checkout-progress";
import { ContactStep } from "./components/contact-step";
import { AddressStep } from "./components/address-step";
import { DeliveryStep } from "./components/delivery-step";
import { ReviewStep } from "./components/review-step";
import { PaymentStep } from "./components/payment-step";
import { CheckoutOrderSummary } from "./components/checkout-order-summary";

function CheckoutContent() {
  const { currentStep, completedSteps, setStep } = useCheckout();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-ink-soft mb-4">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>❯</span>
            <Link href="/cart" className="hover:text-ink transition-colors">Cart</Link>
            <span>❯</span>
            <span className="text-ink font-semibold">Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">Checkout</h1>
          <p className="text-xs sm:text-sm text-ink-soft">Secure checkout — your data is always protected with bank-level encryption.</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <CheckoutProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={setStep}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
          {/* Left: Step panel */}
          <div className="bg-surface border border-line rounded-2xl p-6 sm:p-8 shadow-xs">
            {currentStep === "contact"  && <ContactStep />}
            {currentStep === "address"  && <AddressStep />}
            {currentStep === "delivery" && <DeliveryStep />}
            {currentStep === "review"   && <ReviewStep />}
            {currentStep === "payment"  && <PaymentStep />}
          </div>

          {/* Right: Sticky order summary */}
          <div className="lg:sticky lg:top-24">
            <CheckoutOrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCartGuard() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-sm bg-surface border border-line p-8 rounded-2xl shadow-xs">
        <div className="size-16 rounded-full bg-gold-soft/30 dark:bg-gold/15 border border-line flex items-center justify-center mx-auto text-gold-dark dark:text-gold">
          <ShoppingBag className="size-8" />
        </div>
        <h1 className="text-xl font-bold text-ink">Your cart is empty</h1>
        <p className="text-ink-soft text-xs leading-relaxed">
          Add some handcrafted or organic products before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 mt-2 w-full py-3 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:brightness-105"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}

export function CheckoutView() {
  const { items } = useCart();

  if (items.length === 0) {
    return <EmptyCartGuard />;
  }

  return (
    <CheckoutProvider>
      <CheckoutContent />
    </CheckoutProvider>
  );
}
