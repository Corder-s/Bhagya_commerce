import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantDashboardView } from "@/features/merchant/components/merchant-dashboard-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Dashboard",
  description: "Your Bhagya Commerce store at a glance.",
  path: "/merchant/dashboard",
  noIndex: true,
});

export default function MerchantDashboardPage() {
  return <MerchantDashboardView />;
}
