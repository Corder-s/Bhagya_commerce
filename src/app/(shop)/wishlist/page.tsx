import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { constructMetadata } from "@/config/seo";
import { WishlistView } from "@/features/wishlist/wishlist-view";

export const metadata: Metadata = constructMetadata({
  title: "Saved Items — Wishlist",
  description: "Things worth keeping. View and manage your saved Bhagya Commerce products.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <div className="min-h-[70vh] bg-canvas">
      <Container>
        <WishlistView />
      </Container>
    </div>
  );
}
