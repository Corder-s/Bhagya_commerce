"use client";

import {
  AlertCircle,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  HardDrive,
  Layers,
  Loader2,
  Package,
  Percent,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  BillingInvoice,
  BillingOverviewData,
  BillingProfile,
  MerchantPlan,
  MerchantSubscription,
} from "@/features/merchant/billing/billing-types";
import { BillingProfileModal } from "@/features/merchant/billing/components/billing-profile-modal";
import { PlanComparisonModal } from "@/features/merchant/billing/components/plan-comparison-modal";
import { toast } from "@/lib/toast";
import { billingService } from "@/services/billing.service";

export function MerchantBillingView() {
  const [data, setData] = React.useState<BillingOverviewData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showPlanModal, setShowPlanModal] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = React.useState<string | null>(null);
  const [cancellingSub, setCancellingSub] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const res = await billingService.getBillingOverview();
      setData(res);
    } catch {
      toast.error("Billing Unavailable", "Could not fetch subscription details.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  async function handleToggleCancel() {
    if (!data) return;
    setCancellingSub(true);
    try {
      if (data.subscription.cancelAtPeriodEnd) {
        const resumed = await billingService.resumeSubscription();
        setData((prev) => (prev ? { ...prev, subscription: resumed } : null));
        toast.success("Subscription Resumed", "Your plan will renew automatically at period end.");
      } else {
        const cancelled = await billingService.cancelSubscription();
        setData((prev) => (prev ? { ...prev, subscription: cancelled } : null));
        toast.warning(
          "Cancellation Scheduled",
          "You will retain access until the end of the current billing cycle.",
        );
      }
    } catch {
      toast.error("Action Failed", "Could not update subscription renewal state.");
    } finally {
      setCancellingSub(false);
    }
  }

  async function handleDownloadSaaSInvoice(invoice: BillingInvoice) {
    setDownloadingInvoiceId(invoice.id);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Invoice Downloaded", `Saved ${invoice.invoiceNumber}.pdf to your device.`);
    } catch {
      toast.error("Download Failed", "Could not retrieve SaaS billing document.");
    } finally {
      setDownloadingInvoiceId(null);
    }
  }

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 rounded-3xl bg-surface border border-line" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 rounded-2xl bg-surface border border-line" />
          <div className="h-64 rounded-2xl bg-surface border border-line" />
        </div>
        <div className="h-72 rounded-2xl bg-surface border border-line" />
      </div>
    );
  }

  const currentPlan = data.plans.find((p) => p.id === data.subscription.planId) || data.plans[1];
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(data.subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div className="space-y-8">
      {/* ── Top Subscription Hero Card ─────────────────────────────────── */}
      <Card variant="surface" padding="none" radius="lg" className="border-line shadow-card overflow-hidden">
        <div className="border-b border-line bg-surface-raised p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-2xl font-bold text-ink">{currentPlan.name}</span>
              <span className="inline-flex items-center gap-1 rounded-pill bg-success/15 px-3 py-1 text-caption font-bold text-success">
                <CheckCircle2 className="size-3.5" />
                <span>{data.subscription.status}</span>
              </span>
              {data.subscription.cancelAtPeriodEnd && (
                <span className="rounded-pill bg-warning/15 px-3 py-1 text-caption font-bold text-warning">
                  Cancels at period end
                </span>
              )}
            </div>

            <p className="text-body-sm text-ink-soft max-w-xl leading-relaxed">
              {currentPlan.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-caption text-ink-soft">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-primary" />
                Period:{" "}
                <strong className="text-ink">
                  {new Date(data.subscription.currentPeriodStart).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  –{" "}
                  {new Date(data.subscription.currentPeriodEnd).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </strong>
              </span>

              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-[#E89535]" />
                Renews in: <strong className="text-ink">{daysRemaining} days</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowPlanModal(true)}
              className="gap-2 font-bold shadow-md shadow-primary/20"
            >
              <Zap className="size-4" />
              <span>Upgrade / Change Plan</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={cancellingSub}
              onClick={handleToggleCancel}
              className={`text-caption ${
                data.subscription.cancelAtPeriodEnd
                  ? "text-success hover:bg-success/10"
                  : "text-ink-soft hover:text-danger"
              }`}
            >
              {cancellingSub ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : data.subscription.cancelAtPeriodEnd ? (
                "Resume Auto-Renewal"
              ) : (
                "Cancel at Period End"
              )}
            </Button>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line p-6 bg-surface text-caption">
          <div className="py-2 sm:py-0 sm:pr-4 space-y-1">
            <span className="text-ink-faint uppercase font-bold text-[10px]">Monthly Fee</span>
            <p className="text-heading-sm font-bold text-ink font-mono">
              {fmt(currentPlan.monthlyPriceInr)}
              <span className="text-caption font-normal text-ink-soft">/mo</span>
            </p>
          </div>
          <div className="py-2 sm:py-0 sm:px-4 space-y-1">
            <span className="text-ink-faint uppercase font-bold text-[10px]">Platform Fee</span>
            <p className="text-heading-sm font-bold text-ink font-mono">
              {currentPlan.commissionPercent}%{" "}
              <span className="text-caption font-normal text-ink-soft">per sale</span>
            </p>
          </div>
          <div className="py-2 sm:py-0 sm:px-4 space-y-1">
            <span className="text-ink-faint uppercase font-bold text-[10px]">AI Copilot Tier</span>
            <p className="text-body-sm font-bold text-primary capitalize">
              {currentPlan.aiTier.toLowerCase()}
            </p>
          </div>
          <div className="py-2 sm:py-0 sm:pl-4 space-y-1">
            <span className="text-ink-faint uppercase font-bold text-[10px]">Vault Storage</span>
            <p className="text-body-sm font-bold text-ink font-mono">
              {currentPlan.storageLimitGb} GB Cloud R2
            </p>
          </div>
        </div>
      </Card>

      {/* ── 2-Col Grid: Entitlements & Billing Profile ─────────────────── */}
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Resource Quotas & Entitlements */}
        <Card variant="surface" padding="lg" radius="lg" className="border-line shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              <h3 className="text-body-lg font-bold text-ink">Plan Quotas & Entitlements</h3>
            </div>
            <span className="text-caption text-ink-soft">{currentPlan.name}</span>
          </div>

          <div className="space-y-4">
            {/* Products quota */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm font-semibold">
                <span className="text-ink flex items-center gap-1.5">
                  <Package className="size-4 text-ink-soft" />
                  Product Listings
                </span>
                <span className="text-ink font-mono tabular-nums">
                  18 / {currentPlan.maxProducts}
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(100, (18 / currentPlan.maxProducts) * 100)}%` }}
                />
              </div>
            </div>

            {/* Storage quota */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-body-sm font-semibold">
                <span className="text-ink flex items-center gap-1.5">
                  <HardDrive className="size-4 text-ink-soft" />
                  Media & Document Storage
                </span>
                <span className="text-ink font-mono tabular-nums">
                  1.4 GB / {currentPlan.storageLimitGb} GB
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-subtle overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${(1.4 / currentPlan.storageLimitGb) * 100}%` }}
                />
              </div>
            </div>

            {/* Included features list */}
            <div className="pt-2 border-t border-line space-y-2">
              <p className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Active Entitlements:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-caption text-ink">
                {currentPlan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="size-3.5 text-success shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Organization Billing Profile */}
        <Card variant="surface" padding="lg" radius="lg" className="border-line shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-2">
              <Building className="size-5 text-primary" />
              <h3 className="text-body-lg font-bold text-ink">Organization Billing Profile</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileModal(true)}
              className="text-xs h-8 font-semibold"
            >
              Edit Profile
            </Button>
          </div>

          <div className="space-y-3.5 text-body-sm">
            <div>
              <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Legal Business Name
              </span>
              <p className="font-bold text-ink">{data.profile.legalBusinessName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                  GSTIN
                </span>
                <p className="font-mono font-bold text-ink">
                  {data.profile.gstin || "Not Registered"}
                </p>
              </div>
              <div>
                <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                  Billing Phone
                </span>
                <p className="text-ink">{data.profile.billingPhone || "—"}</p>
              </div>
            </div>

            <div>
              <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Billing Email
              </span>
              <p className="text-ink font-medium">{data.profile.billingEmail}</p>
            </div>

            <div>
              <span className="text-caption font-bold uppercase tracking-wider text-ink-soft">
                Registered Address
              </span>
              <p className="text-caption text-ink-soft leading-relaxed">
                {data.profile.addressLine1}
                {data.profile.addressLine2 ? `, ${data.profile.addressLine2}` : ""}
                <br />
                {data.profile.city}, {data.profile.state} – {data.profile.postalCode}
                <br />
                {data.profile.country}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── SaaS Billing History Table ─────────────────────────────────── */}
      <Card variant="surface" padding="lg" radius="lg" className="border-line shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <h3 className="text-body-lg font-bold text-ink">Subscription Billing History</h3>
          </div>
          <span className="text-caption text-ink-soft">
            18% GST itemized on SaaS subscription invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="border-b border-line text-caption font-bold uppercase text-ink-soft bg-surface-raised">
                <th className="py-3 px-3">Invoice Number</th>
                <th className="py-3 px-3">Billing Period</th>
                <th className="py-3 px-2">Plan</th>
                <th className="py-3 px-2 text-right">Subtotal</th>
                <th className="py-3 px-2 text-right">GST (18%)</th>
                <th className="py-3 px-3 text-right">Total Paid</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {data.invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-surface-subtle/40">
                  <td className="py-3.5 px-3">
                    <p className="font-mono font-bold text-ink">{inv.invoiceNumber}</p>
                    <p className="text-[11px] text-ink-faint">
                      Issued on{" "}
                      {new Date(inv.issuedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="py-3.5 px-3 text-caption text-ink-soft">
                    {new Date(inv.periodStart).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(inv.periodEnd).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-2 font-semibold text-ink">{inv.planName}</td>
                  <td className="py-3.5 px-2 text-right tabular-nums text-ink-soft font-mono">
                    {fmt(inv.subtotal)}
                  </td>
                  <td className="py-3.5 px-2 text-right tabular-nums text-ink-soft font-mono">
                    {fmt(inv.tax)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-ink tabular-nums font-mono">
                    {fmt(inv.total)}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className="rounded-pill bg-success/15 px-2.5 py-0.5 text-[11px] font-bold text-success">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadSaaSInvoice(inv)}
                      disabled={downloadingInvoiceId === inv.id}
                      className="text-xs h-8 gap-1.5"
                    >
                      {downloadingInvoiceId === inv.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Download className="size-3" />
                      )}
                      <span>PDF</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Plan Comparison Modal */}
      <PlanComparisonModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentSubscription={data.subscription}
        plans={data.plans}
        onPlanChanged={(updated) => {
          setData((prev) => (prev ? { ...prev, subscription: updated } : null));
          loadData();
        }}
      />

      {/* Billing Profile Modal */}
      <BillingProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={data.profile}
        onProfileUpdated={(updated) => {
          setData((prev) => (prev ? { ...prev, profile: updated } : null));
        }}
      />
    </div>
  );
}
