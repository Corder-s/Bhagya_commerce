import type { Metadata } from "next";

import { MerchantBillingView } from "@/features/merchant/billing/components/merchant-billing-view";

export const metadata: Metadata = {
  title: "SaaS Billing & Subscriptions | Bhagya Commerce Merchant",
  description:
    "Manage your Bhagya Commerce merchant subscription, explore artisan tier plans, view GST-compliant SaaS invoices, and configure your business billing profile.",
};

export default function MerchantBillingPage() {
  return <MerchantBillingView />;
}
