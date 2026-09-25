import { ArrowRight, ShieldCheck, Sparkles, Store, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { marketingRoutes } from "@/config/routes";
import { cn } from "@/lib/utils";

/**
 * Hero — the editorial opening.
 *
 * Asymmetric by design: the headline column is deliberately narrower than the
 * image column, and the type is set large enough to carry the page on its own.
 * The structure is a quiet four-part rhythm — eyebrow, headline, standfirst,
 * actions — with the trust indicators attached to the buttons rather than
 * floating in their own band.
 *
 * The image is a real, art-directed still life (not a stock pattern): the
 * brief's "premium Indian craft" mood, shot as a composed object study. A
 * second, smaller frame overlaps the first on desktop to give the composition
 * depth without turning it into a collage.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Luminous atmosphere wash across hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-hero-warm opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-3/5 bg-gradient-to-l from-canvas/80 via-primary/5 to-transparent"
      />

      <div className="container-wide relative py-10 sm:py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
          {/* ------------------------------------------------------- Copy */}
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <p className="label-text flex items-center font-semibold">
                <Sparkles className="mr-1.5 inline size-3.5 text-gold align-[-0.1em]" aria-hidden="true" />
                <span className="text-gradient-gold">A conscious marketplace</span>
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h1
                id="hero-heading"
                className="font-display text-display-xl font-medium text-ink text-balance"
              >
                Better choices,
                <br />
                <em className="not-italic text-gradient-brand font-semibold">beautifully</em> brought
                together.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-lg text-body-lg text-ink-soft">
                Discover thoughtful products from independent Indian brands
                creating a better tomorrow.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="primary">
                  <Link href={marketingRoutes.shop}>
                    Explore Products
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={marketingRoutes.startSelling}>
                    <Store aria-hidden="true" />
                    Start Selling
                  </Link>
                </Button>
              </div>
            </Reveal>

            {/* Trust indicators — short, inline, under the fold line of the CTA. */}
            <Reveal delay={0.2}>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
                {[
                  { Icon: ShieldCheck, label: "Verified makers" },
                  { Icon: Truck, label: "Free delivery over ₹1,499" },
                ].map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 text-caption font-medium text-ink-soft"
                  >
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ------------------------------------------------------ Visual */}
          <Reveal delay={0.1} className="relative">
            <div className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-canvas-deep sm:aspect-16/11 lg:aspect-4/5">
                <Image
                  src="/images/hero/hero-still-life.jpg"
                  alt="Folded handloom cotton in indigo and cream with a terracotta bowl, brass cup and fresh tulsi on ivory linen"
                  fill
                  priority
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Overlapping detail frame — desktop only, decorative weight. */}
              <div
                className={cn(
                  "absolute -bottom-6 -left-6 hidden size-40 overflow-hidden rounded-lg",
                  "border-4 border-canvas shadow-lg lg:block xl:size-48",
                )}
              >
                <Image
                  src="/images/hero/hero-detail-cup.jpg"
                  alt="Hand-thrown stoneware cup with a matte sage glaze on sand-coloured linen"
                  fill
                  sizes="12rem"
                  className="object-cover"
                />
              </div>

              {/* Caption chip: names what the photograph is, which is also its value. */}
              <p
                className={cn(
                  "absolute bottom-4 left-4 hidden max-w-[15rem] rounded-md bg-canvas/92 px-3.5 py-2.5",
                  "text-caption text-ink-soft backdrop-blur-sm lg:block",
                )}
              >
                <span className="font-medium text-ink">Shot in the workshop</span>
                <br />
                Bhagalpur, Bihar · handloom cotton
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
