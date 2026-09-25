"use client";

import { CheckCircle, Mail, Phone, ShieldCheck, User } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AccountSummary } from "@/features/customer/account-summary";
import { useAuth } from "@/hooks/use-auth";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="Your account"
        description="Everything you have saved with Bhagya, in one unified place."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]}
      />

      <div className="mt-8 flex flex-col gap-6">
        {/* Profile Card */}
        {user ? (
          <Card variant="surface" padding="md" radius="lg" className="border-line shadow-xs">
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid size-14 place-items-center rounded-pill bg-gold-soft text-gold-dark dark:text-gold font-display text-heading-lg font-semibold border border-gold/20">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="size-6" />}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-heading-md font-semibold text-ink">{user.name}</h2>
                    <Badge tone="primary" size="sm">
                      {user.role === "merchant" || user.organizationMembership ? "Customer & Artisan" : "Customer"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="size-3.5 text-ink-faint" />
                      {user.email}
                      {user.emailVerified ? (
                        <span title="Verified email" className="inline-flex items-center">
                          <CheckCircle className="size-3 text-success" />
                        </span>
                      ) : null}
                    </span>
                    {user.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3.5 text-ink-faint" />
                        {user.phone}
                        {user.phoneVerified ? (
                          <span title="Verified phone" className="inline-flex items-center">
                            <CheckCircle className="size-3 text-success" />
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {user.organizationMembership ? (
                <div className="rounded-md border border-line bg-surface-raised px-3.5 py-2 text-caption text-ink-soft">
                  <span className="font-medium text-ink">Store:</span> {user.organizationMembership.storeName || user.organizationMembership.organizationName}
                  <span className="ml-2 text-gold-dark dark:text-gold font-medium capitalize">({user.organizationMembership.role})</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <AccountSummary />

        {/* Security & Identity Notice */}
        <Card variant="surface" padding="md" radius="lg">
          <CardContent className="flex items-start gap-3.5 text-body-sm text-ink-soft">
            <ShieldCheck className="mt-0.5 size-5 text-gold-dark dark:text-gold shrink-0" aria-hidden="true" />
            <div>
              <h3 className="text-heading-sm font-semibold text-ink">One Unified Bhagya Identity</h3>
              <p className="mt-1 text-caption text-ink-soft leading-relaxed">
                Your account holds your customer orders, wishlist items, saved delivery addresses, and organization memberships seamlessly. One login gives you access to everything on Bhagya Commerce.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
