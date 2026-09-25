import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantInventoryView } from "@/features/merchant/components/merchant-inventory-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Inventory",
  description: "Monitor stock levels, reservations, and restock alerts on Bhagya Commerce.",
  path: "/merchant/inventory",
  noIndex: true,
});

export default function MerchantInventoryPage() {
  return <MerchantInventoryView />;
}
