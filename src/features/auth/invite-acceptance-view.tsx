"use client";

import {
  AlertCircle,
  Building,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldAlert,
  ShieldCheck,
  Store,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import {
  type PublicInvitationData,
  teamService,
} from "@/services/team.service";

interface InviteAcceptanceViewProps {
  token: string;
}

export function InviteAcceptanceView({ token }: InviteAcceptanceViewProps) {
  const router = useRouter();
  const [data, setData] = React.useState<PublicInvitationData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isDeclined, setIsDeclined] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Form fields for new account creation if needed
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await teamService.getPublicInvitation(token);
        setData(res);
        if (!res.userExists) {
          const suggestedName = res.email.split("@")[0].replace(".", " ");
          setFullName(suggestedName.charAt(0).toUpperCase() + suggestedName.slice(1));
        }
      } catch {
        setError("Invalid or expired invitation token.");
      } finally {
        setLoading(false);
      }
    }
    fetchInvite();
  }, [token]);

  const handleAccept = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data) return;
    setError(null);

    if (!data.userExists && (!password || password.length < 8)) {
      setError("Please create a password of at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await teamService.acceptInvitation(token, fullName, password);
      toast.success("Welcome Aboard!", res.message);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/merchant/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to accept invitation";
      setError(msg);
      toast.error("Acceptance Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = () => {
    if (confirm("Are you sure you wish to decline this organization invitation?")) {
      setIsDeclined(true);
      toast.info("Invitation Declined", "You have declined this merchant invitation.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <Loader2 className="size-8 animate-spin text-amber-600 dark:text-amber-400" />
        <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
          Validating invitation token and organization credentials...
        </p>
      </div>
    );
  }

  if (isDeclined) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
          <X className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
          Invitation Declined
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          You have declined the invitation to join this organization. No changes were made to your account.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button variant="outline">Return to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center dark:border-emerald-900/60 dark:bg-emerald-950/40 shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <CheckCircle2 className="size-8" />
        </div>
        <h2 className="mt-4 text-2xl font-bold font-serif text-emerald-900 dark:text-emerald-100">
          Welcome to the Team!
        </h2>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
          Your merchant membership has been securely activated. You now have authorized access to the merchant workspace.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/merchant/dashboard">
            <Button variant="primary" className="w-full sm:w-auto">
              Open Merchant Dashboard
            </Button>
          </Link>
          <Link href="/merchant/team">
            <Button variant="outline" className="w-full sm:w-auto">
              View Team Workspace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data || data.isExpired || data.status === "EXPIRED" || data.status === "REVOKED") {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center dark:border-stone-800 dark:bg-stone-900 shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
          Invitation Expired or Revoked
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          This single-use invitation link is no longer active. Organization invitations expire after 7 days for security.
        </p>
        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
          Please contact the organization owner to request a fresh invitation link.
        </p>
        <div className="mt-6">
          <Link href="/login">
            <Button variant="outline">Sign in to Bhagya</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900 shadow-sm sm:p-8">
      {/* Organization Header */}
      <div className="flex items-center gap-3.5 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
          <Building className="size-6" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Team Invitation
          </span>
          <h1 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 sm:text-2xl">
            {data.organizationName}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {data.invitedByName} has invited you to collaborate.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role & Store Scoping Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-850">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
            Granted Role
          </div>
          <div className="mt-1 text-sm font-bold text-stone-900 dark:text-stone-100">
            {data.roleDisplayName}
          </div>
          <div className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
            Role code: {data.role}
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-850">
          <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <Store className="size-4 text-amber-600 dark:text-amber-400" />
            Store Access
          </div>
          <div className="mt-1 text-sm font-bold text-stone-900 dark:text-stone-100">
            {data.storeAccessType === "ALL_STORES" ? "All Stores" : "Departmental Stores"}
          </div>
          <div className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400 truncate">
            {data.storeNames.join(", ")}
          </div>
        </div>
      </div>

      {/* Email note */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-amber-500/5 border border-amber-500/15 p-3 text-xs text-stone-700 dark:text-stone-300">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            Invited account: <strong className="font-semibold text-stone-900 dark:text-stone-100">{data.email}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 shrink-0">
          <Clock className="size-3 text-stone-400" />
          <span>Valid for 7 days</span>
        </div>
      </div>

      {/* Existing User Flow vs New User Account Flow */}
      {data.userExists ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-200 flex items-start gap-2.5">
            <CheckCircle2 className="size-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Existing Bhagya Commerce Identity:</span>
              <p className="mt-0.5">
                We detected an active customer/artisan profile for this email. Accepting will link your existing profile to this organization without creating duplicate accounts.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="button"
              variant="primary"
              onClick={() => handleAccept()}
              disabled={submitting}
              className="w-full sm:flex-1 py-2.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Linking Account...
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  Accept & Join Organization
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDecline}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Decline
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleAccept} className="mt-6 space-y-4">
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-400">
            Create a password to set up your unified Bhagya Commerce merchant identity.
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Full Legal Name
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300">
              Create Account Password
            </label>
            <div className="relative mt-1">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-10 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
              Must be at least 8 characters with letters and numbers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full sm:flex-1 py-2.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Activating Account...
                </>
              ) : (
                <>
                  <Check className="size-4 mr-2" />
                  Create Account & Accept
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDecline}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              Decline
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
