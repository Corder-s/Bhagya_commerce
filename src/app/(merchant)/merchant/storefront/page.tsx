import type { Metadata } from "next";

import { MerchantStorefrontView } from "@/features/merchant/storefront/components/merchant-storefront-view";

export const metadata: Metadata = {
  title: "Storefront Builder & Custom Domains | Bhagya Commerce Merchant",
  description:
    "Design, configure, preview, and publish your personalized artisan storefront with custom domain routing on Bhagya Commerce.",
};

export default function MerchantStorefrontPage() {
  return <MerchantStorefrontView />;
}
