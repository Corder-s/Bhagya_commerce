import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as React from "react";

import { PublicStorefrontView } from "@/features/storefront/public-storefront-view";
import { storefrontService } from "@/services/storefront.service";

interface StorefrontPageProps {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: StorefrontPageProps): Promise<Metadata> {
  const { storeSlug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  try {
    const data = isPreview
      ? await storefrontService.getPreview()
      : await storefrontService.getPublicStorefront(storeSlug);

    const title = data.configuration.seoTitle || `${data.storeName} | Bhagya Commerce`;
    const description = data.configuration.seoDescription || data.configuration.description || "Authentic artisan craft storefront.";

    return {
      title,
      description,
      alternates: {
        canonical: data.canonicalUrl,
      },
      openGraph: {
        title: data.configuration.ogTitle || title,
        description: data.configuration.ogDescription || description,
        url: data.canonicalUrl,
        images: data.configuration.ogImageUrl ? [{ url: data.configuration.ogImageUrl }] : undefined,
      },
      robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
    };
  } catch {
    return {
      title: "Artisan Storefront | Bhagya Commerce",
    };
  }
}

export default async function PublicStorefrontPage({
  params,
  searchParams,
}: StorefrontPageProps) {
  const { storeSlug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  let data;
  try {
    data = isPreview
      ? await storefrontService.getPreview()
      : await storefrontService.getPublicStorefront(storeSlug);
  } catch {
    notFound();
  }

  if (!data) {
    notFound();
  }

  return <PublicStorefrontView data={data} />;
}
