import type { Metadata } from "next";

import { AiAssistPanel } from "@/features/ai/ai-assist-panel";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Bhagya AI",
  description:
    "Draft listings, pricing and campaigns with Bhagya AI — always reviewed by you before publishing.",
  path: "/merchant/ai",
  noIndex: true,
});

export default function MerchantAiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Assistive"
        title="Bhagya AI"
        description="Drafting help for listings, pricing and campaigns. Suggestions you edit and approve — never automatic publishing."
      />
      <div className="mt-8">
        <AiAssistPanel />
      </div>
    </>
  );
}
