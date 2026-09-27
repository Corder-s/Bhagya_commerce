import { Sparkles, Store } from "lucide-react";
import type { Metadata } from "next";

import { AuthGuard } from "@/features/auth/auth-guard";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";
import { MerchantOnboardingWizard } from "@/features/merchant/components/merchant-onboarding-wizard";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Onboarding",
  description: "Set up your independent artisan store on Bhagya Commerce.",
  path: "/merchant/onboarding",
  noIndex: true,
});

export default function MerchantOnboardingPage() {
  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          eyebrow="Merchant Onboarding"
          title="Open your store on Bhagya"
          description="Build your store identity, configure your brand craft category, and begin selling to conscious customers nationwide."
          actions={
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF6ED] dark:bg-[#33241C] text-[#D48024] dark:text-[#F0A349] text-xs font-semibold border border-[#E89535]/30 shadow-xs">
              <Sparkles className="size-4 text-[#E89535]" />
              <span>Artisan Onboarding</span>
            </div>
          }
        />

        <MerchantOnboardingWizard />
      </div>
    </AuthGuard>
  );
}
