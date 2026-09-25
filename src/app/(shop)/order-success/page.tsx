import { Suspense } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { constructMetadata } from "@/config/seo";
import { OrderSuccessView } from "@/features/orders/components/order-success-view";

export const metadata: Metadata = constructMetadata({
  title: "Order Confirmed",
  description: "Your Bhagya Commerce order is confirmed.",
  path: "/order-success",
  noIndex: true,
});

export default function OrderSuccessPage() {
  return (
    <Container className="py-8 sm:py-12 lg:py-14">
      <Suspense
        fallback={
          <div className="py-20 text-center">
            <div className="size-12 rounded-full border-2 border-[#C49A45] border-t-transparent animate-spin mx-auto" />
            <p className="text-[#5E5A52] text-sm mt-4">Loading your confirmation…</p>
          </div>
        }
      >
        <OrderSuccessView />
      </Suspense>
    </Container>
  );
}
