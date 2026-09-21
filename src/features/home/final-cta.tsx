import { ArrowRight, Store } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BhagyaGlyph } from "@/components/common/brand-mark";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { marketingRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

/**
 * FinalCTA — the emotional close.
 *
 * The page has argued; this is the exhale. Full-bleed deep green (the only
 * large green surface above the footer), the headline set large in the display
 * serif, two actions and nothing else competing for attention. The leaf motif
 * is the same geometry as the logo mark, scaled up as atmosphere.
 */
export function FinalCTA() {
  return (
    <section
      data-surface="inverse"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-gradient-deep-brand text-ink-inverse"
    >
      <BhagyaGlyph
        className="pointer-events-none absolute -right-16 -top-20 size-[26rem] text-emerald-400/20 sm:-right-10 sm:size-[30rem]"
      />
      <BhagyaGlyph
        className="pointer-events-none absolute -bottom-24 -left-20 size-[22rem] text-amber-300/15"
      />

      <div className="container-page relative py-[var(--section-y)]">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Reveal>
            <h2
              id="final-cta-heading"
              className="font-display text-display-lg font-medium text-ink-inverse text-balance sm:text-display-xl"
            >
              Choose better.
              <br />
              Live better.
              <br />
              <span className="text-gradient-glow font-semibold">Grow together.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-md text-body-lg text-ink-inverse-soft">
              One account for both sides of Bhagya — shop today, open your store
              when you are ready.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary" tone="inverse">
                <Link href={marketingRoutes.shop}>
                  Explore Products
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" tone="inverse">
                <Link href={marketingRoutes.startSelling}>
                  <Store aria-hidden="true" />
                  Start Your Store
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="label-text text-ink-inverse-soft">{siteConfig.tagline}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
