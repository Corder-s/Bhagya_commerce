import * as React from "react";

import { RevealGroup, RevealItem } from "@/components/common/reveal";
import { SectionHeading } from "@/components/layout/section-heading";
import { JournalCard } from "@/features/journal/journal-card";
import { Section } from "@/components/ui/section";
import { marketingRoutes } from "@/config/routes";
import { journalPosts } from "@/data/journal";

/**
 * JournalSection — "From the Bhagya Journal".
 *
 * Three articles on a hairline grid. On phones they stack; the first article
 * gets no special treatment, because a lead story that is only a lead on large
 * screens is a wasted hierarchy.
 */
export function JournalSection() {
  return (
    <Section id="journal" surface="ivory" label="From the journal" className="scroll-mt-24">
      <SectionHeading
        eyebrow="Journal"
        title="From the Bhagya Journal"
        description="Long-form notes on craft, materials and living with fewer, better things."
        action={{ label: "Read the journal", href: marketingRoutes.journal }}
      />

      <RevealGroup
        as="ul"
        className="mt-9 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {journalPosts.map((post) => (
          <RevealItem key={post.slug} as="li">
            <JournalCard post={post} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
