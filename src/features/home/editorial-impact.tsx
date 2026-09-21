import { HandHeart, Leaf, Recycle, Sprout } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

/**
 * EditorialImpact — "Small choices. Meaningful impact."
 *
 * Storytelling, not reporting: four commitments written as plain language with
 * no numbers attached, because a marketplace in its first version has no
 * verified impact data and inventing some would be the cheapest possible claim.
 * The photograph carries the emotional weight; the type stays factual.
 */
const commitments = [
  {
    Icon: Leaf,
    title: "Thoughtful products",
    body: "Listings open with ingredients, materials and where they came from — before the price.",
  },
  {
    Icon: HandHeart,
    title: "Independent businesses",
    body: "Every brand on Bhagya owns its customer relationship, its pricing and its story.",
  },
  {
    Icon: Recycle,
    title: "Responsible choices",
    body: "Lower-waste packaging options and consolidated shipping, chosen at checkout.",
  },
  {
    Icon: Sprout,
    title: "Community growth",
    body: "Craft clusters keep the margin, the skills and the next generation of makers.",
  },
] as const;

export function EditorialImpact() {
  return (
    <Section id="impact" surface="ivory" label="Our commitments" className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Photograph — square, full-bleed within its column. */}
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-canvas-deep">
            <Image
              src="/images/sustainability/growing-together.jpg"
              alt="Two cupped hands holding dark soil with a young green seedling, with jute and clay in the background"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Reveal>
            <h2 className="font-display text-display-lg font-medium text-ink text-balance">
              Small choices.
              <br />
              Meaningful impact.
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="max-w-lg text-body-lg text-ink-soft">
              Sustainable commerce is a set of decisions made one order at a time —
              by the people who make things, and by the people who choose them.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="flex flex-col divide-y divide-line border-y border-line">
            {commitments.map(({ Icon, title, body }) => (
              <RevealItem
                key={title}
                as="li"
                className={cn("flex items-start gap-4 py-5")}
              >
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-md bg-soft-green text-primary"
                >
                  <Icon className="size-4.5" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-heading-md text-ink">{title}</h3>
                  <p className="text-body-sm text-ink-soft">{body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
