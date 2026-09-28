import type { Metadata } from "next";

import { MerchantLoyaltyView } from "@/features/merchant/loyalty/components/merchant-loyalty-view";

export const metadata: Metadata = {
  title: "Loyalty, Rewards & Referrals | Bhagya Commerce Merchant",
  description:
    "Configure customer loyalty rules, manage rewards catalog vouchers, inspect patron point accounts, perform audited adjustments, and track referral conversions.",
};

export default function MerchantLoyaltyPage() {
  return <MerchantLoyaltyView />;
}
