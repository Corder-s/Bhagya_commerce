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
 * Muted deep sage in light mode (#53695F), deep dark in dark mode (#1D2522),
 * with soft sage atmosphere and high contrast typography.
 */
export function FinalCTA() {
  return (
    <section
      data-surface="inverse"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-[#53695F] dark:bg-[#1D2522] text-[#FCFBF7]"
    >
      <BhagyaGlyph
        className="pointer-events-none absolute -right-16 -top-20 size-[26rem] text-[#DCE5DF]/15 sm:-right-10 sm:size-[30rem]"
      />
      <BhagyaGlyph
        className="pointer-events-none absolute -bottom-24 -left-20 size-[22rem] text-[#9BAFA3]/10"
      />

      <div className="container-page relative py-[var(--section-y)]">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Reveal>
            <h2
              id="final-cta-heading"
              className="font-display text-display-lg font-medium text-[#FCFBF7] text-balance sm:text-display-xl"
            >
              Choose better.
              <br />
              Live better.
              <br />
              <span className="text-gradient-glow font-semibold">Grow together.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="max-w-md text-body-lg text-[#CCD2CB]">
              One account for both sides of Bhagya — shop today, open your store
              when you are ready.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="primary">
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
            <p className="label-text text-[#CCD2CB]/80 text-[11px] tracking-widest uppercase">{siteConfig.tagline}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
