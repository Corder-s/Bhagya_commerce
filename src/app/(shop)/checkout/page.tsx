import { CreditCard, LockKeyhole, MapPin, ReceiptText } from "lucide-react";
import type { Metadata } from "next";

import { CartSummaryShell } from "@/features/cart/cart-summary-shell";
import { CheckoutStepper, type CheckoutStep } from "@/features/checkout/checkout-stepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Checkout",
  description: "Complete your Bhagya Commerce order.",
  path: "/checkout",
  noIndex: true,
});

const steps: readonly CheckoutStep[] = [
  { id: "details", label: "Your details", description: "Contact and delivery" },
  { id: "delivery", label: "Delivery", description: "Address and slot" },
  { id: "payment", label: "Payment", description: "UPI, card or net banking" },
  { id: "review", label: "Review", description: "Confirm and place" },
] as const;

const panels = [
  {
    id: "contact",
    Icon: MapPin,
    title: "Delivery address",
    body: "Saved addresses appear here, with a pincode check against maker serviceability.",
  },
  {
    id: "payment",
    Icon: CreditCard,
    title: "Payment method",
    body: "UPI, cards and net banking via the payments provider. Nothing is collected in Phase 1.",
  },
  {
    id: "review",
    Icon: ReceiptText,
    title: "Review and place order",
    body: "Final amounts, GST details and delivery estimates before you confirm.",
  },
] as const;

/**
 * Checkout.
 *
 * The stepper and the three panels define the *shape* of checkout while every
 * action stays disabled: no fake order is placed, no payment form is shown. This
 * is the boundary the brief asks for — foundation, not functionality.
 */
export default function CheckoutPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        title="Checkout"
        description="Address, delivery and payment. Four short steps, and you can go back at any point."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]}
        meta={
          <span className="inline-flex items-center gap-2 text-caption text-ink-soft">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Payments and address validation are implemented in Phase 3.
          </span>
        }
      />

      <div className="mt-6">
        <CheckoutStepper steps={steps} currentStepId="details" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <ol className="flex flex-col gap-4">
          {panels.map((panel, index) => (
            <li key={panel.id}>
              <Card variant="surface" padding="md" radius="lg">
                <CardContent className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-md bg-soft-green text-primary"
                  >
                    <panel.Icon className="size-4" />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-heading-md text-ink">{panel.title}</h2>
                      <span className="label-text text-ink-faint">Step {index + 1}</span>
                    </div>
                    <p className="text-body-sm text-ink-soft">{panel.body}</p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <CartSummaryShell />
          <Button variant="primary" size="lg" fullWidth disabled>
            Continue to payment
          </Button>
          <p className="text-caption text-ink-soft">
            The continue action unlocks once cart and payments exist in Phase 3.
          </p>
        </div>
      </div>
    </Container>
  );
}
