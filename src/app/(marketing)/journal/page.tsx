import type { Metadata } from "next";

import { RouteShell } from "@/components/common/route-shell";
import { JournalCard } from "@/features/journal/journal-card";
import { marketingRoutes } from "@/config/routes";
import { constructMetadata } from "@/config/seo";
import { journalPosts } from "@/data/journal";

export const metadata: Metadata = constructMetadata({
  title: "Journal",
  description:
    "Long-form notes on craft, materials, Ayurveda and conscious living from the makers and curators of Bhagya Commerce.",
  path: "/journal",
});

const coming = [
  "An article index with category filters and reading time",
  "A reading experience built for the editorial serif: pull quotes, galleries and product embeds",
  "Author pages for makers and curators",
  "Article-level metadata, share cards and an RSS feed",
  "Related reading, drawn from the same categories a product belongs to",
] as const;

export default function JournalPage() {
  return (
    <RouteShell
      eyebrow="Journal"
      title="Journal"
      description="Unhurried writing on how things are actually made — and what it takes for that making to last."
      coming={coming}
      related={[
        {
          label: "Latest from the Journal",
          href: `${marketingRoutes.home}#journal`,
          description: "Three pieces, on the homepage today.",
        },
        {
          label: "Our commitments",
          href: `${marketingRoutes.home}#impact`,
          description: "What we will and will not claim.",
        },
        {
          label: "Meet the makers",
          href: marketingRoutes.brands,
          description: "The brands the writing is about.",
        },
      ]}
      highlight={
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="label-text mb-4 text-ink-faint">Demo articles</p>
          <ul className="grid gap-6">
            {journalPosts.map((post) => (
              <li key={post.slug}>
                <JournalCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
}
