import { Compass, Home, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BrandMark } from "@/components/common/brand-mark";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { marketingRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * 404 — kept inside the app shell's visual language even though Next renders it
 * outside the route-group layouts. It offers three concrete ways out (home,
 * shop, help) rather than a dead end, and carries its own noindex.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="px-[var(--gutter)] py-6">
        <Link
          href={marketingRoutes.home}
          aria-label="Bhagya Commerce — home"
          className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
        >
          <BrandMark variant="compact" size="sm" />
        </Link>
      </header>

      <main
        id="main"
        className="flex flex-1 items-center justify-center px-[var(--gutter)] py-16"
      >
        <Container width="narrow" className="px-0 text-center">
          <p className="label-text text-gold-deep">Error 404</p>
          <h1 className="mt-3 font-display text-display-md font-medium text-ink text-balance">
            This page has wandered off
          </h1>
          <p className="mx-auto mt-3 max-w-md text-body-md text-ink-soft">
            The link may be old, or the page may not exist yet. Nothing is broken
            on your side.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={marketingRoutes.home}>
                <Home aria-hidden="true" />
                Back to home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={marketingRoutes.shop}>
                <Compass aria-hidden="true" />
                Browse the shop
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href={marketingRoutes.help}>
                <Search aria-hidden="true" />
                Search help
              </Link>
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}
