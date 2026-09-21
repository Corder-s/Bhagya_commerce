import { Users } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { StateView } from "@/components/ui/state-view";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Customers",
  description: "Your customers, their orders and their repeat behaviour.",
  path: "/merchant/customers",
  noIndex: true,
});

export default function MerchantCustomersPage() {
  return (
    <>
      <PageHeader
        title="Customers"
        description="Who is buying from you, how often, and what they came back for."
      />

      <div className="mt-8">
        <StateView
          status="empty"
          loading="rows"
          rowCount={6}
          empty={{
            icon: <Users />,
            title: "No customers yet",
            description:
              "Customer records — order counts, lifetime value and last order date — build up from your first sales. Data arrives with the customers service in Phase 3.",
            action: { label: "Back to dashboard", href: "/merchant/dashboard" },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Customer intelligence that respects buyer privacy."
          upcoming={[
            "Customer list with order history and lifetime value",
            "Segments (repeat buyers, lapsed, high value)",
            "Consent-aware marketing export",
            "Customer detail with notes and support history",
          ]}
          dependencies={["Customers service", "Consent records", "Analytics"]}
        />
      </div>
    </>
  );
}
