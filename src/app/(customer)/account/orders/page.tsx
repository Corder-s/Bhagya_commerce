import { Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { commerceRoutes, marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Orders",
  description: "Track and review your Bhagya Commerce orders.",
  path: "/account/orders",
  noIndex: true,
});

const filters = ["All", "In transit", "Delivered", "Cancelled", "Returns"] as const;

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Orders"
        description="Every order you have placed on Bhagya, with live status once tracking is connected."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders" },
        ]}
      />

      <Tabs defaultValue="All" className="mt-6">
        <TabsList aria-label="Filter orders">
          {filters.map((filter) => (
            <TabsTrigger key={filter} value={filter} disabled>
              {filter}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6 rounded-lg border border-line bg-surface">
        <EmptyState
          size="lg"
          icon={<Package />}
          title="No orders yet"
          description="Once you place an order it appears here with its tracking timeline, invoice and reorder action. Order history needs the orders service, which arrives in Phase 3."
          action={{ label: "Browse the shop", href: marketingRoutes.shop }}
          secondaryAction={{ label: "Ask a question", href: marketingRoutes.help }}
        />
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Order history, order detail and tracking are structured but not yet connected to data."
          upcoming={[
            "Order list with status filters and pagination",
            "Order detail: items, invoice, delivery address, maker info",
            "Tracking timeline fed by carrier webhooks",
            "Reorder, cancel, return and refund request flows",
          ]}
          dependencies={["Orders service", "Carrier webhooks", "Invoices", "Refunds"]}
        />
      </div>

      <div className="mt-6">
        <Button asChild variant="ghost" size="sm">
          <Link href={commerceRoutes.order("BC-2401-000000")}>
            Preview the order detail shell
          </Link>
        </Button>
      </div>
    </>
  );
}
