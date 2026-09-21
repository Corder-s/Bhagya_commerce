import { Heart } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { PageHeader } from "@/components/ui/page-header";
import { StateView } from "@/components/ui/state-view";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import type { LoadableStatus } from "@/types/navigation";

export const metadata: Metadata = constructMetadata({
  title: "Wishlist",
  description: "Products you have saved on Bhagya Commerce.",
  path: "/account/wishlist",
  noIndex: true,
});

/**
 * Wishlist.
 *
 * Demonstrates `StateView`, the single switch every data-driven feature uses:
 * loading skeleton → empty → error → success. Phase 1 shows the empty branch,
 * which is the truthful state until wishlist persistence exists.
 */
export default function WishlistPage() {
  const status: LoadableStatus = "empty";

  return (
    <>
      <PageHeader
        title="Wishlist"
        description="Saved products, kept in sync across your devices."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Wishlist" },
        ]}
      />

      <div className="mt-8">
        <StateView
          status={status}
          loading="grid"
          rowCount={4}
          empty={{
            icon: <Heart />,
            title: "Nothing saved yet",
            description:
              "Tap the heart on any product to save it here. Wishlist persistence arrives in Phase 2 — the grid, states and product card are ready.",
            action: { label: "Browse the shop", href: marketingRoutes.shop },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Wishlist persistence, sharing and price-drop alerts."
          upcoming={[
            "Saved items synced to the customer account",
            "Collections inside the wishlist (e.g. “Kitchen”, “Gifting”)",
            "Back-in-stock and price-drop notifications",
            "Share a wishlist as a link",
          ]}
          dependencies={["Customer service", "Notifications", "Catalogue API"]}
        />
      </div>
    </>
  );
}
