import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantProductsView } from "@/features/merchant/components/merchant-products-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Products",
  description: "Manage your artisanal catalogue, pricing, and stock on Bhagya Commerce.",
  path: "/merchant/products",
  noIndex: true,
});

export default function MerchantProductsPage() {
  return <MerchantProductsView />;
}
