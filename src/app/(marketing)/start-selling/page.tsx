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
import { StartSellingHeroAction } from "@/features/merchant/components/start-selling-hero-action";

export const metadata: Metadata = constructMetadata({
  title: "Start Selling on Bhagya Commerce",
  description:
    "Open your store on Bhagya Commerce. Build your store, reach customers and grow your brand on the same account you shop with.",
  path: "/start-selling",
});

/**
 * Start Selling — the seller side of the storefront.
 *
 * Written for someone who makes things: what the platform does for them, in
 * plain language, in the order they would ask about it.
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
    body: "Name, URL, craft story, and brand identity. A guided 5-step setup taking less than 5 minutes.",
  },
  {
    Icon: Package,
    title: "List your handcrafted items",
    body: "Photographs, pricing, materials, and care instructions. Direct listing into curated discovery categories.",
  },
  {
    Icon: Truck,
    title: "Ship and get paid",
    body: "Pickups, shipping labels, and live tracking are part of the platform. Weekly itemised bank settlements.",
  },
] as const;

const tools = [
  {
    Icon: Palette,
    title: "A storefront of your own",
    body: "Your brand, your story and your collection at bhagya.in/store/your-brand — not a listing buried in ads.",
  },
  {
    Icon: UsersRound,
    title: "Customers you keep",
    body: "The buyer relationship is yours. Your customer list and followers belong to your independent store.",
  },
  {
    Icon: ChartLine,
    title: "Transparent numbers",
    body: "What sold, what shipped, and what settled — reported in units and rupees, with zero vanity metrics.",
  },
  {
    Icon: Sparkles,
    title: "Bhagya AI assistant",
    body: "Listing copy suggestions, pricing guidance, and craft story descriptions from your catalogue data.",
  },
  {
    Icon: IndianRupee,
    title: "Fees you can predict",
    body: "One published commission rate. No hidden listing fees, no subscription costs, no surprises.",
  },
  {
    Icon: Package,
    title: "Simple inventory control",
    body: "Stock alerts, made-to-order listings, and a single place to see what is running low.",
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
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Reveal>
              <Badge tone="gold" size="lg">
                <Store className="size-3.5" aria-hidden="true" />
                For Independent Indian Brands & Master Artisans
              </Badge>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="font-display text-display-xl font-medium text-ink text-balance">
                Start selling on Bhagya.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-xl text-body-lg text-ink-soft">
                Build your store, reach customers and grow your brand. Join India's premier conscious marketplace on the same account you shop with.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <StartSellingHeroAction />
            </Reveal>
          </div>

          {/* Fee example — a worked sum, not a promise about your revenue. */}
          <Reveal delay={0.1}>
            <Card variant="surface" padding="lg" radius="xl" className="shadow-sm border-line">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="label-text text-[#9A6A20] dark:text-[#C49A45]">Worked example</p>
                  <Badge tone="outline" size="md">
                    Transparent Pricing
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
                  className="grid size-10 place-items-center rounded-xl bg-[#F3E6C8] text-[#9A6A20]"
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
      <Section surface="ivory" label="Merchant tools">
        <SectionHeading
          eyebrow="Your workspace"
          title="Everything a small brand actually needs"
          description="Not a bloated corporate portal — the five or six essential tools you would check every morning."
        />

        <RevealGroup as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ Icon, title, body }) => (
            <RevealItem key={title} as="li">
              <Card variant="surface" padding="md" radius="lg" className="h-full border-line">
                <CardContent className="flex flex-col gap-2.5">
                  <span
                    aria-hidden="true"
                    className="grid size-10 place-items-center rounded-xl bg-[#F3E6C8] text-[#9A6A20]"
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
            description="Bhagya earns only when you sell. There is no listing fee, no monthly subscription, and no charges for the storefront or AI assist."
          />

          <div className="flex flex-col gap-5">
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {[
                { label: "Standard commission", value: "10%", note: "Of the product value, before tax" },
                { label: "Listing fee", value: "None", note: "Unlimited products, unlimited edits" },
                { label: "Settlement cycle", value: "Weekly", note: "Every Friday, direct to bank" },
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
              Rates are clearly displayed for each craft category before you publish your first product.
            </p>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------------- CTA */}
      <Section surface="deep" label="Get started" spacing="md">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Reveal>
            <h2 className="font-display text-display-lg font-medium text-ink-inverse text-balance">
              Start with one product today.
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-lg text-body-lg text-ink-inverse-soft">
              Most brands on Bhagya began with a single listing and a craft legacy. Set up your store in 5 minutes.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary" tone="inverse">
                <Link href={merchantRoutes.onboarding}>
                  Start Selling
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" tone="inverse">
                <Link href={"/shop" as any}>Browse Marketplace</Link>
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
