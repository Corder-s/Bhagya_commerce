import { MapPin } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Addresses",
  description: "Delivery and billing addresses saved to your Bhagya Commerce account.",
  path: "/account/addresses",
  noIndex: true,
});

export default function AddressesPage() {
  return (
    <>
      <PageHeader
        title="Addresses"
        description="Save the places you ship to so checkout stays a two-tap affair."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Addresses" },
        ]}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="rounded-lg border border-line bg-surface">
          <EmptyState
            size="lg"
            icon={<MapPin />}
            title="No saved addresses"
            description="Address books, pincode serviceability and default selection are Phase 2 work. The empty, loading and error states of this surface are already in place."
          />
        </div>

        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Address book with validation and default selection."
          upcoming={[
            "Create, edit and delete addresses with pincode validation",
            "Set a default delivery and billing address",
            "Serviceability check against maker pin codes",
            "Address autofill from the customer's last order",
          ]}
          dependencies={["Customer service", "Logistics provider", "Payments (billing address)"]}
        />
      </div>
    </>
  );
}
