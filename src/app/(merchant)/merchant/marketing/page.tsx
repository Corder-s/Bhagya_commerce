import { Megaphone } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { StateView } from "@/components/ui/state-view";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Marketing",
  description: "Campaigns, coupons and promotions for your Bhagya Commerce store.",
  path: "/merchant/marketing",
  noIndex: true,
});

export default function MerchantMarketingPage() {
  return (
    <>
      <PageHeader
        title="Marketing"
        description="Campaigns, coupons and storefront placements — measured, not guessed."
        actions={
          <Button variant="primary" size="md" disabled>
            New campaign
          </Button>
        }
      />

      <div className="mt-8">
        <StateView
          status="empty"
          empty={{
            icon: <Megaphone />,
            title: "No campaigns running",
            description:
              "Coupons, festive campaigns, bundles and Bhagya homepage placements appear here with their revenue attribution. Campaign tooling arrives in Phase 4.",
            action: { label: "See analytics", href: "/merchant/analytics" },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Promotions with honest attribution and no dark patterns."
          upcoming={[
            "Coupon builder with limits, stacking rules and expiry",
            "Campaign scheduling with festive calendars",
            "Attribution reporting tied back to orders",
            "AI-drafted campaign copy in the seller's own voice",
          ]}
          dependencies={["Promotions service", "Analytics", "Bhagya AI"]}
        />
      </div>
    </>
  );
}
