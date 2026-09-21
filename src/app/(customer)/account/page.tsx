import type { Metadata } from "next";

import { AccountSummary } from "@/features/customer/account-summary";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Your account",
  description: "Orders, wishlist, addresses and preferences.",
  path: "/account",
  noIndex: true,
});

export default function AccountPage() {
  return (
    <>
      <PageHeader
        title="Your account"
        description="Everything you have saved with Bhagya, in one place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />

      <div className="mt-8 flex flex-col gap-6">
        <AccountSummary />

        <Card variant="surface" padding="md" radius="lg">
          <CardContent className="flex flex-col gap-2">
            <h2 className="text-heading-md text-ink">Profile</h2>
            <p className="max-w-xl text-body-sm text-ink-soft">
              Your name, email, phone and default delivery address live here once
              accounts exist. Sessions, profile editing and verification are Phase
              2 work — this panel is the placeholder for that form.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
