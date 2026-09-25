import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { CheckoutView } from "@/features/checkout/checkout-view";

export const metadata: Metadata = constructMetadata({
  title: "Checkout",
  description: "Complete your Bhagya Commerce order — contact, address, delivery and payment.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return <CheckoutView />;
}
