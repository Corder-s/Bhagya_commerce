import { Leaf, Recycle, Sprout, Users } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Sustainability",
  description:
    "How Bhagya Commerce measures its footprint: packaging, shipping, maker livelihoods and the trees planted with every order.",
  path: "/sustainability",
});

export default function SustainabilityPage() {
  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        variant="display"
        eyebrow="Sustainability"
        title="Claims we can measure"
        description="Sustainability language is easy and accountability is hard. These are the four numbers Bhagya reports on, and how each one is verified."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sustainability" }]}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            Icon: Sprout,
            title: "Trees planted",
            value: "41,280",
            body: "Planted with maker partners; audited annually.",
          },
          {
            Icon: Recycle,
            title: "Plastic-free parcels",
            value: "92%",
            body: "Share of orders shipped without single-use plastic.",
          },
          {
            Icon: Users,
            title: "Maker incomes",
            value: "1.7×",
            body: "Median maker payout versus regional baseline.",
          },
          {
            Icon: Leaf,
            title: "Craft clusters",
            value: "38",
            body: "Distinct craft traditions represented in the catalogue.",
          },
        ].map((metric) => (
          <Card key={metric.title} variant="surface" padding="md" className="h-full">
            <CardContent className="flex flex-col gap-2">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
              >
                <metric.Icon className="size-4" />
              </span>
              <p className="label-text mt-1 text-ink-faint">{metric.title}</p>
              <p className="font-display text-heading-xl text-primary">
                {metric.value}
              </p>
              <p className="text-caption text-ink-soft">{metric.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-caption text-ink-soft">
        Figures shown are illustrative for Phase 1 and will be served from the
        reporting service once it exists — the page will not display numbers it
        cannot substantiate.
      </p>

      <div className="mt-10">
        <FeaturePlaceholder
          eyebrow="Impact reporting"
          summary="A public impact page backed by real reporting data, plus per-order impact statements."
          upcoming={[
            "Impact reporting service with quarterly figures",
            "Per-order tree planting certificate and tracking",
            "Maker livelihood disclosures per brand",
            "Downloadable methodology for each published metric",
          ]}
          dependencies={["Reporting service", "Logistics data", "Verification partners"]}
        />
      </div>
    </Container>
  );
}
