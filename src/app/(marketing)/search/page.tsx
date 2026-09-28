import type { Metadata } from "next";
import * as React from "react";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";
import { SearchResultsView } from "@/features/search/components/search-results-view";

export const metadata: Metadata = constructMetadata({
  title: "Search & Discovery",
  description: "Search handcrafted products, artisan brands, and heritage collections on Bhagya Commerce.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Container width="content" className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        eyebrow="Discover Artisans"
        title="Search Catalog"
        description="Find handcrafted goods, master weavers, and pure sustainable materials."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <div className="mt-8">
        <React.Suspense
          fallback={
            <div className="space-y-8 animate-pulse">
              <div className="h-36 rounded-3xl bg-surface border border-line" />
              <div className="h-16 rounded-2xl bg-surface border border-line" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl bg-surface border border-line" />
                ))}
              </div>
            </div>
          }
        >
          <SearchResultsView />
        </React.Suspense>
      </div>
    </Container>
  );
}
