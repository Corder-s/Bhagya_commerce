import { Package } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { StateView } from "@/components/ui/state-view";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Products",
  description: "Manage your catalogue on Bhagya Commerce.",
  path: "/merchant/products",
  noIndex: true,
});

export default function MerchantProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Draft, publish and organise your catalogue."
        actions={
          <Button variant="primary" size="md" disabled>
            Add product
          </Button>
        }
      />

      <Tabs defaultValue="all" className="mt-6">
        <TabsList aria-label="Filter products">
          {[
            { value: "all", label: "All" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Drafts" },
            { value: "archived", label: "Archived" },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} disabled>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-6">
        <StateView
          status="empty"
          empty={{
            icon: <Package />,
            title: "No products yet",
            description:
              "Your catalogue lives here: bulk edit, variants, media, inventory and per-product SEO. The table, filters and empty state are in place; the catalogue service arrives in Phase 3.",
            action: { label: "Add your first product" },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Product management with variants, media and publishing controls."
          upcoming={[
            "Product table with search, filters and bulk actions",
            "Editor with variants, pricing, inventory and care instructions",
            "Media pipeline with automatic image sizing and alt text prompts",
            "Per-product SEO fields feeding the storefront metadata",
          ]}
          dependencies={["Catalogue service", "Object storage", "Search index"]}
        />
      </div>
    </>
  );
}
