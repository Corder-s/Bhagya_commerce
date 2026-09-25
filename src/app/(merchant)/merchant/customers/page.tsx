import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantCustomersView } from "@/features/merchant/components/merchant-customers-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Customers",
  description: "View customer relationships, orders, and lifetime value on Bhagya Commerce.",
  path: "/merchant/customers",
  noIndex: true,
});

export default function MerchantCustomersPage() {
  return <MerchantCustomersView />;
}
