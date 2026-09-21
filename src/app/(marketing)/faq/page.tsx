import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about buying and selling on Bhagya Commerce.",
  path: "/faq",
});

const faqs = [
  {
    question: "Do I need a separate account to sell on Bhagya?",
    answer:
      "No. Bhagya has one user identity. You shop as a customer, and if you choose to sell, a store is added to that same account — your orders, addresses and wishlist stay where they are.",
  },
  {
    question: "Am I forced to become a seller?",
    answer:
      "Never. Selling is optional and always initiated by you, from the account menu or the Start Selling page. There is no prompt, upsell or interruption in the buying flow.",
  },
  {
    question: "How are brands verified?",
    answer:
      "Every brand submits material sourcing details, workshop information and claims before their products reach the catalogue. Verification is a gate, not a badge applied after listing.",
  },
  {
    question: "When do real payments go live?",
    answer:
      "Phase 1 — this build — is the foundation: design system, layout, routes and shell. Payments, OTP, tracking and inventory are scheduled for Phase 3 and are deliberately not faked here.",
  },
] as const;

/**
 * FAQ — implemented with native `<details>` so it is keyboard accessible and
 * finds work without JavaScript, rather than shipping another interactive widget.
 */
export default function FaqPage() {
  return (
    <Container width="narrow" className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered plainly"
        description="If your question is not here yet, the help centre and support team are one click away."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <div className="mt-8 flex flex-col divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-2">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-2 text-body-md font-medium text-ink transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-pill border border-line text-ink-soft transition-transform duration-base ease-brand group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-prose pb-4 pr-10 text-body-sm text-ink-soft">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Container>
  );
}
