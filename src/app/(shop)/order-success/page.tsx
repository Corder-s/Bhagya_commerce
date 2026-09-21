import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SuccessState } from "@/components/ui/success-state";
import { commerceRoutes, marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Order confirmed",
  description: "Your Bhagya Commerce order is confirmed.",
  path: "/order-success",
  noIndex: true,
});

/**
 * Order confirmation.
 *
 * The success component and its detail rows are real; the order they would
 * describe does not exist yet, so the copy says exactly that instead of printing
 * a fabricated order number and delivery date. Returns a `noindex` too — an
 * empty confirmation page should never be indexed.
 *
 * Phase 3: read `?order=` (or the order id from the redirect) and hydrate this
 * with real reference, amount and ETA rows.
 */
export default function OrderSuccessPage() {
  return (
    <Container width="narrow" className="py-10 sm:py-14">
      <SuccessState
        size="lg"
        titleAs="h1"
        title="Payment flow is not live yet"
        description="This is where a confirmed order lands: reference number, delivery estimate and the maker's note. Payments arrive in Phase 3, so there is no order to show just yet."
        details={[
          { label: "Order reference", value: "—" },
          { label: "Amount paid", value: "—" },
          { label: "Estimated delivery", value: "—" },
        ]}
        actions={
          <>
            <Button asChild variant="primary" size="lg">
              <Link href={marketingRoutes.shop}>Continue shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={commerceRoutes.orders}>View your orders</Link>
            </Button>
          </>
        }
      />

      <p className="mt-8 text-center text-caption text-ink-soft">
        Placed an order and something looks wrong?{" "}
        <Link
          href={marketingRoutes.help}
          className="text-primary underline-offset-4 hover:underline"
        >
          Contact the support team
        </Link>
        .
      </p>
    </Container>
  );
}
