"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  RotateCcw,
  MapPin,
  Truck,
  MessageSquare,
  ArrowRight,
  Loader2,
  Percent,
  Lock,
  Headphones,
  Sprout,
  Users,
} from "lucide-react";

import { useCart } from "@/context/cart-context";
import { defaultDeliveryMethod, deliveryMethods } from "@/data/delivery-methods";
import { calculateOrderTotals } from "@/features/checkout/checkout-utils";
import { checkoutStorage } from "@/lib/storage/checkout-storage";
import { toast } from "@/lib/toast";
import { orderService } from "@/services/order.service";
import { createIdempotencyKey, paymentService } from "@/services/payment.service";

import type { MockOutcome, PaymentMethod, PaymentStatus } from "../payment-types";
import { PaymentMethodSelector } from "./payment-method-selector";

export function PaymentView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryStatus = searchParams.get("status") as PaymentStatus | null;

  const { items, clearCart } = useCart();
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("upi");
  const [mockOutcome, setMockOutcome] = React.useState<MockOutcome>("SUCCESS");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [couponCode, setCouponCode] = React.useState("");
  const [errorState, setErrorState] = React.useState<string | null>(
    queryStatus === "failed" ? "Payment was declined by the bank or cancelled." : null
  );

  const draft = React.useMemo(() => checkoutStorage.getDraft(), []);
  const savedAddresses = React.useMemo(() => checkoutStorage.getSavedAddresses(), []);

  const contact = draft?.contact || {
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
  };

  const shippingAddress =
    draft?.shippingAddress ||
    savedAddresses[0] || {
      fullName: "Aarav Sharma",
      phone: "+91 98765 43210",
      addressLine1: "Flat 4/12, Lotus Greens, Sector 45",
      city: "Gurugram",
      state: "Haryana",
      postalCode: "122003",
      country: "India",
      addressType: "home",
    };

  const deliveryMethod =
    deliveryMethods.find((m) => m.id === draft?.deliveryMethodId) || defaultDeliveryMethod;

  const orderTotals = React.useMemo(() => {
    return calculateOrderTotals(items, deliveryMethod, null);
  }, [items, deliveryMethod]);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  async function handleExecutePayment() {
    if (isProcessing) return;
    if (items.length === 0) {
      toast.error("Cart is Empty", "Please add items to your cart before proceeding.");
      router.push("/cart");
      return;
    }

    setErrorState(null);
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
        toast.success("Order Placed", "Your Cash on Delivery order is confirmed!");
        router.push(`/order-success?orderId=${order.id}`);
        return;
      }

      // Online Payment Flow
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
        setErrorState(
          verification.message || "Payment could not be completed. Your cart has been preserved."
        );
        toast.error("Payment Failed", verification.message || "Transaction declined.");
      }
    } catch {
      setErrorState("A network error occurred while contacting the gateway. Please retry.");
      toast.error("Payment Error", "Unable to complete transaction.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Security Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span>❯</span>
          <Link href="/checkout" className="hover:text-ink transition-colors">Checkout</Link>
          <span>❯</span>
          <span className="text-ink font-semibold">Payment</span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold grid place-items-center">
            <Lock className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">100% Secure Payment</p>
            <p className="text-[11px] text-ink-subtle">Your data is protected with bank-level security</p>
          </div>
        </div>
      </div>

      {/* Hero Promo Banner */}
      <div className="relative rounded-2xl border border-line bg-gradient-hero-warm p-6 sm:p-7 overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Bhagya Signature Bag Visual */}
            <div className="relative size-20 sm:size-24 rounded-2xl bg-charcoal dark:bg-black p-3 text-center flex flex-col items-center justify-center border border-line-strong shadow-lg shrink-0">
              <span className="font-serif font-bold text-sm text-gold">Bhagya</span>
              <span className="text-[7px] text-ink-inverse-muted tracking-tighter mt-0.5">Shop · Sell · Grow</span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-ink">Complete Your Order</h1>
              <p className="text-xs sm:text-sm text-ink-soft mt-1 max-w-md">
                Choose your preferred payment method and place your order securely.
              </p>
            </div>
          </div>

          <div className="text-right hidden lg:block">
            <span className="font-serif italic text-lg sm:text-xl text-gold-dark dark:text-gold font-medium">
              Good Choices<br />Brighter Tomorrows
            </span>
          </div>
        </div>

        {/* 4 Trust pills row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-line/60 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-canvas-deep border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0">
              <Lock className="size-3.5" />
            </div>
            <div>
              <p className="font-bold text-ink text-[11px]">Secure Payments</p>
              <p className="text-[10px] text-ink-subtle">Bank-level encryption</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-canvas-deep border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0">
              <RotateCcw className="size-3.5" />
            </div>
            <div>
              <p className="font-bold text-ink text-[11px]">Easy Returns</p>
              <p className="text-[10px] text-ink-subtle">7-day hassle free</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-canvas-deep border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0">
              <ShieldCheck className="size-3.5" />
            </div>
            <div>
              <p className="font-bold text-ink text-[11px]">Authentic Products</p>
              <p className="text-[10px] text-ink-subtle">Sourced from trusted makers</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-canvas-deep border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0">
              <Users className="size-3.5" />
            </div>
            <div>
              <p className="font-bold text-ink text-[11px]">Support Local</p>
              <p className="text-[10px] text-ink-subtle">Empowering rural India</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        {/* Left Column: Payment Methods & CTA */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-ink">Payment Method</h2>
            <p className="text-xs text-ink-soft mt-0.5">Choose how you’d like to pay for your order.</p>
          </div>

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

          {errorState && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400 font-medium">
              {errorState}
            </div>
          )}

          {/* Main Checkout Button */}
          <button
            type="button"
            onClick={handleExecutePayment}
            disabled={isProcessing || items.length === 0}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-gradient-btn-gold text-[#151515] font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-primary/20 hover:brightness-105 active:scale-[0.99] border border-gold-light/40 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2 text-[#151515]">
                <Loader2 className="size-4 animate-spin text-[#151515]" />
                <span>Processing Payment…</span>
              </div>
            ) : selectedMethod === "cod" ? (
              <>
                <Lock className="size-4 text-[#151515]" />
                <span>Place Order ({fmt(orderTotals.total)} on Delivery)</span>
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

          <p className="text-[11px] text-center text-ink-subtle">
            By continuing, you agree to our{" "}
            <Link href="/help" className="underline hover:text-ink transition-colors">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/help" className="underline hover:text-ink transition-colors">Privacy Policy</Link>.
          </p>
        </div>

        {/* Right Column: Order Summary, Coupon, Address, Support */}
        <div className="space-y-4">
          {/* 1. Order Summary Card */}
          <div className="rounded-2xl border border-line bg-surface p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ink">
                Order Summary <span className="text-xs font-normal text-ink-subtle">({items.reduce((s, i) => s + i.quantity, 0)} Items)</span>
              </h3>
              <Link href="/cart" className="text-xs font-medium text-gold-dark dark:text-gold hover:underline">
                Edit
              </Link>
            </div>

            {/* Item list */}
            <div className="divide-y divide-line/50 max-h-56 overflow-y-auto pr-1 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative size-11 rounded-xl bg-canvas-deep overflow-hidden shrink-0 border border-line">
                      <Image
                        src={item.imageSrc}
                        alt={item.imageAlt || item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-[10px] text-ink-subtle">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink shrink-0">
                    {fmt(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-line pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span className="text-ink font-medium">{fmt(orderTotals.subtotal)}</span>
              </div>
              {orderTotals.productSavings > 0 && (
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>Savings & Discounts</span>
                  <span>- {fmt(orderTotals.productSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Delivery Fee</span>
                <span className="text-ink font-medium">
                  {orderTotals.deliveryFee === 0 ? "FREE" : fmt(orderTotals.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>Tax (GST 5% Included)</span>
                <span className="text-ink font-medium">
                  {orderTotals.tax > 0 ? fmt(orderTotals.tax) : "Included"}
                </span>
              </div>

              {/* Total Row with Gold Emphasis */}
              <div className="border-t border-line pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-ink">Total Amount</span>
                <span className="text-2xl font-bold text-gold-dark dark:text-gold">{fmt(orderTotals.total)}</span>
              </div>
            </div>
          </div>

          {/* 2. Coupon Card */}
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <div className="size-5 rounded-full bg-gold-soft/30 dark:bg-gold/15 text-gold-dark dark:text-gold grid place-items-center">
                <Percent className="size-3" />
              </div>
              <span>Have a coupon code?</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 rounded-xl bg-surface border border-line px-3 py-2 text-xs text-ink placeholder:text-ink-subtle focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  if (couponCode) toast.info("Coupon", "Coupon applied to order.");
                }}
                className="px-4 py-2 rounded-xl bg-ink text-ink-inverse text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* 3. Delivering To Card */}
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <MapPin className="size-4 text-gold-dark dark:text-gold" />
                <span>Delivering to</span>
              </div>
              <Link href="/checkout" className="text-[11px] font-medium text-gold-dark dark:text-gold hover:underline">
                Edit
              </Link>
            </div>
            <p className="text-xs font-bold text-ink">{shippingAddress.fullName}</p>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              {shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} – {shippingAddress.postalCode}
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-ink-soft border-t border-line/60">
              <Truck className="size-3.5 text-gold-dark dark:text-gold" />
              <span>Estimated delivery: <strong>26 – 28 Sept 2026</strong> (2 – 3 business days)</span>
            </div>
          </div>

          {/* 4. Support Card */}
          <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-ink">
                <Headphones className="size-4 text-gold-dark dark:text-gold" />
                <div>
                  <p>Need help with payment?</p>
                  <p className="text-[10px] font-normal text-ink-subtle">We’re here for you.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Support", "Connecting to Bhagya live support…")}
                className="px-3 py-1.5 rounded-xl border border-primary text-gold-dark dark:text-gold hover:bg-gold-soft/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="size-3" /> Live Chat
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-line/60 text-[10px] text-ink-soft">
              <Link href="/help" className="hover:text-ink transition-colors">Payment Help</Link>
              <span>•</span>
              <Link href="/account" className="hover:text-ink transition-colors">Track Order</Link>
              <span>•</span>
              <Link href="/help" className="hover:text-ink transition-colors">Returns & Refunds</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 5 Trust Badges Footer Strip */}
      <div className="pt-8 border-t border-line grid grid-cols-2 md:grid-cols-5 gap-4 text-left">
        <div className="flex items-start gap-2.5">
          <div className="size-8 rounded-full bg-surface border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0 mt-0.5">
            <Lock className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">100% Secure Payments</p>
            <p className="text-[10px] text-ink-subtle">Your data is protected</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="size-8 rounded-full bg-surface border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0 mt-0.5">
            <RotateCcw className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Easy Returns & Refunds</p>
            <p className="text-[10px] text-ink-subtle">7-day hassle free returns</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="size-8 rounded-full bg-surface border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0 mt-0.5">
            <ShieldCheck className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Genuine Products</p>
            <p className="text-[10px] text-ink-subtle">Sourced from trusted farmers</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="size-8 rounded-full bg-surface border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0 mt-0.5">
            <Users className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">Support Local Sellers</p>
            <p className="text-[10px] text-ink-subtle">Empowering rural communities</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 col-span-2 md:col-span-1">
          <div className="size-8 rounded-full bg-surface border border-line grid place-items-center text-gold-dark dark:text-gold shrink-0 mt-0.5">
            <Sprout className="size-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-ink">A Sustainable Tomorrow</p>
            <p className="text-[10px] text-ink-subtle">Better choices for a brighter future</p>
          </div>
        </div>
      </div>
    </div>
  );
}
