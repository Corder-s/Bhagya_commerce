import type { Metadata } from "next";
import Link from "next/link";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { StateView } from "@/components/ui/state-view";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { slugify } from "@/lib/format";

type Props = PageProps<"/collections/[slug]">;

/**
 * Collection detail.
 *
 * Async `params` (Next 16) are resolved and normalised to a human title so the
 * route is verifiable end-to-end today. Products are not fabricated: the grid
 * renders the shared empty state until the CMS and catalogue are connected.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return constructMetadata({
    title,
    description: `The ${title} collection on Bhagya Commerce — curated products from independent Indian brands.`,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionPage(props: Props) {
  const { slug } = await props.params;
  const normalised = slugify(slug);
  const title = normalised
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Container className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        variant="display"
        eyebrow="Collection"
        title={title}
        description="A curated edit with an editorial introduction, maker notes and merchandised ordering."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: marketingRoutes.collections },
          { label: title },
        ]}
      />

      <div className="mt-8">
        <StateView
          status="empty"
          loading="grid"
          rowCount={8}
          empty={{
            title: "This collection is still being assembled",
            description:
              "Collection contents are curated in the CMS alongside the catalogue. The grid, loading skeleton and empty state are finalised.",
            action: { label: "All collections", href: marketingRoutes.collections },
          }}
        >
          {null}
        </StateView>
      </div>

      <div className="mt-8">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="Editorial collection pages served from the CMS."
          upcoming={[
            "CMS-managed collection content with scheduling",
            "Curated ordering with pinned products",
            "Collection-level Open Graph imagery",
            "Related collections and cross-sell blocks",
          ]}
          dependencies={["CMS", "Catalogue API", "Media library"]}
        />
      </div>

      <p className="mt-6 text-caption text-ink-soft">
        Slug in use:{" "}
        <code className="rounded-xs bg-canvas-deep px-1.5 py-0.5 font-mono text-caption text-ink">
          {normalised}
        </code>{" "}
        ·{" "}
        <Link
          href={marketingRoutes.collections}
          className="text-primary underline-offset-4 hover:underline"
        >
          Back to all collections
        </Link>
      </p>

      <Button asChild variant="ghost" size="sm" className="mt-4">
        <Link href={marketingRoutes.shop}>Browse the shop instead</Link>
      </Button>
    </Container>
  );
}
