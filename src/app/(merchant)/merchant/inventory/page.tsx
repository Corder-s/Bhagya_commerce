import { Boxes } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { StateView } from "@/components/ui/state-view";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Inventory",
  description: "Stock levels and restock alerts for your Bhagya Commerce store.",
  path: "/merchant/inventory",
  noIndex: true,
});

export default function MerchantInventoryPage() {
  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock by variant, with low-stock alerts and quick adjustments."
      />

      <div className="mt-8">
        <StateView
          status="empty"
          loading="rows"
          rowCount={8}
          empty={{
            icon: <Boxes />,
            title: "Inventory is empty",
            description:
              "Stock levels, reservations and restock alerts live here. Inventory tracking is Phase 3 work — the table shape, loading rows and empty state are ready for it.",
            action: { label: "See products", href: "/merchant/products" },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Inventory control with reservations and restock signals."
          upcoming={[
            "Stock ledger by variant with adjustment reasons",
            "Reservation handling so two buyers cannot take the last unit",
            "Low-stock thresholds and reorder suggestions",
            "Bulk CSV import and export of stock levels",
          ]}
          dependencies={["Inventory service", "Orders service", "Notifications"]}
        />
      </div>
    </>
  );
}
