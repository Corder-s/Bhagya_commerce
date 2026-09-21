import type { Metadata } from "next";

import {
  MerchantOverviewCards,
  type MerchantMetric,
} from "@/features/merchant/merchant-overview-cards";
import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Analytics",
  description: "Sales, traffic and conversion for your Bhagya Commerce store.",
  path: "/merchant/analytics",
  noIndex: true,
});

const metrics: readonly MerchantMetric[] = [
  { id: "revenue", label: "Revenue", value: null, format: "currency" },
  { id: "sessions", label: "Store sessions", value: null, format: "number" },
  { id: "conversion", label: "Conversion rate", value: null },
  { id: "returns", label: "Return rate", value: null },
];

export default function MerchantAnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        description="What is selling, where traffic comes from, and where buyers drop off."
        actions={
          <Badge tone="outline" size="lg">
            Not connected
          </Badge>
        }
      />

      <div className="mt-8 flex flex-col gap-6">
        <MerchantOverviewCards metrics={metrics} />

        <div className="grid gap-5 lg:grid-cols-2">
          {[
            { title: "Revenue over time", note: "Daily, weekly and monthly granularity" },
            { title: "Top products", note: "By revenue, units and margin" },
            { title: "Traffic sources", note: "Search, social, direct and referrals" },
            { title: "Funnel drop-off", note: "From product view to paid order" },
          ].map((panel) => (
            <Card key={panel.title} variant="surface" padding="md" radius="lg">
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-heading-md text-ink">{panel.title}</h2>
                  <p className="text-caption text-ink-soft">{panel.note}</p>
                </div>
                <Skeleton variant="block" className="h-40" />
                <p className="text-caption text-ink-soft">
                  Rendered from the analytics service in Phase 3.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Analytics built on aggregated events, with export and comparison ranges."
          upcoming={[
            "Aggregated event pipeline with daily rollups",
            "Date-range comparison and cohort retention",
            "Product-level margin and return analysis",
            "CSV export and scheduled email digests",
          ]}
          dependencies={["Analytics service", "Event pipeline", "Orders service"]}
        />
      </div>
    </>
  );
}
