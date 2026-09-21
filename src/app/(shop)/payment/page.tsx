import { LockKeyhole, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CartSummaryShell } from "@/features/cart/cart-summary-shell";
import { CheckoutStepper, type CheckoutStep } from "@/features/checkout/checkout-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Payment",
  description: "Complete payment for your Bhagya Commerce order.",
  path: "/payment",
  noIndex: true,
});

const steps: readonly CheckoutStep[] = [
  { id: "details", label: "Your details" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
] as const;

/**
 * Payment.
 *
 * Deliberately contains **no payment form**. Collecting card or UPI details
 * against a non-existent backend is the one thing this page must never do, so it
 * documents the intended integration and hands the user back. The route exists
 * now so the checkout flow, stepper and return URLs are stable.
 */
export default function PaymentPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        title="Payment"
        description="This step is where the payment provider will take over."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" },
        ]}
      />

      <div className="mt-6">
        <CheckoutStepper steps={steps} currentStepId="payment" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <Card variant="surface" padding="lg" radius="lg">
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-md bg-soft-green text-primary"
              >
                <ShieldCheck className="size-4" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-heading-lg text-ink">No payment form here yet</h2>
                <p className="max-w-xl text-body-sm text-ink-soft">
                  Bhagya will collect payments through a PCI-compliant provider
                  using their hosted flow — card and UPI details will never touch
                  our own servers. Until that integration exists, this page
                  deliberately shows no fields to fill.
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-2.5 border-t border-line pt-4">
              {[
                "Provider-hosted payment sheet with UPI, cards and net banking",
                "Idempotent order creation before redirect, so retries cannot double-charge",
                "Webhook reconciliation with signature verification",
                "Refunds and settlement reconciliation in the merchant workspace",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body-sm text-ink-soft">
                  <LockKeyhole
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 border-t border-line pt-4">
              <Button asChild variant="outline" size="md">
                <Link href="/checkout">Back to checkout</Link>
              </Button>
              <Button asChild variant="ghost" size="md">
                <Link href="/help#shipping">Payment questions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <CartSummaryShell className="lg:sticky lg:top-24" />
      </div>
    </Container>
  );
}
