import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantDashboardView } from "@/features/merchant/components/merchant-dashboard-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Workspace",
  description: "The Bhagya Commerce merchant operating workspace.",
  path: "/merchant",
  noIndex: true,
});

export default function MerchantRootPage() {
  return <MerchantDashboardView />;
}
