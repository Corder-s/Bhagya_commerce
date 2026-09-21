import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { BhagyaGlyph } from "@/components/common/brand-mark";
import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { aiCapabilities, aiConversation, aiRecommendationSlugs, aiStarterPrompts } from "@/data/ai";
import { getProductsBySlugs } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * AiPreview — "Meet your personal shopping companion".
 *
 * A preview, and honest about it: the transcript is a copy deck in
 * `@/data/ai`, the recommendations are demo products, and the section is
 * labelled "Preview" in the UI rather than in a footnote. The conversation
 * chrome is real markup (a labelled log, speaker names for assistive tech,
 * product cards that are genuinely links) so the interaction pattern can be
 * reviewed now and wired to the assistant service later.
 */
export function AiPreview() {
  const recommendations = getProductsBySlugs(aiRecommendationSlugs);

  return (
    <Section id="bhagya-ai" surface="deep" label="Bhagya AI" className="scroll-mt-24 bg-gradient-deep-brand">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-center lg:gap-16">
        {/* Copy column — measure capped so the standfirst stays readable. */}
        <div className="flex max-w-md flex-col items-start gap-5">
          <Reveal>
            <Badge tone="gold" size="lg">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Bhagya AI · Preview
            </Badge>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-display-lg font-medium text-ink-inverse text-balance">
              Meet your personal shopping companion.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-md text-body-lg text-ink-inverse-soft">
              Describe what you need in your own words and Bhagya AI works through
              the catalogue with you — ingredients, craft, budget and all.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="flex flex-col gap-2.5" step={0.05}>
            {aiCapabilities.map((capability) => (
              <RevealItem
                key={capability}
                as="li"
                className="flex items-start gap-2.5 text-body-sm text-ink-inverse-soft"
              >
                <BhagyaGlyph className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                {capability}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.25}>
            <Button asChild size="lg" variant="secondary" tone="inverse" className="mt-1">
              <Link href={marketingRoutes.shop}>
                Ask Bhagya AI
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>

          <p className="text-caption text-ink-inverse-soft/80">
            Not live yet — the assistant arrives with the Phase 2 catalogue. This
            is the interface it will speak through.
          </p>
        </div>

        {/* Conversation preview */}
        <Reveal delay={0.1}>
          <div className="rounded-xl border border-line-inverse bg-deep-soft p-4 sm:p-6">
            <div className="flex items-center gap-3 border-b border-line-inverse pb-4">
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-pill bg-emerald-500/20 text-emerald-300"
              >
                <BhagyaGlyph className="size-5" />
              </span>
              <div className="flex flex-col">
                <p className="text-body-sm font-semibold text-ink-inverse">Bhagya AI</p>
                <p className="text-caption text-ink-inverse-soft">
                  Shopping assistant · demo transcript
                </p>
              </div>
            </div>

            {/* A real log: speakers are named, not implied by bubble colour. */}
            <ol aria-label="Example conversation with Bhagya AI" className="flex flex-col gap-4 py-5">
              {aiConversation.map((turn) => {
                const isCustomer = turn.role === "customer";
                return (
                  <li
                    key={turn.id}
                    className={cn("flex flex-col gap-1.5", isCustomer ? "items-end" : "items-start")}
                  >
                    <span className="label-text text-ink-inverse-soft/70">
                      {isCustomer ? "Customer" : "Bhagya AI"}
                    </span>
                    <p
                      className={cn(
                        "max-w-[92%] rounded-lg px-4 py-3 text-body-sm",
                        isCustomer
                          ? "rounded-br-sm bg-canvas/10 text-ink-inverse"
                          : "rounded-bl-sm bg-botanical/20 text-ink-inverse",
                      )}
                    >
                      {turn.text}
                    </p>
                  </li>
                );
              })}

              {/* Recommendations ride inside the assistant's reply. */}
              <li className="flex flex-col gap-2">
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {recommendations.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={marketingRoutes.shop}
                        className="flex items-center gap-3 rounded-lg border border-line-inverse bg-canvas/[0.04] p-2.5 transition-colors duration-fast hover:bg-canvas/10 focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-deep">
                          {product.image ? (
                            <Image
                              src={product.image.src}
                              alt={product.image.alt}
                              fill
                              sizes="3.5rem"
                              className="object-cover"
                            />
                          ) : null}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          {/* Wraps rather than truncates: at 320px a clipped
                              product name is worse than a two-line one. */}
                          <span className="text-caption font-medium text-ink-inverse">
                            {product.name}
                          </span>
                          <span className="text-caption text-ink-inverse-soft">
                            {product.brand.name} · {formatPrice(product.priceInr)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ol>

            {/* Starter prompts — shown as text, not as buttons that do nothing. */}
            <div className="border-t border-line-inverse pt-4">
              <p className="label-text mb-2.5 text-ink-inverse-soft/70">Try asking</p>
              <ul className="flex flex-wrap gap-2">
                {aiStarterPrompts.map((prompt) => (
                  <li
                    key={prompt}
                    className="rounded-pill border border-line-inverse px-3 py-1.5 text-caption text-ink-inverse-soft"
                  >
                    “{prompt}”
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
