import type { Metadata } from "next";

import { PreferencesForm } from "@/features/customer/preferences-form";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Preferences",
  description: "Notification, language and interest preferences for your Bhagya account.",
  path: "/account/preferences",
  noIndex: true,
});

export default function PreferencesPage() {
  return (
    <>
      <PageHeader
        title="Preferences"
        description="How Bhagya talks to you, and what it shows you first."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Preferences" },
        ]}
      />
      <div className="mt-8">
        <PreferencesForm />
      </div>
    </>
  );
}
