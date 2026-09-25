import { Suspense } from "react";
import type { Metadata } from "next";

import { CheckoutStepper, type CheckoutStep } from "@/features/checkout/checkout-stepper";
import { PaymentView } from "@/features/payment/components/payment-view";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Payment",
  description: "Complete secure payment for your Bhagya Commerce order.",
  path: "/payment",
  noIndex: true,
});

const steps: readonly CheckoutStep[] = [
  { id: "details", label: "Your details" },
  { id: "delivery", label: "Delivery" },
  { id: "review", label: "Review" },
  { id: "payment", label: "Payment" },
] as const;

export default function PaymentPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        title="Secure Checkout & Payment"
        description="Choose your preferred payment method. Encrypted with 256-bit bank-grade security."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Payment" },
        ]}
      />

      <div className="mt-6 mb-8">
        <CheckoutStepper steps={steps} currentStepId="payment" />
      </div>

      <Suspense
        fallback={
          <div className="py-20 text-center">
            <div className="size-12 rounded-full border-2 border-[#C49A45] border-t-transparent animate-spin mx-auto" />
            <p className="text-[#5E5A52] text-sm mt-4">Loading secure payment options…</p>
          </div>
        }
      >
        <PaymentView />
      </Suspense>
    </Container>
  );
}
