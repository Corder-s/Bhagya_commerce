import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Help Centre",
  description:
    "Shipping, returns, payments, privacy and terms — answers for customers and sellers on Bhagya Commerce.",
  path: "/help",
});

/** Anchor targets referenced by the footer legal links. */
const sections = [
  { id: "shipping", title: "Shipping & delivery" },
  { id: "returns", title: "Returns & refunds" },
  { id: "privacy", title: "Privacy" },
  { id: "terms", title: "Terms of use" },
] as const;

export default function HelpPage() {
  return (
    <Container width="narrow" className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        eyebrow="Support"
        title="Help Centre"
        description="Short, plain answers. If something here is unclear, that is our bug — tell us."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help" }]}
      />

      <nav aria-label="Help topics" className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex min-h-12 items-center justify-between gap-4 rounded-md border border-line bg-surface px-4 text-body-sm font-medium text-ink transition-colors duration-fast hover:border-[#C49A45]/40 hover:bg-[#FAF5EA] hover:text-[#9A6A20] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                {section.title}
                <span aria-hidden="true" className="text-ink-faint">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="mt-10 scroll-mt-28 border-t border-line pt-6"
        >
          <h2 id={`${section.id}-heading`} className="text-heading-lg text-ink">
            {section.title}
          </h2>
          <p className="mt-2 text-body-sm text-ink-soft">
            Published policies arrive with the Phase 3 content service. Structure,
            anchor links and typography are finalised.
          </p>
        </section>
      ))}

      <div className="mt-12">
        <FeaturePlaceholder
          eyebrow="Knowledge base"
          summary="A searchable help centre with per-topic content and a support escalation path."
          upcoming={[
            "Searchable articles with topic taxonomy",
            "Order-aware help (answers change with order status)",
            "Support ticket handoff with context pre-filled",
          ]}
          dependencies={["CMS", "Order service", "Support desk integration"]}
        />
      </div>
    </Container>
  );
}
