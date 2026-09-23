import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { MotionProvider } from "@/components/common/motion-provider";
import { RevealObserver } from "@/components/common/reveal-observer";
import { SkipLink } from "@/components/common/skip-link";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { baseMetadata, baseViewport } from "@/config/seo";
import { siteConfig } from "@/config/site";

import { CartDrawer } from "@/features/cart/cart-drawer";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";

import "./globals.css";

/**
 * Fonts.
 *
 * Two families, two jobs:
 *   Inter                — every interface surface (nav, forms, tables, body)
 *   Cormorant Garamond   — editorial storytelling headings only
 *
 * Loaded through `next/font` so they are self-hosted, preloaded, `display: swap`
 * and free of layout shift (size-adjusted fallbacks). Weights are limited to the
 * two/three each family actually uses, which keeps the font payload small.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = baseMetadata;
export const viewport = baseViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.language}
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the document as JavaScript-capable before the first paint, so
          scroll-reveal can start hidden without ever hiding content from a
          visitor whose scripts did not run. Must stay inline and blocking:
          a deferred version would let revealed content flash first.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add(\"js\")",
          }}
        />
      </head>

      <body className="min-h-full bg-canvas font-sans text-ink">
        {/* Organisation-level structured data lives once, at the root. */}
        <script
          type="application/ld+json"
          // Static, build-time constant — no user input is interpolated.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              slogan: siteConfig.tagline,
              description: siteConfig.description,
              email: siteConfig.support.email,
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
                addressLocality: siteConfig.support.address,
              },
              sameAs: Object.values(siteConfig.social),
            }),
          }}
        />

        <SkipLink />
        <RevealObserver />

        <MotionProvider>
          {/* One tooltip provider for the tree — tooltips are cheap, providers are not. */}
          <TooltipProvider>
            <CartProvider>
              <WishlistProvider>
                {children}
                <CartDrawer />
                <Toaster />
              </WishlistProvider>
            </CartProvider>
          </TooltipProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
