import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { CustomerReferralsView } from "@/features/account/referrals/components/customer-referrals-view";

export const metadata: Metadata = constructMetadata({
  title: "Invite Friends & Earn Rewards",
  description: "Share your unique artisan referral code with friends and earn points on every qualified purchase.",
  path: "/account/referrals",
  noIndex: true,
});

export default function CustomerReferralsPage() {
  return <CustomerReferralsView />;
}
