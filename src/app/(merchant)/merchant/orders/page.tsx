import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantOrdersView } from "@/features/merchant/components/merchant-orders-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Orders",
  description: "Fulfil, track, and manage customer orders on Bhagya Commerce.",
  path: "/merchant/orders",
  noIndex: true,
});

export default function MerchantOrdersPage() {
  return <MerchantOrdersView />;
}
