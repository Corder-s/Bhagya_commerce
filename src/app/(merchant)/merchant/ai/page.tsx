import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantAiCopilotView } from "@/features/ai/components/merchant-ai-copilot-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant AI Copilot",
  description:
    "Analyze store sales, track low inventory, and draft listings with Bhagya AI Copilot.",
  path: "/merchant/ai",
  noIndex: true,
});

export default function MerchantAiPage() {
  return <MerchantAiCopilotView />;
}
