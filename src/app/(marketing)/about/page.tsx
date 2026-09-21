import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "About",
  description:
    "Why Bhagya Commerce exists: one identity for customers and sellers, verified makers and a marketplace built to last.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Container className="py-8 sm:py-10 lg:py-12">
        <PageHeader
          variant="display"
          eyebrow="About"
          title="A marketplace built around two relationships"
          description="The person who buys and the person who makes. Bhagya exists to make both relationships longer, fairer and more interesting."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        />
      </Container>

      <Section surface="ivory" spacing="sm" aria-label="Principles">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "One identity, no forks",
              body: "A customer must never be pushed into becoming a merchant. Selling is an option on the same account, available whenever it is wanted.",
            },
            {
              title: "Verification before reach",
              body: "Brands are vetted for materials, claims and working conditions before they reach the catalogue.",
            },
            {
              title: "Small catalogues, chosen well",
              body: "We would rather curate 400 products that hold up than list 40,000 that do not.",
            },
          ].map((principle) => (
            <article
              key={principle.title}
              className="flex flex-col gap-2.5 border-t border-line pt-5"
            >
              <h2 className="text-heading-md text-ink">{principle.title}</h2>
              <p className="text-body-sm text-ink-soft">{principle.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Container className="py-10">
        <FeaturePlaceholder
          eyebrow="Editorial page"
          summary="The full about experience — founding story, team, careers and press."
          upcoming={[
            "Founding narrative with imagery and maker portraits",
            "Team and advisor profiles",
            "Careers section with open roles",
            "Press kit and brand assets for media",
          ]}
          dependencies={["CMS", "Media library"]}
        />
      </Container>
    </>
  );
}
