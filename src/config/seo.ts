import type { Metadata, Viewport } from "next";

import { siteConfig, siteUrl } from "@/config/site";

/**
 * Builds page-level metadata with consistent canonical, Open Graph and Twitter
 * treatment. Every route should go through this so no page silently loses its
 * social card or canonical URL.
 */
export function constructMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
  keywords,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: readonly string[];
} = {}): Metadata {
  const resolvedTitle = title ?? siteConfig.title;
  const isHome = path === "/";
  const resolvedDescription = description ?? siteConfig.description;
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  const ogImage = image ?? siteConfig.ogImage;

  return {
    // The home route owns the full brand title; other routes let the layout's
    // `%s — Bhagya Commerce` template compose with the page name.
    title: isHome ? { absolute: resolvedTitle } : resolvedTitle,
    description: resolvedDescription,
    keywords: keywords ? [...keywords] : [...siteConfig.keywords],
    alternates: { canonical: url || siteUrl },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      title: resolvedTitle,
      description: resolvedDescription,
      url: url || siteUrl,
      images: [
        { url: ogImage, width: 1200, height: 630, alt: siteConfig.tagline },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [ogImage],
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
    },
  };
}

/** Shared viewport / theme-colour export used by the root layout. */
export const baseViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.backgroundColor },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.backgroundColor },
  ],
  colorScheme: "light",
};

/** Default metadata exported by `app/layout.tsx`. */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...constructMetadata(),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "shopping",
  formatDetection: { email: false, address: false, telephone: false },
  // Fill these in Phase 2 once search-console properties are created.
  verification: {},
};
