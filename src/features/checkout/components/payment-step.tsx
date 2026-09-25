"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Lock, ArrowRight } from "lucide-react";

import { useCart } from "@/context/cart-context";
import { PaymentMethodSelector } from "@/features/payment/components/payment-method-selector";
import type { MockOutcome, PaymentMethod } from "@/features/payment/payment-types";
import { checkoutStorage } from "@/lib/storage/checkout-storage";
import { toast } from "@/lib/toast";
import { orderService } from "@/services/order.service";
import { createIdempotencyKey, paymentService } from "@/services/payment.service";

import { useCheckout } from "../checkout-context";

export function PaymentStep() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const {
    contact,
    shippingAddress,
    deliveryMethod,
    appliedCoupon,
    orderTotals,
    goToPreviousStep,
    isSubmitting,
  } = useCheckout();

  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("upi");
  const [mockOutcome, setMockOutcome] = React.useState<MockOutcome>("SUCCESS");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  async function handlePay() {
    if (isProcessing || isSubmitting) return;
    if (items.length === 0) {
      toast.error("Cart is Empty", "Please add items to your cart before proceeding.");
      return;
    }
    if (!shippingAddress) {
      toast.error("Address Missing", "Please select a delivery address.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    const idempotencyKey = createIdempotencyKey();

    try {
      if (selectedMethod === "cod") {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const order = await orderService.createOrder({
          items,
          contact,
          shippingAddress,
          deliveryMethod,
          payment: {
            id: `pay_cod_${Date.now()}`,
            method: "cod",
            status: "pending",
            amount: orderTotals.total,
            currency: "INR",
            provider: "cash_on_delivery",
            idempotencyKey,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          subtotal: orderTotals.subtotal,
          discount: orderTotals.couponDiscount + orderTotals.productSavings,
          deliveryFee: orderTotals.deliveryFee,
          tax: orderTotals.tax,
          total: orderTotals.total,
          status: "confirmed",
          idempotencyKey,
        });

        clearCart();
        checkoutStorage.clearDraft();
        toast.success("Order Placed", "Your Cash on Delivery order is confirmed.");
        router.push(`/order-success?orderId=${order.id}`);
        return;
      }

      // Online payment
      paymentService.setMockOutcome(mockOutcome);

      const session = await paymentService.createPaymentSession({
        amount: orderTotals.total,
        currency: "INR",
        method: selectedMethod,
        idempotencyKey,
        contact,
        shippingAddress,
        items,
      });

      const verification = await paymentService.verifyPayment({
        sessionId: session.sessionId,
        paymentId: `pay_mock_${Date.now()}`,
        method: selectedMethod,
        mockOutcome,
      });

      if (verification.success && verification.status === "captured") {
        const order = await orderService.createOrder({
          items,
          contact,
          shippingAddress,
          deliveryMethod,
          payment: {
            id: verification.paymentId,
            orderReference: session.orderReference,
            method: selectedMethod,
            status: "captured",
            amount: orderTotals.total,
            currency: "INR",
            provider: session.provider,
            providerPaymentId: verification.paymentId,
            idempotencyKey,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          subtotal: orderTotals.subtotal,
          discount: orderTotals.couponDiscount + orderTotals.productSavings,
          deliveryFee: orderTotals.deliveryFee,
          tax: orderTotals.tax,
          total: orderTotals.total,
          status: "confirmed",
          idempotencyKey,
        });

        clearCart();
        checkoutStorage.clearDraft();
        toast.success("Payment Confirmed", "Your payment was captured and order is confirmed.");
        router.push(`/order-success?orderId=${order.id}`);
      } else if (verification.status === "pending") {
        router.push(`/payment?status=pending`);
      } else {
        setErrorMessage(
          verification.message || "Payment could not be completed. Your cart has been preserved."
        );
        toast.error("Payment Failed", verification.message || "Transaction declined.");
      }
    } catch {
      setErrorMessage("Network error connecting to payment gateway. Please retry.");
      toast.error("Payment Error", "Unable to complete transaction.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-ink">Payment Method</h2>
          <p className="text-xs sm:text-sm text-ink-soft">Choose how you’d like to pay for your order.</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="size-3.5" />
          <span>256-bit SSL</span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        mockOutcome={mockOutcome}
        onSelectOutcome={setMockOutcome}
      />

      {/* Secure Info Box */}
      <div className="rounded-xl border border-line bg-gold-surface dark:bg-surface-elevated p-4 flex items-start gap-3">
        <ShieldCheck className="size-5 text-gold-dark dark:text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-ink">Your payment information is secure and encrypted.</p>
          <p className="text-[11px] text-ink-soft mt-0.5">We never store your card or UPI credentials.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
          {errorMessage}
        </div>
      )}

      {/* Navigation and Pay button */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={goToPreviousStep}
          disabled={isProcessing}
          className="px-6 py-3.5 rounded-xl border border-line bg-surface text-ink hover:bg-canvas-deep text-xs sm:text-sm font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={isProcessing || items.length === 0}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-btn-gold text-[#151515] font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] border border-gold-light/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2 text-[#151515]">
              <Loader2 className="size-4 animate-spin text-[#151515]" />
              <span>Processing Payment…</span>
            </div>
          ) : selectedMethod === "cod" ? (
            <>
              <Lock className="size-4 text-[#151515]" />
              <span>Place COD Order ({fmt(orderTotals.total)})</span>
              <ArrowRight className="size-4 text-[#151515] transition-transform group-hover:translate-x-1" />
            </>
          ) : (
            <>
              <Lock className="size-4 text-[#151515]" />
              <span>Pay {fmt(orderTotals.total)} Securely</span>
              <ArrowRight className="size-4 text-[#151515] transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-center text-ink-subtle">
        By placing this order, you agree to our{" "}
        <a href="/help" className="text-ink-soft hover:text-ink underline transition-colors">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/help" className="text-ink-soft hover:text-ink underline transition-colors">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
