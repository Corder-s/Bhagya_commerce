import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Typed routes: every `<Link href>` is checked against the routes that actually
   * exist, so a typo in navigation or a footer column fails the build instead of
   * shipping a 404. This is why `src/config/routes.ts` is the single source of
   * truth for link targets.
   */
  typedRoutes: true,

  /** No framework fingerprint needed on responses. */
  poweredByHeader: false,

  /**
   * Remote image hosts are added in Phase 2 together with the catalogue media
   * pipeline. Phase 1 renders no remote imagery (avatars and catalogue images use
   * plain `<img>` behind a documented eslint exception), so no `remotePatterns`
   * are declared yet — an unused allow-list is a security surface, not a feature.
   */
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },

  /** Smaller client payloads: no experimental flags enabled speculatively. */
  reactStrictMode: true,
};

export default nextConfig;
