import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { ShopContainer } from "@/features/shop/shop-container";

export const metadata: Metadata = constructMetadata({
  title: "Shop",
  description:
    "Browse organic food, Ayurveda, personal care, home and living, wellness, eco-friendly, spiritual and handmade products from independent Indian brands.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* ── Shop Hero ────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-canvas-deep">
        <div className="mx-auto max-w-screen-xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="mb-3 text-caption font-medium uppercase tracking-widest text-primary">
            Bhagya Shop
          </p>
          <h1 className="text-display-sm font-bold text-ink sm:text-display-md">
            Discover something better.
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-ink-soft">
            Thoughtfully curated products from independent Indian makers — organic, handmade, and honest about their origins.
          </p>

          {/* ── Trust bar ──────────────────────────────────────────────── */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: "16+ products", sub: "and growing" },
              { label: "8 categories", sub: "from food to craft" },
              { label: "100% Indian", sub: "independent makers" },
              { label: "Verified origins", sub: "honest sourcing" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                <div>
                  <span className="text-body-sm font-semibold text-ink">{item.label}</span>
                  <span className="ml-1.5 text-body-sm text-ink-faint">{item.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Catalogue ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <ShopContainer />
      </section>
    </div>
  );
}
