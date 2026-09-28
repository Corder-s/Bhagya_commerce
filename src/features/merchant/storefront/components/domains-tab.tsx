"use client";

import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Loader2,
  Lock,
  Plus,
  RotateCw,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import type {
  DomainStatus,
  DomainVerificationResult,
  StoreDomain,
} from "@/services/storefront.service";

interface DomainsTabProps {
  domains: StoreDomain[];
  onAddDomain: (domain: string) => Promise<void>;
  onVerifyDomain: (id: string) => Promise<DomainVerificationResult>;
  onActivateDomain: (id: string) => Promise<void>;
  onSetPrimaryDomain: (id: string) => Promise<void>;
  onDisableDomain: (id: string) => Promise<void>;
  onDeleteDomain: (id: string) => Promise<void>;
}

export function DomainsTab({
  domains,
  onAddDomain,
  onVerifyDomain,
  onActivateDomain,
  onSetPrimaryDomain,
  onDisableDomain,
  onDeleteDomain,
}: DomainsTabProps) {
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [newDomain, setNewDomain] = React.useState("");
  const [activeVerification, setActiveVerification] = React.useState<DomainVerificationResult | null>(null);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newDomain.trim()) return;
    setActionLoading("add");
    try {
      await onAddDomain(newDomain.trim());
      setNewDomain("");
      setIsAddOpen(false);
      toast.success("Domain Added", "Please add the DNS TXT record to start verification.");
    } catch (err: any) {
      toast.error("Registration Failed", err.message || "Could not add custom domain.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleVerify(id: string) {
    setActionLoading(id);
    try {
      const res = await onVerifyDomain(id);
      setActiveVerification(res);
      toast.success("DNS Verified", res.message);
    } catch (err: any) {
      toast.error("Verification Failed", err.message || "DNS record check failed.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleActivate(id: string) {
    setActionLoading(id);
    try {
      await onActivateDomain(id);
      toast.success("Domain Activated", "Traffic is now routed to your verified domain.");
    } catch (err: any) {
      toast.error("Activation Failed", err.message || "Could not activate domain.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSetPrimary(id: string) {
    setActionLoading(id);
    try {
      await onSetPrimaryDomain(id);
      toast.success("Primary Domain Set", "Canonical URLs and SEO tags now point to this domain.");
    } catch (err: any) {
      toast.error("Update Failed", err.message || "Could not set primary domain.");
    } finally {
      setActionLoading(null);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard", text);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">Custom Storefront Domains</h2>
          <p className="text-body-sm text-ink-soft">
            Connect your own branded domain (e.g. yourstore.com) with automated Cloudflare Edge SSL.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
        >
          <Plus className="size-4" />
          <span>Add Custom Domain</span>
        </Button>
      </div>

      {/* ── Domains List ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        {domains.map((d) => (
          <Card
            key={d.id}
            variant="surface"
            padding="md"
            radius="lg"
            className="border-line flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface shadow-xs"
          >
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <Globe className="size-4 text-primary shrink-0" />
                <span className="font-mono text-body font-bold text-ink">{d.domain}</span>
                {d.isPrimary && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-primary/10 px-2.5 py-0.5 text-caption font-bold text-primary">
                    <Star className="size-3 fill-primary" />
                    Primary Domain
                  </span>
                )}
                <span
                  className={`rounded-pill px-2.5 py-0.5 text-caption font-bold uppercase tracking-wider ${
                    d.status === "ACTIVE"
                      ? "bg-success/15 text-success"
                      : d.status === "VERIFIED"
                      ? "bg-primary/15 text-primary"
                      : d.status === "PENDING"
                      ? "bg-warning/15 text-warning"
                      : "bg-surface-muted text-ink-muted"
                  }`}
                >
                  {d.status}
                </span>
                <span className="inline-flex items-center gap-1 text-caption text-ink-muted">
                  <Lock className="size-3 text-success" />
                  SSL: {d.sslStatus || "ACTIVE"}
                </span>
              </div>

              {d.verificationToken && d.status === "PENDING" && (
                <div className="pt-2">
                  <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 text-caption space-y-1 max-w-xl">
                    <div className="flex items-center gap-1.5 font-bold text-warning">
                      <AlertCircle className="size-3.5" />
                      <span>DNS TXT Record Required</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-ink-soft bg-surface p-2 rounded-lg border border-line">
                      <span>_bhagya-challenge.{d.domain}</span>
                      <button
                        type="button"
                        onClick={() => copyText(`_bhagya-challenge.${d.domain}`)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between font-mono text-ink-soft bg-surface p-2 rounded-lg border border-line">
                      <span className="truncate mr-2">{d.verificationToken}</span>
                      <button
                        type="button"
                        onClick={() => copyText(d.verificationToken || "")}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {d.status === "PENDING" && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoading === d.id}
                  onClick={() => handleVerify(d.id)}
                  className="gap-1.5 border-line"
                >
                  {actionLoading === d.id ? <Loader2 className="size-3.5 animate-spin" /> : <RotateCw className="size-3.5" />}
                  <span>Verify DNS</span>
                </Button>
              )}

              {d.status === "VERIFIED" && (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={actionLoading === d.id}
                  onClick={() => handleActivate(d.id)}
                  className="gap-1.5 bg-success text-white hover:bg-success/90"
                >
                  <CheckCircle2 className="size-3.5" />
                  <span>Activate</span>
                </Button>
              )}

              {d.status === "ACTIVE" && !d.isPrimary && (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={actionLoading === d.id}
                  onClick={() => handleSetPrimary(d.id)}
                  className="gap-1.5 border-line hover:border-primary"
                >
                  <Star className="size-3.5 text-warning" />
                  <span>Make Primary</span>
                </Button>
              )}

              {d.type === "CUSTOM_DOMAIN" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteDomain(d.id)}
                  className="size-8 p-0 text-danger hover:bg-danger/10"
                  title="Remove Domain"
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Add Domain Modal ──────────────────────────────────────────── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Add Custom Domain</h3>
                <p className="text-body-sm text-ink-soft">Enter your apex domain or subdomain</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddOpen(false)}
                className="size-8 p-0 text-ink-soft hover:text-ink"
              >
                <X className="size-4" />
              </Button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-caption font-bold uppercase tracking-wider text-ink">Domain Name</label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="e.g. silks.varanasiheritage.in"
                  required
                  className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-body text-ink focus:border-primary focus:outline-hidden"
                />
                <p className="text-caption text-ink-muted">
                  Do not include https:// or trailing slashes. Subdomains and root domains are supported.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-line">
                <Button variant="outline" type="button" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={actionLoading === "add"}
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {actionLoading === "add" ? "Registering..." : "Add Domain"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
