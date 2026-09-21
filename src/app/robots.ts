import type { MetadataRoute } from "next";

import { privateRoutePrefixes } from "@/config/routes";
import { siteUrl } from "@/config/site";

/**
 * robots.txt
 *
 * Crawling stays open on public marketing surfaces; account, cart, checkout,
 * payment and the whole merchant workspace are disallowed — they are
 * user-specific or operational and have nothing to offer an index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...privateRoutePrefixes, "/api/", "/search"],
      },
      {
        // Image and product discovery is welcome; the rest is noise for these bots.
        userAgent: ["Googlebot-Image", "Bingbot"],
        allow: ["/", "/shop", "/brands", "/collections"],
        disallow: privateRoutePrefixes.filter((route) => route !== "/orders") as string[],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
