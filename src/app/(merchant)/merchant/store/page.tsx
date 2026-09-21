import { Eye, Palette, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { BrandMark } from "@/components/common/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Store",
  description: "Your public storefront: branding, story and address.",
  path: "/merchant/store",
  noIndex: true,
});

/**
 * Store settings.
 *
 * The preview panel shows real app chrome (the storefront header frame) with
 * honest placeholder content, so a seller can picture the outcome without us
 * mocking up a fake store page that looks live.
 */
export default function MerchantStorePage() {
  return (
    <>
      <PageHeader
        eyebrow="Storefront"
        title="Your store"
        description="How buyers see you: name, story, branding and store address."
        actions={
          <>
            <Badge tone="outline" size="lg">
              Not published
            </Badge>
            <Button variant="primary" size="md" disabled>
              Publish store
            </Button>
          </>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex flex-col gap-5">
          <Card variant="surface" padding="md" radius="lg">
            <CardContent className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
              >
                <Store className="size-4" />
              </span>
              <h2 className="text-heading-md text-ink">Store identity</h2>
              <p className="text-body-sm text-ink-soft">
                Name, logo, banner, one-line description and your story. Bhagya
                keeps maker stories first-class because buyers on this platform
                read them.
              </p>
              <dl className="mt-1 grid gap-3 sm:grid-cols-2">
                {[
                  { term: "Store name", detail: "—" },
                  { term: "Store URL", detail: "/stores/—" },
                  { term: "Craft / category", detail: "—" },
                  { term: "Location", detail: "—" },
                ].map((row) => (
                  <div key={row.term} className="flex flex-col gap-0.5">
                    <dt className="label-text text-ink-faint">{row.term}</dt>
                    <dd className="text-body-sm text-ink-soft">{row.detail}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card variant="surface" padding="md" radius="lg">
            <CardContent className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
              >
                <Palette className="size-4" />
              </span>
              <h2 className="text-heading-md text-ink">Branding</h2>
              <p className="text-body-sm text-ink-soft">
                Logo, accent colour and banner imagery. Themes will be constrained
                to the Bhagya token system so store pages stay legible and
                consistent — including contrast-checked colours.
              </p>
            </CardContent>
          </Card>

          <FeaturePlaceholder
            eyebrow="Route shell"
            summary="Store publishing, custom URLs and merchant-level SEO."
            upcoming={[
              "Store editor with drafting and preview modes",
              "Custom store URL and slug management",
              "Store-level SEO defaults and JSON-LD",
              "Publish/unpublish with review status",
            ]}
            dependencies={["Organisation service", "CMS", "Media library"]}
          />
        </div>

        <Card variant="surface" padding="none" radius="lg" className="overflow-hidden">
          <CardContent className="flex flex-col gap-0">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <span className="inline-flex items-center gap-2 text-caption text-ink-soft">
                <Eye className="size-4" aria-hidden="true" />
                Storefront preview
              </span>
              <Badge tone="neutral" size="sm">
                Preview
              </Badge>
            </div>

            <div className="flex flex-col gap-3 bg-canvas p-4">
              <BrandMark variant="compact" size="sm" />
              <div className="h-px bg-line" />
              <p className="font-display text-heading-lg text-ink">
                Your store name
              </p>
              <p className="text-caption text-ink-soft">
                Your one-line description appears here, followed by your story,
                products and maker details.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-4/5 rounded-md border border-line bg-surface"
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-line px-4 py-3">
              <Link
                href="/start-selling"
                className="text-caption font-medium text-primary underline-offset-4 hover:underline"
              >
                What buyers will see
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
