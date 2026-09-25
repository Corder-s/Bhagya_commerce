import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";
import { MerchantAnalyticsDashboard } from "@/features/merchant/analytics/merchant-analytics-dashboard";

export const metadata: Metadata = constructMetadata({
  title: "Analytics",
  description: "Sales, traffic, funnel and product intelligence for your Bhagya Commerce store.",
  path: "/merchant/analytics",
  noIndex: true,
});

export default function MerchantAnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights & Intelligence"
        title="Store Analytics"
        description="Authoritative revenue, conversion funnel, product performance, and customer retention metrics."
      />

      <div className="mt-8">
        <MerchantAnalyticsDashboard />
      </div>
    </>
  );
}

