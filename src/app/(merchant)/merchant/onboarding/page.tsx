import { BadgeCheck, Building2, FileText, Landmark, Package, Truck } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { CheckoutStepper, type CheckoutStep } from "@/features/checkout/checkout-stepper";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Store onboarding",
  description: "Set up your store on Bhagya Commerce.",
  path: "/merchant/onboarding",
  noIndex: true,
});

const steps: readonly CheckoutStep[] = [
  { id: "identity", label: "Identity" },
  { id: "story", label: "Your story" },
  { id: "policies", label: "Policies" },
  { id: "payouts", label: "Payouts" },
  { id: "shipping", label: "Shipping" },
  { id: "product", label: "First product" },
] as const;

const panels = [
  {
    Icon: Building2,
    title: "Business identity",
    body: "Legal name, GSTIN (optional for small sellers) and contact details, with document upload and verification status.",
  },
  {
    Icon: FileText,
    title: "Store story",
    body: "Brand name, one-line description, craft context and your first two images — the copy Bhagya AI can draft with you.",
  },
  {
    Icon: Landmark,
    title: "Payouts and KYC",
    body: "Bank account, PAN and settlement preferences. Handled by the payments provider; never stored on Bhagya's own servers.",
  },
  {
    Icon: Truck,
    title: "Shipping defaults",
    body: "Pickup address, packaging choices and serviceable pin codes, with estimated delivery windows per region.",
  },
  {
    Icon: Package,
    title: "Your first product",
    body: "Draft listing with photos, materials, care instructions, price and inventory — publishable in one click.",
  },
] as const;

/**
 * Merchant onboarding.
 *
 * The six steps are the real product structure; each panel explains what it will
 * contain. Nothing is submitted — KYC, document storage and payouts all belong to
 * Phase 3, and a half-working onboarding that silently discarded data would be
 * the worst possible outcome for a seller.
 */
export default function MerchantOnboardingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 6"
        title="Set up your store"
        description="A guided setup you can leave and resume. Nothing is published until you choose to publish it."
        actions={
          <BadgeCheck aria-hidden="true" className="size-5 text-botanical" />
        }
      />

      <div className="mt-6">
        <CheckoutStepper steps={steps} currentStepId="identity" />
      </div>

      <ol className="mt-8 grid gap-4 lg:grid-cols-2">
        {panels.map((panel) => (
          <li key={panel.title}>
            <Card variant="surface" padding="md" radius="lg" className="h-full">
              <CardContent className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-md bg-soft-green text-primary"
                >
                  <panel.Icon className="size-4" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h2 className="text-heading-md text-ink">{panel.title}</h2>
                  <p className="text-body-sm text-ink-soft">{panel.body}</p>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}

        <li className="lg:col-span-2">
          <FeaturePlaceholder
            eyebrow="Onboarding flow"
            summary="The wizard itself — form state, document upload, resume-where-you-left-off and review before publish."
            upcoming={[
              "Multi-step form with per-step validation and saved drafts",
              "Document upload with virus scanning and retention rules",
              "KYC verification status and re-submission handling",
              "Store review queue before the storefront goes live",
            ]}
            dependencies={[
              "Organisation service",
              "Object storage",
              "Payments/KYC provider",
              "Compliance review",
            ]}
          />
        </li>
      </ol>
    </>
  );
}
