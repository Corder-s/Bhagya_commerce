import { ArrowRight, BookOpen, LayoutDashboard, Store } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { merchantRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Merchant",
  description: "The Bhagya Commerce selling workspace.",
  path: "/merchant",
  noIndex: true,
});

/**
 * Merchant entry point.
 *
 * Sits in the workspace shell so the transition from "I want to sell" to "I am
 * operating a store" happens in one frame. Two doors only: start onboarding, or
 * look at the dashboard — a third option would just be noise.
 */
export default function MerchantEntryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Selling on Bhagya Commerce"
        description="One account, one workspace. Your store is added to the same identity you shop with — nothing to migrate, nothing to duplicate."
        actions={
          <Badge tone="outline" size="lg">
            Store not live yet
          </Badge>
        }
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card variant="botanical" padding="lg" radius="lg">
          <CardContent className="flex flex-col gap-4">
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-md bg-surface text-primary"
            >
              <Store className="size-5" />
            </span>
            <h2 className="text-heading-lg text-ink">Set up your store</h2>
            <p className="text-body-sm text-ink-soft">
              Six guided steps: identity, story, policies, payouts, shipping and
              your first product. Roughly ten minutes. KYC and payouts are
              implemented in Phase 3.
            </p>
            <ul className="flex flex-col gap-2 text-caption text-ink-soft">
              <li>· Business or individual seller</li>
              <li>· Bank account and settlement cycle</li>
              <li>· Pickup address and packaging defaults</li>
            </ul>
            <Button asChild variant="primary" size="lg" className="mt-1 w-fit">
              <Link href={merchantRoutes.onboarding}>
                Start onboarding
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card variant="surface" padding="lg" radius="lg">
          <CardContent className="flex flex-col gap-4">
            <span
              aria-hidden="true"
              className="grid size-11 place-items-center rounded-md bg-soft-green text-primary"
            >
              <LayoutDashboard className="size-5" />
            </span>
            <h2 className="text-heading-lg text-ink">Preview the workspace</h2>
            <p className="text-body-sm text-ink-soft">
              Look around the dashboard, catalogue, orders, inventory and analytics
              screens. Each shows the real component system with its data states,
              and states plainly what is not yet connected.
            </p>
            <Button asChild variant="outline" size="lg" className="mt-1 w-fit">
              <Link href={merchantRoutes.dashboard}>
                Open dashboard
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Link
              href="/start-selling"
              className="inline-flex w-fit items-center gap-2 text-body-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <BookOpen className="size-4" aria-hidden="true" />
              Read what sellers get
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
