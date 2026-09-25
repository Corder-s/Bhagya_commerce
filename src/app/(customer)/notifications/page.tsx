import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";
import { NotificationCenter } from "@/features/notifications/components/notification-center";
import { AuthGuard } from "@/features/auth/auth-guard";

export const metadata: Metadata = constructMetadata({
  title: "Notifications",
  description: "Stay updated on your orders, deliveries, and Bhagya account alerts.",
  path: "/notifications",
  noIndex: true,
});

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <Container className="py-8 sm:py-10 lg:py-12">
        <PageHeader
          title="Notification Center"
          description="Track order updates, payment confirmations, and shipment arrivals in real-time."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Account", href: "/account" },
            { label: "Notifications" },
          ]}
        />

        <div className="mt-8">
          <NotificationCenter />
        </div>
      </Container>
    </AuthGuard>
  );
}
