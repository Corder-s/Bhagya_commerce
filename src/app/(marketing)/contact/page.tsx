import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

import { FeaturePlaceholder } from "@/components/common/feature-placeholder";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { constructMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = constructMetadata({
  title: "Contact",
  description:
    "Reach the Bhagya Commerce team for customer support, seller onboarding or partnership enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container width="narrow" className="py-8 sm:py-10 lg:py-12">
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        description="Real people, Indian working hours. Most enquiries are answered the same day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card variant="surface" padding="md">
          <CardContent className="flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
            >
              <Mail className="size-4" />
            </span>
            <h2 className="mt-1 text-heading-md text-ink">Email</h2>
            <a
              href={`mailto:${siteConfig.support.email}`}
              className="text-body-sm text-primary underline-offset-4 hover:underline"
            >
              {siteConfig.support.email}
            </a>
            <p className="text-caption text-ink-soft">Replies within one working day</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="md">
          <CardContent className="flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
            >
              <Phone className="size-4" />
            </span>
            <h2 className="mt-1 text-heading-md text-ink">Phone</h2>
            <a
              href={`tel:${siteConfig.support.phone.replace(/\s/g, "")}`}
              className="text-body-sm text-primary underline-offset-4 hover:underline"
            >
              {siteConfig.support.phone}
            </a>
            <p className="text-caption text-ink-soft">{siteConfig.support.hours}</p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="md">
          <CardContent className="flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
            >
              <MessageCircle className="size-4" />
            </span>
            <h2 className="mt-1 text-heading-md text-ink">WhatsApp</h2>
            <p className="text-body-sm text-ink-soft">
              Order updates on WhatsApp — available in Phase 3 with the
              notifications service.
            </p>
          </CardContent>
        </Card>

        <Card variant="surface" padding="md">
          <CardContent className="flex flex-col gap-1.5">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-md bg-soft-green text-primary"
            >
              <MapPin className="size-4" />
            </span>
            <h2 className="mt-1 text-heading-md text-ink">Address</h2>
            <p className="text-body-sm text-ink-soft">{siteConfig.support.address}</p>
            <p className="text-caption text-ink-soft">Registered office</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <FeaturePlaceholder
          eyebrow="Route shell"
          summary="A contact form that routes enquiries to the right team."
          upcoming={[
            "Contact form with topic routing (order, seller, press, partnership)",
            "Order-number lookup to speed up support",
            "Spam protection and submission receipts",
          ]}
          dependencies={["Notifications service", "Support inbox"]}
        />
      </div>
    </Container>
  );
}
