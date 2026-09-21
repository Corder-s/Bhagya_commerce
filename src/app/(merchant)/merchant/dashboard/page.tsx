import type { Metadata } from "next";

import {
  MerchantOverviewCards,
  type MerchantMetric,
} from "@/features/merchant/merchant-overview-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Dashboard",
  description: "Your Bhagya Commerce store at a glance.",
  path: "/merchant/dashboard",
  noIndex: true,
});

/**
 * Metrics are declared with `value: null` on purpose: the honest Phase 1 state
 * is "not connected", which renders "—" rather than a confident zero that a
 * seller might read as a real (and alarming) sales figure.
 */
const metrics: readonly MerchantMetric[] = [
  { id: "revenue", label: "Revenue · 30 days", value: null, format: "currency" },
  { id: "orders", label: "Orders · 30 days", value: null, format: "number" },
  { id: "aov", label: "Average order value", value: null, format: "currency" },
  { id: "repeat", label: "Repeat customer rate", value: null, format: "number" },
];

export default function MerchantDashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="How your store is doing right now, and what to do about it."
        actions={
          <>
            <Badge tone="outline" size="lg">
              Analytics pending
            </Badge>
            <Button variant="primary" size="md" disabled>
              Add product
            </Button>
          </>
        }
      />

      <div className="mt-8 flex flex-col gap-8">
        <MerchantOverviewCards metrics={metrics} />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card variant="surface" padding="md" radius="lg">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-heading-md text-ink">Revenue trend</h2>
                <div className="flex gap-2">
                  {["7d", "30d", "90d"].map((range) => (
                    <span
                      key={range}
                      className="rounded-pill border border-line px-2.5 py-1 text-caption text-ink-faint"
                    >
                      {range}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chart placeholder: an honest skeleton, not a fake line chart. */}
              <div className="flex items-end gap-2" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="block"
                    className="w-full"
                    style={{ height: `${28 + ((index * 17) % 60)}px` }}
                  />
                ))}
              </div>
              <p className="text-caption text-ink-soft">
                Charts render from the analytics service in Phase 3. The card
                reserves its exact height, so no layout shifts when data arrives.
              </p>
            </CardContent>
          </Card>

          <Card variant="surface" padding="md" radius="lg">
            <CardContent className="flex flex-col gap-3.5">
              <h2 className="text-heading-md text-ink">Next steps</h2>
              <ul className="flex flex-col gap-3">
                {[
                  { title: "Complete your store setup", detail: "5 steps left" },
                  { title: "Add your first product", detail: "Unlocks the storefront" },
                  { title: "Set shipping defaults", detail: "Needed before publishing" },
                ].map((step) => (
                  <li
                    key={step.title}
                    className="flex items-start justify-between gap-4 rounded-md border border-line px-3.5 py-3"
                  >
                    <span className="flex flex-col">
                      <span className="text-body-sm font-medium text-ink">
                        {step.title}
                      </span>
                      <span className="text-caption text-ink-soft">{step.detail}</span>
                    </span>
                    <span aria-hidden="true" className="mt-1 text-ink-faint">
                      →
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
