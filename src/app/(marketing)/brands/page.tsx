import type { Metadata } from "next";

import { RouteShell } from "@/components/common/route-shell";
import { BrandCard } from "@/features/brands/brand-card";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { brands } from "@/data/brands";

export const metadata: Metadata = constructMetadata({
  title: "Brands",
  description:
    "Meet the independent Indian makers, studios and collectives building their stores on Bhagya Commerce.",
  path: "/brands",
});

const coming = [
  "A directory of every brand, searchable by craft and region",
  "A public store page per brand with its own metadata and share card",
  "The maker's story: materials, workshop, process and the people behind it",
  "Follow a brand so its new listings appear in your account",
  "Verification detail, published by the merchant service rather than claimed here",
] as const;

export default function BrandsPage() {
  return (
    <RouteShell
      eyebrow="Independent makers"
      title="Brands"
      description="Small studios, family workshops and farmer collectives — the people whose products fill the shop."
      coming={coming}
      related={[
        {
          label: "Featured makers on the homepage",
          href: `${marketingRoutes.home}#brands`,
          description: "Six makers worth a look right now.",
        },
        {
          label: "Shop by category",
          href: marketingRoutes.shop,
          description: "Find products first, then meet who made them.",
        },
        {
          label: "Sell on Bhagya",
          href: marketingRoutes.startSelling,
          description: "Bring your own brand to the marketplace.",
        },
      ]}
      highlight={
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="label-text mb-3 text-ink-faint">
            Demo makers · placeholder data
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {brands.slice(0, 2).map((brand) => (
              <li key={brand.slug}>
                <BrandCard brand={brand} className="h-full" />
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
