import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { constructMetadata } from "@/config/seo";
import { CartView } from "@/features/cart/cart-view";

export const metadata: Metadata = constructMetadata({
  title: "Shopping Bag",
  description: "Review and complete your Bhagya Commerce artisan order.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="min-h-[70vh] bg-canvas">
      <Container>
        <CartView />
      </Container>
    </div>
  );
}
