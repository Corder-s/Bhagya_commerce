import {
  ArrowRight,
  BadgeCheck,
  ChartLine,
  IndianRupee,
  Package,
  Palette,
  Sparkles,
  Store,
  Truck,
  UsersRound,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { merchantRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Start Selling",
  description:
    "Open your store on Bhagya Commerce. One account, transparent fees, shipping handled and a storefront built for independent Indian brands.",
  path: "/start-selling",
});

/**
 * Start Selling — the seller side of the storefront.
 *
 * Written for someone who makes things: what the platform does for them, in
 * plain language, in the order they would ask about it. No dashboard preview and
 * no revenue promises — the workspace itself is behind `/merchant`.
 */
const steps = [
  {
    Icon: BadgeCheck,
    title: "Use the account you have",
    body: "If you already shop on Bhagya, that account becomes your seller account. Nothing is duplicated and nothing is lost.",
  },
  {
    Icon: Store,
    title: "Set up your store",
    body: "Name, story, policies and payout details. A guided setup, about ten minutes end to end.",
  },
  {
    Icon: Package,
    title: "List your products",
    body: "Photographs, price, materials, care. Bhagya AI drafts the copy you would otherwise write at midnight.",
  },
  {
    Icon: Truck,
    title: "Ship and get paid",
    body: "Pickups, labels and tracking are part of the platform. Settlements are weekly and itemised.",
  },
] as const;

const tools = [
  {
    Icon: Palette,
    title: "A storefront of your own",
    body: "Your brand, your story and your collection — not a listing buried in a search result.",
  },
  {
    Icon: UsersRound,
    title: "Customers you keep",
    body: "The buyer relationship is yours. Your customer list leaves with you if you ever do.",
  },
  {
    Icon: ChartLine,
    title: "Numbers that mean something",
    body: "What sold, what returned, what to restock — reported in units and rupees, not vanity metrics.",
  },
  {
    Icon: Sparkles,
    title: "Bhagya AI in the workspace",
    body: "Listing copy, pricing guidance and campaign drafts from your own catalogue data.",
  },
  {
    Icon: IndianRupee,
    title: "Fees you can predict",
    body: "One commission, published before you list a single product. No listing fees, no surprises.",
  },
  {
    Icon: Package,
    title: "Inventory that behaves",
    body: "Stock alerts, made-to-order listings and a single place to see what is running out.",
  },
] as const;

/** Fee illustration — a worked example, labelled as an example. */
const feeRows = [
  { label: "Order value", value: "₹2,450", note: "What the customer pays" },
  { label: "Platform commission", value: "− ₹245", note: "Published rate: 10%" },
  { label: "Payment processing", value: "− ₹49", note: "UPI and card, at cost" },
  { label: "Your settlement", value: "₹2,156", note: "Paid the following Friday" },
] as const;

export default function StartSellingPage() {
  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <Section spacing="sm" surface="canvas" label="Sell on Bhagya Commerce">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <Badge tone="gold" size="lg">
                <Store className="size-3.5" aria-hidden="true" />
                For independent brands
              </Badge>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="font-display text-display-xl font-medium text-ink text-balance">
                Your products deserve their own home.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xl text-body-lg text-ink-soft">
                Build your brand, own your customer relationships and grow your
                business with Bhagya Commerce — on the same account you shop with.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" variant="primary">
                  <Link href={merchantRoutes.onboarding}>
                    Start Selling
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#pricing">See the fees</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-caption text-ink-soft">
                Onboarding opens the merchant workspace — a real shell today,
                connected to live store management in Phase 2.
              </p>
            </Reveal>
          </div>

          {/* Fee example — a worked sum, not a promise about your revenue. */}
          <Reveal delay={0.1}>
            <Card variant="surface" padding="lg" radius="xl" className="shadow-sm">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="label-text text-gold-deep">Worked example</p>
                  <Badge tone="outline" size="md">
                    Illustrative
                  </Badge>
                </div>

                <dl className="flex flex-col divide-y divide-line">
                  {feeRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 py-3"
                    >
                      <div className="flex flex-col">
                        <dt className="text-body-sm font-medium text-ink">
                          {row.label}
                        </dt>
                        <dd className="text-caption text-ink-soft">{row.note}</dd>
                      </div>
                      <dd className="text-body-md font-semibold tabular-nums text-ink">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="text-caption text-ink-faint">
                  A ₹2,450 order on the standard rate. Your actual settlement
                  depends on category, shipping and returns — all itemised before
                  you are paid.
                </p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Section>

      {/* -------------------------------------------------------- How it works */}
      <Section id="handbook" surface="ivory" label="How it works" className="scroll-mt-24">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, no surprises"
          description="From the account you already have to your first settled order."
        />

        <RevealGroup as="ol" className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ Icon, title, body }, index) => (
            <RevealItem key={title} as="li" className="flex flex-col gap-3 border-t border-line pt-5">
              <div className="flex items-center justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
                >
                  <Icon className="size-4.5" />
                </span>
                <span className="font-display text-heading-xl text-ink-faint tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-heading-md text-ink">{title}</h3>
              <p className="text-body-sm text-ink-soft">{body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      {/* ------------------------------------------------------------- Tools */}
      <Section surface="soft-green" label="Merchant tools">
        <SectionHeading
          eyebrow="Your workspace"
          title="Everything a small brand actually needs"
          description="Not a dashboard for its own sake — the five or six things you would check every morning."
        />

        <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ Icon, title, body }) => (
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
      </Section>

      {/* ----------------------------------------------------------- Pricing */}
      <Section id="pricing" surface="ivory" label="Pricing" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
          <SectionHeading
            variant="display"
            eyebrow="Pricing"
            title="One commission. Published."
            description="Bhagya earns when you sell. There is no listing fee, no subscription and no charge for the storefront, the workspace or the AI assist."
          />

          <div className="flex flex-col gap-5">
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {[
                { label: "Standard commission", value: "10%", note: "Of the product value, before tax" },
                { label: "Listing fee", value: "None", note: "Unlimited products, unlimited edits" },
                { label: "Settlement cycle", value: "Weekly", note: "Every Friday, itemised" },
                { label: "Payout hold", value: "7 days", note: "From delivery confirmation" },
              ].map((row) => (
                <li key={row.label} className="flex items-baseline justify-between gap-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-body-md font-medium text-ink">{row.label}</span>
                    <span className="text-caption text-ink-soft">{row.note}</span>
                  </div>
                  <span className="font-display text-heading-xl text-primary tabular-nums">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-caption text-ink-faint">
              Rates are set per category as the marketplace grows; the rate that
              applies to you is shown before you publish your first product.
            </p>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section surface="deep" label="Get started" spacing="md">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="font-display text-display-lg font-medium text-ink-inverse text-balance">
              Start with one product.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-lg text-body-lg text-ink-inverse-soft">
              Most brands on Bhagya began with a single listing and a photograph
              taken on a windowsill. You can refine everything later.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary" tone="inverse">
                <Link href={merchantRoutes.onboarding}>
                  Start Your Store
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" tone="inverse">
                <Link href={merchantRoutes.dashboard}>Tour the workspace</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="label-text text-ink-inverse-soft">{siteConfig.tagline}</p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
