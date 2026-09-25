import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { commerceRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { TrackingView } from "@/features/orders/components/tracking-view";
import { AuthGuard } from "@/features/auth/auth-guard";

type Props = PageProps<"/orders/[id]/tracking">;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;

  return constructMetadata({
    title: `Tracking — Order ${id}`,
    description: `Real-time carrier checkpoint scans and status for order ${id}.`,
    path: `/orders/${id}/tracking`,
    noIndex: true,
  });
}

export default async function TrackingPage(props: Props) {
  const { id } = await props.params;

  return (
    <AuthGuard>
      <Container className="py-8 sm:py-10 lg:py-12">
        <PageHeader
          title="Track Shipment"
          description="Live carrier checkpoint scans and verified delivery updates."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Orders", href: commerceRoutes.orders },
            { label: id, href: commerceRoutes.order(id) },
            { label: "Tracking" },
          ]}
          actions={
            <Button asChild variant="outline" size="md">
              <Link href={commerceRoutes.order(id)}>View Order Details</Link>
            </Button>
          }
        />

        <div className="mt-8">
          <TrackingView orderId={id} />
        </div>
      </Container>
    </AuthGuard>
  );
}
