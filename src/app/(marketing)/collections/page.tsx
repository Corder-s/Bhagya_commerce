import type { Metadata } from "next";

import { RouteShell } from "@/components/common/route-shell";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { collections } from "@/data/collections";

export const metadata: Metadata = constructMetadata({
  title: "Collections",
  description:
    "Curated edits from Bhagya Commerce — a material, a season, a craft cluster or a way of living, assembled by our curators and makers.",
  path: "/collections",
});

const coming = [
  "Collection pages with an editorial introduction and the maker interviews behind them",
  "Merchandised ordering, so a curator decides what the eye meets first",
  "Scheduled publishing for festive and seasonal edits",
  "Collection-level share cards, so an edit looks right when it is sent on WhatsApp",
  "Products that belong to more than one edit, without duplicating the catalogue",
] as const;

export default function CollectionsPage() {
  return (
    <RouteShell
      eyebrow="Curated"
      title="Collections"
      description="Fewer products, chosen for a reason — and the story of why they belong together."
      coming={coming}
      related={[
        {
          label: "Conscious Living",
          href: `${marketingRoutes.home}#featured-collection`,
          description: "The featured collection, on the homepage.",
        },
        {
          label: "Today's edit",
          href: `${marketingRoutes.home}#todays-edit`,
          description: "This week's three collections.",
        },
        {
          label: "The Journal",
          href: marketingRoutes.journal,
          description: "The writing that surrounds each edit.",
        },
      ]}
      highlight={
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="label-text mb-3 text-ink-faint">Planned collections</p>
          <ul className="flex flex-col gap-2.5">
            {collections.map((collection) => (
              <li key={collection.slug} className="text-body-sm text-ink-soft">
                <span className="font-medium text-ink">{collection.name}</span> —{" "}
                {collection.description}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
