import type { Metadata } from "next";

import { constructMetadata } from "@/config/seo";
import { MerchantSettingsView } from "@/features/merchant/settings/merchant-settings-view";

export const metadata: Metadata = constructMetadata({
  title: "Merchant Settings & Control Center",
  description:
    "Manage store operations, notification channels, security policies, team permissions and settlement accounts.",
  path: "/merchant/settings",
  noIndex: true,
});

export default function MerchantSettingsPage() {
  return <MerchantSettingsView />;
}
