import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { MediaTile } from "@/components/common/media-tile";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { featuredCollection } from "@/data/collections";

/**
 * FeaturedCollection — the editorial centrepiece.
 *
 * Asymmetric on purpose: a tall image occupying the left two-thirds, and a
 * narrow, vertically-centred copy column on the right. The heading is set in
 * the display serif at its largest size, which is where the brand's editorial
 * register is loudest; everything around it stays quiet.
 */
export function FeaturedCollection() {
  const collection = featuredCollection;

  return (
    <Section
      id="featured-collection"
      surface="canvas"
      label="Featured collection"
      className="scroll-mt-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        {/* Image — slightly taller than the copy column, by design. */}
        <Reveal className="relative">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-canvas-deep sm:aspect-16/10 lg:aspect-4/5">
            {collection.image ? (
              <Image
                src={collection.image.src}
                alt={collection.image.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            ) : (
              <MediaTile label={collection.name} tone={collection.tone} />
            )}
          </div>
        </Reveal>

        {/* Copy */}
        <div className="flex flex-col gap-5 lg:max-w-md">
          <Reveal>
            <p className="label-text text-gold-deep">Featured Collection</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-display-lg font-medium text-ink text-balance">
              {collection.name}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-body-lg text-ink-soft">{collection.description}</p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="grid grid-cols-3 gap-4 border-y border-line py-5">
              {[
                { label: "Pieces", value: "24" },
                { label: "Makers", value: "9" },
                { label: "Crafts", value: "5" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <dt className="label-text text-ink-faint">{stat.label}</dt>
                  <dd className="font-display text-heading-xl text-primary tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="primary">
                <Link href={marketingRoutes.collections}>
                  Explore Collection
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Link
                href={marketingRoutes.shop}
                className="text-body-sm font-medium text-ink-soft underline-offset-4 hover:text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Shop all products
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
