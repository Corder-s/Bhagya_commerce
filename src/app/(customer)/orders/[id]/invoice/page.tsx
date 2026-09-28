import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as React from "react";

import { Container } from "@/components/ui/container";
import { constructMetadata } from "@/config/seo";
import { InvoiceView } from "@/features/orders/components/invoice-view";
import { orderService } from "@/services/order.service";

export const metadata: Metadata = constructMetadata({
  title: "Tax Invoice",
  description: "View and download your official Bhagya Commerce artisan purchase tax invoice.",
  path: "/orders",
  noIndex: true,
});

export default async function OrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await orderService.getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <Container width="content" className="py-8 sm:py-10">
      <InvoiceView order={order} />
    </Container>
  );
}
