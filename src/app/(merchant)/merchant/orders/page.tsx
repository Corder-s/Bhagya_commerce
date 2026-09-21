import { ReceiptIndianRupee } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { StateView } from "@/components/ui/state-view";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Orders",
  description: "Fulfil and track orders on Bhagya Commerce.",
  path: "/merchant/orders",
  noIndex: true,
});

export default function MerchantOrdersPage() {
  return (
    <>
      <PageHeader
        title="Orders"
        description="Everything to pack, ship and settle — with the SLA clock visible on each row."
      />

      <div className="mt-8">
        <StateView
          status="empty"
          loading="rows"
          rowCount={6}
          empty={{
            icon: <ReceiptIndianRupee />,
            title: "No orders yet",
            description:
              "Orders appear here the moment your store goes live. Rows will carry dispatch status, SLA timers and one-click label printing; the list, loading rows and empty state already exist.",
            action: { label: "Review store setup", href: "/merchant/store" },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Order operations for a busy day: filters, bulk dispatch and printable labels."
          upcoming={[
            "Order list with status, SLA and payment-state filters",
            "Order detail with buyer, items, invoice and timeline",
            "Bulk dispatch, label printing and pickup scheduling",
            "Cancellations, returns and refund handling with reasons",
          ]}
          dependencies={["Orders service", "Logistics provider", "Refunds", "Invoices"]}
        />
      </div>
    </>
  );
}
