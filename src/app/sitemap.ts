import type { MetadataRoute } from "next";

import { publicRoutes } from "@/config/routes";
import { siteUrl } from "@/config/site";

/**
 * sitemap.xml
 *
 * Phase 1 lists the static public surfaces. Product, brand, collection and
 * journal entries are appended in Phase 2 from the catalogue and CMS — the route
 * registry already keeps this list honest, so nothing here can 404.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route === "/" ? "" : route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/shop" ? 0.9 : 0.6,
  }));
}
