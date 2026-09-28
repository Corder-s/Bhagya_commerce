"use client";

import {
  Building,
  Check,
  Clock,
  Copy,
  Edit2,
  Lock,
  Mail,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Store,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditMemberModal } from "@/features/merchant/team/components/edit-member-modal";
import { InviteMemberModal } from "@/features/merchant/team/components/invite-member-modal";
import { RoleMatrixModal } from "@/features/merchant/team/components/role-matrix-modal";
import { toast } from "@/lib/toast";
import {
  ROLE_DEFINITIONS,
  type RoleCode,
  type StoreSummary,
  type TeamInvitation,
  type TeamMember,
  teamService,
} from "@/services/team.service";

export function TeamMembersView() {
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [invitations, setInvitations] = React.useState<TeamInvitation[]>([]);
  const [stores, setStores] = React.useState<StoreSummary[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [activeTab, setActiveTab] = React.useState<"members" | "invitations">("members");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");

  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = React.useState(false);
  const [editingMember, setEditingMember] = React.useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = React.useState<TeamMember | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = React.useState(false);

  const loadAll = React.useCallback(async () => {
    try {
      const [membersData, invitesData, storesData] = await Promise.all([
        teamService.getMembers(),
        teamService.getInvitations(),
        teamService.getAvailableStores(),
      ]);
      setMembers(membersData);
      setInvitations(invitesData);
      setStores(storesData);
    } catch {
      toast.error("Data Error", "Could not load team and role data.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Filtered members
  const filteredMembers = React.useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.roleDisplayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, roleFilter]);

  // Copy invitation link helper
  const copyInviteLink = async (inv: TeamInvitation) => {
    const fullUrl = `${window.location.origin}${inv.inviteUrl}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link Copied", `Invitation link copied to clipboard for ${inv.email}.`);
    } catch {
      toast.info("Invite Link", fullUrl);
    }
  };

  const handleResendInvite = async (inv: TeamInvitation) => {
    try {
      await teamService.resendInvitation(inv.id);
      toast.success("Invitation Sent", `A renewed invitation was sent to ${inv.email}.`);
      const updated = await teamService.getInvitations();
      setInvitations(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend";
      toast.error("Resend Failed", msg);
    }
  };

  const handleRevokeInvite = async (inv: TeamInvitation) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${inv.email}?`)) return;
    try {
      await teamService.revokeInvitation(inv.id);
      toast.success("Invitation Revoked", `The invitation for ${inv.email} is now cancelled.`);
      const updated = await teamService.getInvitations();
      setInvitations(updated);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke";
      toast.error("Revoke Failed", msg);
    }
  };

  const handleConfirmRemove = async () => {
    if (!deletingMember) return;
    setDeleteSubmitting(true);
    try {
      const res = await teamService.removeMember(deletingMember.id);
      toast.success("Member Removed", res.message);
      setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
      setDeletingMember(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove member";
      toast.error("Removal Prohibited", msg);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Helper for role badge colors
  const getRoleBadge = (role: RoleCode) => {
    switch (role) {
      case "OWNER":
        return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800";
      case "ADMIN":
        return "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800";
      case "MANAGER":
        return "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800";
      case "PRODUCT_MANAGER":
        return "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800";
      case "ORDER_MANAGER":
        return "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800";
      case "MARKETING_MANAGER":
        return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800";
      case "SUPPORT_AGENT":
        return "bg-stone-100 text-stone-800 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700";
      default:
        return "bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-300";
    }
  };

  const getStoreScopeLabel = (member: TeamMember) => {
    if (member.storeAccessType === "ALL_STORES") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <Store className="size-3" />
          All Stores ({stores.length})
        </span>
      );
    }
    const count = member.accessibleStoreIds?.length || 0;
    const names = stores
      .filter((s) => member.accessibleStoreIds?.includes(s.id))
      .map((s) => s.name);

    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
          <Store className="size-3" />
          {count} {count === 1 ? "Store" : "Stores"}
        </span>
        {names.length > 0 && (
          <span className="text-[10px] text-stone-500 dark:text-stone-400 truncate max-w-[180px]">
            {names.join(", ")}
          </span>
        )}
      </div>
    );
  };

  const activeCount = members.filter((m) => m.status === "ACTIVE").length;
  const pendingInvitesCount = invitations.filter((i) => i.status === "PENDING").length;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
              Organization Access & Governance
            </span>
            <span className="text-xs text-stone-400">• Step 23</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-serif tracking-tight text-stone-900 dark:text-stone-100 sm:text-3xl">
            Team & Role Management
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Control member permissions, multi-store access scoping, and send secure single-use organization invitations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-2 border-stone-300 dark:border-stone-700"
          >
            <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
            Roles Matrix
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Total Members
              </span>
              <Users className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {loading ? "..." : members.length}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
              Active organization roster
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Active Staff
              </span>
              <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {loading ? "..." : activeCount}
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              Authorized & operational
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Pending Invites
              </span>
              <Mail className="size-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {loading ? "..." : pendingInvitesCount}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
              7-day token expiration
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Scoped Stores
              </span>
              <Building className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {loading ? "..." : stores.length}
            </div>
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
              Multi-store architectures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Header */}
      <div className="border-b border-stone-200 dark:border-stone-800">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "members"
                ? "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-400"
                : "border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            <Users className="size-4" />
            Team Members ({members.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invitations")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "invitations"
                ? "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-400"
                : "border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200"
            }`}
          >
            <Mail className="size-4" />
            Invitations ({invitations.filter((i) => i.status === "PENDING").length})
          </button>
        </div>
      </div>

      {/* TAB 1: MEMBERS */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name, email or role..."
                className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              >
                <option value="ALL">All Roles</option>
                {ROLE_DEFINITIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.displayName}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={loadAll}
                className="rounded-xl border border-stone-300 p-2 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
                title="Refresh team members"
              >
                <RefreshCw className="size-4" />
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-850">
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Artisan / Member
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Role & Authority
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Store Access Scope
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Status
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Activity
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-stone-700 dark:text-stone-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500 dark:text-stone-400">
                      No team members found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const initials = member.fullName
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-colors"
                      >
                        {/* Member Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 text-xs font-bold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-stone-900 dark:text-stone-100">
                                  {member.fullName}
                                </span>
                                {member.isSoleOwner && (
                                  <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                                    <Lock className="size-2.5" />
                                    Sole Owner
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                                {member.email}
                              </div>
                              {member.phone && (
                                <div className="text-[10px] text-stone-400 dark:text-stone-500">
                                  {member.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${getRoleBadge(
                              member.role
                            )}`}
                          >
                            <Shield className="size-3" />
                            {member.roleDisplayName}
                          </span>
                        </td>

                        {/* Store Access Scope */}
                        <td className="py-3.5 px-4">{getStoreScopeLabel(member)}</td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              member.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                member.status === "ACTIVE" ? "bg-emerald-600" : "bg-red-600"
                              }`}
                            />
                            {member.status}
                          </span>
                        </td>

                        {/* Activity */}
                        <td className="py-3.5 px-4 text-stone-500 dark:text-stone-400 text-[11px]">
                          {member.lastActiveAt ? (
                            <div className="flex items-center gap-1">
                              <Clock className="size-3 text-stone-400" />
                              <span>Recently Active</span>
                            </div>
                          ) : (
                            "Never"
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingMember(member)}
                              className="h-8 px-2.5 text-xs"
                            >
                              <Edit2 className="size-3 mr-1" />
                              Edit
                            </Button>

                            {member.isSoleOwner ? (
                              <button
                                type="button"
                                disabled
                                title="Cannot remove the final organization owner"
                                className="h-8 px-2.5 rounded-lg border border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed text-xs inline-flex items-center dark:border-stone-800 dark:bg-stone-800/50 dark:text-stone-600"
                              >
                                <Lock className="size-3 mr-1" />
                                Protected
                              </button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingMember(member)}
                                className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
                              >
                                <Trash2 className="size-3 mr-1" />
                                Remove
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVITATIONS */}
      {activeTab === "invitations" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200 flex items-start gap-3">
            <Mail className="size-5 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Artisan Team Invitation Protocol:</span>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                Invitations generate cryptographically secure single-use tokens valid for 7 days. Once accepted, existing Bhagya Commerce user profiles are automatically granted organization membership without creating duplicate login credentials.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-850">
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Recipient Email
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Proposed Role
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Store Access Scope
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Status & Expiry
                  </th>
                  <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">
                    Invited By
                  </th>
                  <th className="py-3 px-4 font-semibold text-right text-stone-700 dark:text-stone-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-500 dark:text-stone-400">
                      No pending or past invitations found.
                    </td>
                  </tr>
                ) : (
                  invitations.map((inv) => {
                    const isPending = inv.status === "PENDING";
                    const isAccepted = inv.status === "ACCEPTED";
                    const isRevoked = inv.status === "REVOKED";

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-medium text-stone-900 dark:text-stone-100">
                          <div className="flex items-center gap-2">
                            <Mail className="size-3.5 text-stone-400" />
                            {inv.email}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${getRoleBadge(
                              inv.role
                            )}`}
                          >
                            <Shield className="size-3" />
                            {inv.roleDisplayName}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {inv.storeAccessType === "ALL_STORES" ? (
                            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                              All Stores
                            </span>
                          ) : (
                            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                              {inv.storeIds.length} Specific Store(s)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                isPending
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                  : isAccepted
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-400"
                              }`}
                            >
                              {inv.status}
                            </span>
                            {isPending && (
                              <span className="text-[10px] text-stone-400 dark:text-stone-500">
                                Expires {new Date(inv.expiresAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-[11px] text-stone-500 dark:text-stone-400">
                          {inv.invitedByName}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyInviteLink(inv)}
                                  className="h-8 px-2.5 text-xs"
                                  title="Copy invite link"
                                >
                                  <Copy className="size-3 mr-1" />
                                  Link
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResendInvite(inv)}
                                  className="h-8 px-2.5 text-xs"
                                  title="Resend email"
                                >
                                  <RefreshCw className="size-3 mr-1" />
                                  Resend
                                </Button>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRevokeInvite(inv)}
                                  className="h-8 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50"
                                  title="Revoke invitation"
                                >
                                  <X className="size-3 mr-1" />
                                  Revoke
                                </Button>
                              </>
                            )}

                            {isAccepted && (
                              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1">
                                <Check className="size-3.5" />
                                Activated
                              </span>
                            )}

                            {isRevoked && (
                              <span className="text-[11px] text-stone-400 dark:text-stone-500">
                                Cancelled
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Invite Member */}
      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        stores={stores}
        onSuccess={(newInvite) => {
          setInvitations((prev) => [newInvite, ...prev]);
        }}
      />

      {/* MODAL: Edit Member */}
      <EditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        stores={stores}
        onClose={() => setEditingMember(null)}
        onSuccess={(updated) => {
          setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
        }}
      />

      {/* MODAL: Roles Matrix */}
      <RoleMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />

      {/* MODAL: Delete Member Confirmation */}
      {deletingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => !deleteSubmitting && setDeletingMember(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <ShieldAlert className="size-6" />
              <h3 className="text-lg font-bold">Remove Team Member?</h3>
            </div>
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-300">
              Are you sure you want to remove <span className="font-semibold text-stone-900 dark:text-stone-100">{deletingMember.fullName}</span> ({deletingMember.email}) from this merchant organization?
            </p>
            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
              They will immediately lose access to the merchant workspace, products, and order management across all stores. Their customer identity will remain untouched.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDeletingMember(null)}
                disabled={deleteSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmRemove}
                disabled={deleteSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white border-red-700"
              >
                {deleteSubmitting ? "Removing..." : "Confirm Removal"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
