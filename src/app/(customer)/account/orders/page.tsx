import type { Metadata } from "next";

import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";
import { MyOrdersView } from "@/features/orders/components/my-orders-view";

export const metadata: Metadata = constructMetadata({
  title: "My Orders",
  description: "View, track and manage your Bhagya Commerce purchases.",
  path: "/account/orders",
  noIndex: true,
});

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="My Orders"
        description="View, track and manage your Bhagya purchases."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Orders" },
        ]}
      />

      <div className="mt-8">
        <MyOrdersView />
      </div>
    </>
  );
}
