import { ArrowRight, ChartLine, IndianRupee, Palette, Truck } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";

/**
 * MerchantCTA — "Your products deserve their own home."
 *
 * The merchant side is introduced as an opportunity, never as a forced flow:
 * four concrete reasons to sell, then one primary action and one explanatory
 * link. No dashboard preview, no invented revenue figures — the workspace lives
 * behind `/merchant`, not on the storefront.
 */
const reasons = [
  {
    Icon: Palette,
    title: "Your own storefront",
    body: "Your name, your story, your policies, presented the way you would present them.",
  },
  {
    Icon: IndianRupee,
    title: "Transparent fees",
    body: "One commission, published up front. No listing charges and no surprises.",
  },
  {
    Icon: Truck,
    title: "Shipping handled",
    body: "Pickups, labels and tracking are part of the platform, not a separate vendor.",
  },
  {
    Icon: ChartLine,
    title: "Your own customers",
    body: "You keep the relationship — the buyer list stays yours.",
  },
] as const;

export function MerchantCTA() {
  return (
    <Section surface="soft-green" label="Sell on Bhagya Commerce">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-5">
          <Reveal>
            <p className="label-text text-gold-deep">For businesses</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-display-lg font-medium text-ink text-balance">
              Your products deserve their own home.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-lg text-body-lg text-ink-soft">
              Build your brand, own your customer relationships and grow your
              business with Bhagya Commerce.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" variant="primary">
                <Link href={marketingRoutes.startSelling}>
                  Start Selling
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href={marketingRoutes.startSelling}>Learn More</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-caption text-ink-soft">
              Already shop on Bhagya? Your existing account becomes your seller
              account — nothing duplicates.
            </p>
          </Reveal>
        </div>

        <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
          {reasons.map(({ Icon, title, body }) => (
            <RevealItem key={title} as="li">
              <Card variant="surface" padding="md" radius="lg" className="h-full">
                <CardContent className="flex flex-col gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <h3 className="text-heading-md text-ink">{title}</h3>
                  <p className="text-body-sm text-ink-soft">{body}</p>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
