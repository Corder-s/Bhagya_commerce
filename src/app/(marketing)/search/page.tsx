import { Search } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Search",
  description: "Search products, brands and collections on Bhagya Commerce.",
  path: "/search",
  // Search result pages are never indexed — they are user-specific and thin.
  noIndex: true,
});

/**
 * Search.
 *
 * A real route with the real search field, wired to nothing. The header's ⌘K
 * dialog links here in Phase 2; today both entry points are honest about the
 * absence of a search service rather than returning an empty result list.
 */
export default function SearchPage() {
  return (
    <Container width="content" className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        eyebrow="Discover"
        title="Search"
        description="Find a product, a maker or a material."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <form role="search" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          type="search"
          name="q"
          inputSize="lg"
          autoComplete="off"
          leadingIcon={<Search aria-hidden="true" />}
          placeholder="Handloom cotton, terracotta, cold-pressed…"
          aria-label="Search products, brands and collections"
          disabled
          className="sm:flex-1"
        />
        <span
          aria-hidden="true"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary-disabled px-6 text-body-sm font-medium text-primary-foreground"
        >
          Search
        </span>
      </form>

      <div className="mt-8 rounded-lg border border-line bg-surface">
        <EmptyState
          size="lg"
          icon={<Search />}
          title="Search opens in Phase 2"
          description="The field, the keyboard shortcut from the header, and this route are already in place. The search index and result ranking are Phase 2 work."
          action={{ label: "Browse the shop", href: marketingRoutes.shop }}
          secondaryAction={{ label: "See brands", href: marketingRoutes.brands }}
        />
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Query understanding, typo tolerance and result ranking."
          upcoming={[
            "Full-text search with typo tolerance and synonyms",
            "Faceted results by category, price, craft and brand",
            "Recent searches and autocomplete suggestions",
            "Zero-result recovery with related products",
          ]}
          dependencies={["Search index", "Catalogue API", "Query analytics"]}
        />
      </div>
    </Container>
  );
}
