"use client";

import { AlertTriangle, Check, Loader2, Lock, Shield, Store, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import {
  ROLE_DEFINITIONS,
  type MemberStatus,
  type RoleCode,
  type StoreAccessType,
  type StoreSummary,
  type TeamMember,
  teamService,
} from "@/services/team.service";

interface EditMemberModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: TeamMember) => void;
  stores: StoreSummary[];
}

export function EditMemberModal({
  member,
  isOpen,
  onClose,
  onSuccess,
  stores,
}: EditMemberModalProps) {
  const [role, setRole] = React.useState<RoleCode>("MANAGER");
  const [storeAccessType, setStoreAccessType] = React.useState<StoreAccessType>("ALL_STORES");
  const [selectedStoreIds, setSelectedStoreIds] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<MemberStatus>("ACTIVE");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (member && isOpen) {
      setRole(member.role);
      setStoreAccessType(member.storeAccessType);
      setSelectedStoreIds(member.accessibleStoreIds || []);
      setStatus(member.status);
      setError(null);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const isSoleOwner = member.isSoleOwner;
  const currentRoleDef = ROLE_DEFINITIONS.find((r) => r.code === role);

  const toggleStore = (storeId: string) => {
    setSelectedStoreIds((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (storeAccessType === "SPECIFIC_STORES" && selectedStoreIds.length === 0) {
      setError("Please select at least one store for store-scoped access.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await teamService.updateMember(member.id, {
        role,
        storeAccessType,
        accessibleStoreIds: selectedStoreIds,
        status,
      });

      toast.success(
        "Team Member Updated",
        `Updated permissions and store access for ${member.fullName}.`
      );
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update member";
      setError(msg);
      toast.error("Update Failed", msg);
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
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Edit Team Member
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {member.fullName} ({member.email})
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

        {/* Sole Owner Invariant Protection Warning */}
        {isSoleOwner && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/40 dark:text-amber-300">
            <Lock className="size-4 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Sole Organization Owner:</span> This user is the sole owner of the organization. Their role and active status are protected by system security invariants and cannot be demoted, suspended, or removed.
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Organization Role
            </label>
            <select
              value={role}
              disabled={isSoleOwner}
              onChange={(e) => setRole(e.target.value as RoleCode)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              {ROLE_DEFINITIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.displayName} ({r.code})
                </option>
              ))}
            </select>

            {currentRoleDef && (
              <div className="mt-2 rounded-xl bg-amber-500/5 p-3 border border-amber-500/15 text-xs text-stone-700 dark:text-stone-300">
                <p className="font-semibold text-amber-800 dark:text-amber-400 mb-0.5">
                  {currentRoleDef.displayName}
                </p>
                <p>{currentRoleDef.description}</p>
              </div>
            )}
          </div>

          {/* Member Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Account Status
            </label>
            <select
              value={status}
              disabled={isSoleOwner}
              onChange={(e) => setStatus(e.target.value as MemberStatus)}
              className="mt-1.5 w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 disabled:opacity-60 disabled:cursor-not-allowed focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              <option value="ACTIVE">ACTIVE (Authorized to access merchant workspace)</option>
              <option value="SUSPENDED">SUSPENDED (Temporarily disabled)</option>
            </select>
          </div>

          {/* Store Access Scoping */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-2">
              Store Access Scope
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
                  name="editStoreAccessType"
                  value="ALL_STORES"
                  checked={storeAccessType === "ALL_STORES"}
                  onChange={() => setStoreAccessType("ALL_STORES")}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-semibold">All Stores</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Unrestricted access to all brand branches
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
                  name="editStoreAccessType"
                  value="SPECIFIC_STORES"
                  checked={storeAccessType === "SPECIFIC_STORES"}
                  onChange={() => setStoreAccessType("SPECIFIC_STORES")}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-semibold">Specific Stores</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    Access limited to selected stores
                  </div>
                </div>
              </label>
            </div>

            {storeAccessType === "SPECIFIC_STORES" && (
              <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800 space-y-2">
                <div className="text-xs font-medium text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                  <Store className="size-3.5 text-amber-600 dark:text-amber-400" />
                  Grant access to:
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
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
