import type { Metadata } from "next";

import { AiPreview } from "@/features/home/ai-preview";
import { BrandRail } from "@/features/home/brand-rail";
import { CategoryRail } from "@/features/home/category-rail";
import { EditorialImpact } from "@/features/home/editorial-impact";
import { FeaturedCollection } from "@/features/home/featured-collection";
import { FinalCTA } from "@/features/home/final-cta";
import { Hero } from "@/features/home/hero";
import { JournalSection } from "@/features/home/journal-section";
import { MerchantCTA } from "@/features/home/merchant-cta";
import { TodaysEdit } from "@/features/home/todays-edit";
import { TrendingProducts } from "@/features/home/trending-products";
import { TrustStrip } from "@/features/home/trust-strip";
import { constructMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: "/",
});

/**
 * Home — the Bhagya Commerce storefront.
 *
 * Composition, in reading order: an editorial hero, the promise strip, the
 * category taxonomy, the featured collection, the merchandised product grid,
 * a second lighter edit, the makers, the AI preview, the sustainability story,
 * the journal, the seller invitation and the close.
 *
 * Every section is its own component under `@/features/home`, and the only
 * stateful ones are the product tabs (client) and the header/footer shells.
 * Nothing on this page is a fragment of another screen: it is a page.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryRail />
      <FeaturedCollection />
      <TrendingProducts />
      <TodaysEdit />
      <BrandRail />
      <AiPreview />
      <EditorialImpact />
      <JournalSection />
      <MerchantCTA />
      <FinalCTA />
    </>
  );
}
