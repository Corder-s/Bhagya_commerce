import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantStoreSettingsView } from "@/features/merchant/components/merchant-store-settings-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Store Settings",
  description: "Configure your public storefront branding, story, and address on Bhagya Commerce.",
  path: "/merchant/store",
  noIndex: true,
});

export default function MerchantStorePage() {
  return <MerchantStoreSettingsView />;
}
