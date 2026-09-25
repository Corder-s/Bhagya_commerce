import { Bell, Building2, Landmark, Users } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Switch } from "@/components/ui/switch";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Settings",
  description: "Account, team and settlement settings for your Bhagya Commerce store.",
  path: "/merchant/settings",
  noIndex: true,
});

const groups = [
  {
    Icon: Building2,
    title: "Business details",
    body: "Legal entity, GSTIN, registered address and documents.",
  },
  {
    Icon: Landmark,
    title: "Payouts",
    body: "Bank account, settlement cycle and payout history. Requires the payments provider (Phase 3).",
  },
  {
    Icon: Users,
    title: "Team access",
    body: "Invite staff with role-based permissions — owner, manager, packer.",
  },
] as const;

export default function MerchantSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Everything that applies to the whole store rather than a single product."
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {groups.map((group) => (
          <Card key={group.title} variant="surface" padding="md" radius="lg">
            <CardContent className="flex gap-4">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F3E6C8] text-[#9A6A20]"
              >
                <group.Icon className="size-4" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-heading-md text-ink">{group.title}</h2>
                <p className="text-body-sm text-ink-soft">{group.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card variant="surface" padding="md" radius="lg">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-xl bg-[#F3E6C8] text-[#9A6A20]"
              >
                <Bell className="size-4" />
              </span>
              <h2 className="text-heading-md text-ink">Notifications</h2>
            </div>

            <div className="flex items-start justify-between gap-6">
              <label htmlFor="notify-new-order" className="flex flex-col gap-1">
                <span className="text-body-sm font-medium text-ink">
                  New order alerts
                </span>
                <span className="text-caption text-ink-soft">
                  Email and dashboard alert the moment an order lands.
                </span>
              </label>
              <Switch id="notify-new-order" defaultChecked />
            </div>

            <div className="flex items-start justify-between gap-6">
              <label htmlFor="notify-low-stock" className="flex flex-col gap-1">
                <span className="text-body-sm font-medium text-ink">
                  Low stock alerts
                </span>
                <span className="text-caption text-ink-soft">
                  Depends on the inventory service — Phase 3.
                </span>
              </label>
              <Switch id="notify-low-stock" disabled />
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <FeaturePlaceholder
            eyebrow="Route shell"
            summary="Store-wide settings with audit trails and role-based access."
            upcoming={[
              "Business profile and document management",
              "Payout accounts with verification status",
              "Team invitations with scoped permissions",
              "API keys and webhooks for external systems",
            ]}
            dependencies={["Organisation service", "Payments/KYC", "Auth (roles)", "Audit log"]}
          />
        </div>
      </div>
    </>
  );
}
