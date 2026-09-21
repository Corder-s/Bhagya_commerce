import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * Web app manifest.
 *
 * Phase 1 declares the identity and the installable shell (name, colours,
 * icons). Offline support and install prompts are a later phase; a service
 * worker is intentionally absent so nothing is cached behind the user's back.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.shortName,
    description: siteConfig.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    orientation: "portrait",
    lang: siteConfig.language,
    dir: "ltr",
    categories: ["shopping", "lifestyle", "business"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
