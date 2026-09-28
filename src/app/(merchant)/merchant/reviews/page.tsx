import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantReviewsView } from "@/features/merchant/components/merchant-reviews-view";

export const metadata: Metadata = constructMetadata({
  title: "Product Reviews & Feedback",
  description: "Monitor customer ratings and respond to product reviews on Bhagya Commerce.",
  path: "/merchant/reviews",
  noIndex: true,
});

export default function MerchantReviewsPage() {
  return <MerchantReviewsView />;
}
