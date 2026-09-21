import { ReceiptText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { commerceRoutes, marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

type Props = PageProps<"/orders/[id]">;

/**
 * Order detail.
 *
 * Dynamic route with async `params` (Next 16) resolved before render. The order
 * id is displayed verbatim so the route is verifiable, but no order data is
 * invented — the page states which service will fill it in.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;

  return constructMetadata({
    title: `Order ${id}`,
    description: `Details and status for order ${id}.`,
    path: `/orders/${id}`,
    noIndex: true,
  });
}

export default async function OrderDetailPage(props: Props) {
  const { id } = await props.params;

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        title={`Order ${id}`}
        description="Items, delivery address, invoice and maker details for this order."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders", href: commerceRoutes.orders },
          { label: id },
        ]}
        actions={
          <>
            <Button asChild variant="primary" size="md">
              <Link href={commerceRoutes.orderTracking(id)}>Track order</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href={commerceRoutes.orders}>All orders</Link>
            </Button>
          </>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <Card variant="surface" padding="lg" radius="lg">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-md bg-soft-green text-primary"
              >
                <ReceiptText className="size-4" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-heading-lg text-ink">Order details load here</h2>
                <p className="max-w-xl text-body-sm text-ink-soft">
                  This route is wired to the order id{" "}
                  <code className="rounded-xs bg-canvas-deep px-1.5 py-0.5 font-mono text-caption text-ink">
                    {id}
                  </code>
                  . The orders service supplies line items, totals, addresses and
                  invoices in Phase 3 — until then no order contents are displayed,
                  real or simulated.
                </p>
              </div>
            </div>

            <dl className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
              {[
                { term: "Placed", detail: "—" },
                { term: "Total", detail: "—" },
                { term: "Payment", detail: "—" },
                { term: "Delivery estimate", detail: "—" },
              ].map((row) => (
                <div key={row.term} className="flex flex-col gap-0.5">
                  <dt className="label-text text-ink-faint">{row.term}</dt>
                  <dd className="text-body-md text-ink-soft">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Everything the order detail page will own once orders exist."
          upcoming={[
            "Line items with maker and SKU detail",
            "Downloadable GST invoice",
            "Cancel, return and refund actions by status",
            "Support handoff with order context attached",
          ]}
          dependencies={["Orders service", "Invoices", "Refunds", "Support desk"]}
        />
      </div>

      <p className="mt-8 text-caption text-ink-soft">
        Order id in the URL is validated and typed; invalid ids fall through to the{" "}
        <Link href={marketingRoutes.shop} className="text-primary underline-offset-4 hover:underline">
          shop
        </Link>{" "}
        once the data layer exists.
      </p>
    </Container>
  );
}
