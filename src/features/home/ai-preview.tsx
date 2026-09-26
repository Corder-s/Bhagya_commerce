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
 * Deep sage canvas in light mode, charcoal in dark mode, with warm yellow accents.
 */
export function AiPreview() {
  const recommendations = getProductsBySlugs(aiRecommendationSlugs);

  return (
    <Section
      id="bhagya-ai"
      surface="deep"
      label="Bhagya AI"
      className="scroll-mt-24 relative overflow-hidden bg-[#566B60] dark:bg-[#1D211E] text-[#F5F1E7]"
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-[#D7A63A]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full bg-[#708477]/15 blur-3xl"
      />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:items-center lg:gap-16">
        {/* Copy column */}
        <div className="flex max-w-md flex-col items-start gap-5">
          <Reveal>
            <Badge tone="accent" size="lg">
              <Sparkles className="size-3.5 text-[#D7A63A]" aria-hidden="true" />
              Bhagya AI · Preview
            </Badge>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-display-lg font-medium text-[#F5F1E7] text-balance">
              Meet your personal shopping companion.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-md text-body-lg text-[#D8D2C6]">
              Describe what you need in your own words and Bhagya AI works through
              the catalogue with you — ingredients, craft, budget and all.
            </p>
          </Reveal>

          <RevealGroup as="ul" className="flex flex-col gap-2.5" step={0.05}>
            {aiCapabilities.map((capability) => (
              <RevealItem
                key={capability}
                as="li"
                className="flex items-start gap-2.5 text-body-sm text-[#D8D2C6]"
              >
                <BhagyaGlyph className="mt-0.5 size-4 shrink-0 text-[#D7A63A]" />
                {capability}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.25}>
            <Button asChild size="lg" variant="accent" className="mt-1">
              <Link href={marketingRoutes.shop}>
                Ask Bhagya AI
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>

          <p className="text-caption text-[#B3ADA2]">
            Not live yet — the assistant arrives with the Phase 2 catalogue. This
            is the interface it will speak through.
          </p>
        </div>

        {/* Conversation preview */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-[#4B514B] bg-[#30332F] p-5 sm:p-7 shadow-2xl shadow-black/30 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-[#4B514B] pb-4">
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-pill bg-[#D7A63A]/20 text-[#D7A63A] border border-[#D7A63A]/40"
              >
                <BhagyaGlyph className="size-5" />
              </span>
              <div className="flex flex-col">
                <p className="text-body-sm font-semibold text-[#F5F1E7]">Bhagya AI</p>
                <p className="text-caption text-[#B3ADA2]">
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
                    <span className="label-text text-[#B3ADA2] text-[10px] tracking-wider uppercase font-semibold">
                      {isCustomer ? "Customer" : "Bhagya AI"}
                    </span>
                    <p
                      className={cn(
                        "max-w-[92%] rounded-xl px-4 py-3 text-body-sm leading-relaxed",
                        isCustomer
                          ? "rounded-br-xs bg-[#373B36] text-[#F5F1E7] border border-[#D7A63A]/40"
                          : "rounded-bl-xs bg-[#252925] text-[#F5F1E7] border border-[#4B514B]",
                      )}
                    >
                      {turn.text}
                    </p>
                  </li>
                );
              })}

              {/* Recommendations ride inside the assistant's reply. */}
              <li className="flex flex-col gap-2 pt-1">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recommendations.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={marketingRoutes.shop}
                        className="flex items-center gap-3 rounded-xl border border-[#4B514B] bg-[#252925] p-3 transition-all duration-fast hover:border-[#D7A63A]/60 hover:bg-[#373B36] focus-visible:outline-2 focus-visible:outline-offset-2 group"
                      >
                        <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#30332F] border border-[#4B514B]">
                          {product.image ? (
                            <Image
                              src={product.image.src}
                              alt={product.image.alt}
                              fill
                              sizes="3.5rem"
                              className="object-cover group-hover:scale-105 transition-transform duration-base"
                            />
                          ) : null}
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="text-caption font-semibold text-[#F5F1E7] group-hover:text-[#D7A63A] transition-colors line-clamp-1">
                            {product.name}
                          </span>
                          <span className="text-caption text-[#B3ADA2] mt-0.5">
                            {product.brand.name} · <strong className="text-[#D7A63A] font-semibold">{formatPrice(product.priceInr)}</strong>
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ol>

            {/* Starter prompts */}
            <div className="border-t border-[#4B514B] pt-4">
              <p className="label-text mb-2.5 text-[#B3ADA2] text-[10px] tracking-wider uppercase font-semibold">Try asking</p>
              <ul className="flex flex-wrap gap-2">
                {aiStarterPrompts.map((prompt) => (
                  <li
                    key={prompt}
                    className="rounded-full border border-[#4B514B] bg-[#252925] hover:border-[#D7A63A]/50 px-3.5 py-1.5 text-caption text-[#D8D2C6] transition-colors cursor-pointer"
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
