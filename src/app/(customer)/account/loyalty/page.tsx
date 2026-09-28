import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { CustomerLoyaltyView } from "@/features/account/loyalty/components/customer-loyalty-view";

export const metadata: Metadata = constructMetadata({
  title: "Artisan Guild Loyalty & Rewards",
  description: "View your Bhagya Commerce reward points balance, patron tier, redeem handcrafted vouchers, and review point activity history.",
  path: "/account/loyalty",
  noIndex: true,
});

export default function CustomerLoyaltyPage() {
  return <CustomerLoyaltyView />;
}
