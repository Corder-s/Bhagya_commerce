import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { commerceRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { OrderDetailView } from "@/features/orders/components/order-detail-view";
import { AuthGuard } from "@/features/auth/auth-guard";

type Props = PageProps<"/orders/[id]">;

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
    <AuthGuard>
      <Container className="py-8 sm:py-10 lg:py-12">
        <PageHeader
          title="Order Details"
          description="Items, delivery address, invoice and verified maker details."
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

        <div className="mt-8">
          <OrderDetailView orderId={id} />
        </div>
      </Container>
    </AuthGuard>
  );
}
