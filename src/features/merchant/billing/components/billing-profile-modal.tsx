"use client";

import { Building, Check, Loader2, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import type { BillingProfile } from "@/features/merchant/billing/billing-types";
import { toast } from "@/lib/toast";
import { billingService } from "@/services/billing.service";

export interface BillingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BillingProfile;
  onProfileUpdated: (updated: BillingProfile) => void;
}

export function BillingProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: BillingProfileModalProps) {
  const [formData, setFormData] = React.useState<BillingProfile>(profile);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await billingService.updateBillingProfile(formData);
      onProfileUpdated(updated);
      toast.success("Billing Profile Saved", "Your organization tax and invoicing details have been updated.");
      onClose();
    } catch {
      toast.error("Save Failed", "Could not save billing profile changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <Building className="size-5 text-primary" />
            <h3 className="text-body-lg font-bold text-ink">Edit Billing Profile</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-soft hover:text-ink hover:bg-surface-raised transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
              Legal Business Entity Name
            </label>
            <input
              type="text"
              required
              value={formData.legalBusinessName}
              onChange={(e) => setFormData({ ...formData, legalBusinessName: e.target.value })}
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-body-sm font-semibold text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
                GSTIN
              </label>
              <input
                type="text"
                value={formData.gstin || ""}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                placeholder="e.g. 33AABCT9981F1Z8"
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-body-sm font-mono text-ink uppercase focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
                Billing Phone
              </label>
              <input
                type="tel"
                value={formData.billingPhone || ""}
                onChange={(e) => setFormData({ ...formData, billingPhone: e.target.value })}
                className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-body-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
              Billing Email Address
            </label>
            <input
              type="email"
              required
              value={formData.billingEmail}
              onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-body-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
              Registered Address Line 1
            </label>
            <input
              type="text"
              required
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-body-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
                State
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-caption font-bold text-ink-soft uppercase mb-1">
                PIN Code
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-body-sm text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-line flex justify-end gap-3">
            <Button type="button" variant="outline" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
              <span>{saving ? "Saving…" : "Save Profile"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
