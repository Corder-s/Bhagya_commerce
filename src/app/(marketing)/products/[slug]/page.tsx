import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { ProductDetailClient } from "@/features/products/product-detail-client";
import { RelatedProducts } from "@/features/products/related-products";

/* ── Static generation: pre-render every known product slug ────────────── */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/* ── Per-product metadata ───────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return constructMetadata({
    title: product.name,
    description: product.blurb,
    path: `/products/${slug}`,
  });
}

/* ── Page ───────────────────────────────────────────────────────────────── */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = getRelatedProducts(slug, 4);

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <ProductDetailClient product={product} />
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
