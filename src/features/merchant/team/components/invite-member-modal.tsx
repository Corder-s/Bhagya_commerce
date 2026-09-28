"use client";

import { AlertCircle, Check, Loader2, Mail, ShieldCheck, Store, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import {
  ROLE_DEFINITIONS,
  type RoleCode,
  type StoreAccessType,
  type StoreSummary,
  type TeamInvitation,
  teamService,
} from "@/services/team.service";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (invitation: TeamInvitation) => void;
  stores: StoreSummary[];
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onSuccess,
  stores,
}: InviteMemberModalProps) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<RoleCode>("MANAGER");
  const [storeAccessType, setStoreAccessType] = React.useState<StoreAccessType>("ALL_STORES");
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setEmail("");
      setRole("MANAGER");
      setStoreAccessType("ALL_STORES");
      setSelectedStoreIds(stores.slice(0, 1).map((s) => s.id));
      setError(null);
    }
  }, [isOpen, stores]);

  if (!isOpen) return null;

  const currentRoleDef = ROLE_DEFINITIONS.find((r) => r.code === role);

  const toggleStore = (storeId: string) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !emailNorm.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (storeAccessType === "SPECIFIC_STORES" && selectedStoreIds.length === 0) {
      setError("Please select at least one store for store-scoped access.");
      return;
    }

    setSubmitting(true);
    try {
      const invite = await teamService.inviteMember({
        email: emailNorm,
        role,
        storeAccessType,
        storeIds: selectedStoreIds,
      });

      toast.success(
        "Invitation Dispatched",
        `Secure invitation sent to ${emailNorm} with role: ${currentRoleDef?.displayName}.`
      );
      onSuccess(invite);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send invitation";
      setError(msg);
      toast.error("Invitation Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900 md:p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400">
              <Mail className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Invite Team Member
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Send a secure single-use invitation link with granular store permissions
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-200 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Artisan / Team Member Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya.sharma@artisanstudio.in"
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
            />
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              If the recipient already has a Bhagya account, their existing identity will be linked without duplicating accounts.
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Assigned Organization Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as RoleCode)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              {ROLE_DEFINITIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.displayName} ({r.code})
                </option>
              ))}
            </select>

            {currentRoleDef && (
              <div className="mt-2 rounded-xl bg-amber-500/5 p-3 border border-amber-500/15 text-xs text-stone-700 dark:text-stone-300">
                <div className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="size-3.5" />
                  {currentRoleDef.displayName}
                </div>
                <p>{currentRoleDef.description}</p>
                <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="font-medium text-stone-700 dark:text-stone-300">Permissions granted ({currentRoleDef.permissions.length}):</span>{" "}
                  {currentRoleDef.permissions.slice(0, 5).join(", ")}
                  {currentRoleDef.permissions.length > 5 && ` and ${currentRoleDef.permissions.length - 5} more...`}
                </div>
              </div>
            )}
          </div>

          {/* Store Access Scoping */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
              Store Access Scope *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                  storeAccessType === "ALL_STORES"
                    ? "border-amber-500 bg-amber-500/5 text-amber-900 dark:text-amber-200"
                    : "border-stone-200 bg-white hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-800/80"
                }`}
              >
                <input
                  type="radio"
                  name="storeAccessType"
                  value="ALL_STORES"
                  checked={storeAccessType === "ALL_STORES"}
                  onChange={() => setStoreAccessType("ALL_STORES")}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-semibold">All Stores</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Access to primary store and all current & future sub-stores
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                  storeAccessType === "SPECIFIC_STORES"
                    ? "border-amber-500 bg-amber-500/5 text-amber-900 dark:text-amber-200"
                    : "border-stone-200 bg-white hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-800/80"
                }`}
              >
                <input
                  type="radio"
                  name="storeAccessType"
                  value="SPECIFIC_STORES"
                  checked={storeAccessType === "SPECIFIC_STORES"}
                  onChange={() => setStoreAccessType("SPECIFIC_STORES")}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-semibold">Specific Stores</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Restrict operations to selected craft store locations
                  </div>
                </div>
              </label>
            </div>

            {/* Store Checklist if specific */}
            {storeAccessType === "SPECIFIC_STORES" && (
              <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800 space-y-2">
                <div className="text-xs font-medium text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                  <Store className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Select stores to grant access:
                </div>
                {stores.map((s) => {
                  const isChecked = selectedStoreIds.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className="flex items-center gap-2.5 text-xs text-stone-800 dark:text-stone-200 cursor-pointer p-1.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700/50"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleStore(s.id)}
                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="font-medium">{s.name}</span>
                      {s.isPrimary && (
                        <span className="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          Primary
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating Invite...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
