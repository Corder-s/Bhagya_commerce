import { Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  OrderTimeline,
  placeholderTrackingStages,
} from "@/features/orders/order-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { commerceRoutes, marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

type Props = PageProps<"/orders/[id]/tracking">;

/**
 * Order tracking.
 *
 * Shows the real timeline component with an explicitly unstarted shipment. No
 * carrier events are fabricated: real tracking requires webhooks from the
 * logistics provider (Phase 3), and inventing stages would be worse than an
 * honest empty timeline.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;

  return constructMetadata({
    title: `Tracking — order ${id}`,
    description: `Shipment progress for order ${id}.`,
    path: `/orders/${id}/tracking`,
    noIndex: true,
  });
}

export default async function TrackingPage(props: Props) {
  const { id } = await props.params;

  return (
    <Container width="content" className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        title="Track your order"
        description="Live carrier events appear here the moment the shipment is handed over."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Orders", href: commerceRoutes.orders },
          { label: id, href: commerceRoutes.order(id) },
          { label: "Tracking" },
        ]}
        actions={
          <Button asChild variant="outline" size="md">
            <Link href={commerceRoutes.order(id)}>Order details</Link>
          </Button>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <Card variant="surface" padding="lg" radius="lg">
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center gap-3.5 border-b border-line pb-4">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-md bg-soft-green text-primary"
              >
                <Truck className="size-4" />
              </span>
              <div className="flex flex-col">
                <p className="text-body-sm font-medium text-ink">
                  Shipment not started
                </p>
                <p className="text-caption text-ink-soft">
                  Carrier tracking is connected in Phase 3
                </p>
              </div>
            </div>

            <OrderTimeline stages={placeholderTrackingStages} />
          </CardContent>
        </Card>

        <Card variant="botanical" padding="md" radius="lg">
          <CardContent className="flex flex-col gap-2.5">
            <h2 className="text-heading-md text-ink">Delivery details</h2>
            <p className="text-body-sm text-ink-soft">
              Carrier name, AWB number, delivery slot and the maker&apos;s dispatch
              address appear here once logistics is integrated.
            </p>
            <p className="text-caption text-ink-soft">
              Tracking links open in the carrier&apos;s own interface — Bhagya never
              shows estimated dates it cannot stand behind.
            </p>
            <Link
              href={marketingRoutes.help}
              className="mt-1 text-body-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Shipping questions
            </Link>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
