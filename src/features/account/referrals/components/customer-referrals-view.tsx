"use client";

import {
  Award,
  Check,
  Clock,
  Copy,
  Gift,
  HelpCircle,
  Loader2,
  Mail,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import {
  type CustomerReferral,
  loyaltyService,
} from "@/services/loyalty.service";

export function CustomerReferralsView() {
  const [referral, setReferral] = React.useState<CustomerReferral | null>(null);
  const [history, setHistory] = React.useState<CustomerReferral[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadData = React.useCallback(async () => {
    try {
      const [refData, histData] = await Promise.all([
        loyaltyService.getCustomerReferral(),
        loyaltyService.getCustomerReferralHistory(),
      ]);
      setReferral(refData);
      setHistory(histData);
    } catch {
      toast.error("Referral Error", "Could not load your referral profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const fullShareUrl = React.useMemo(() => {
    if (!referral) return "";
    if (typeof window !== "undefined") {
      return `${window.location.origin}/ref/${referral.referralCode}`;
    }
    return `/ref/${referral.referralCode}`;
  }, [referral]);

  const copyCode = async () => {
    if (!referral) return;
    try {
      await navigator.clipboard.writeText(referral.referralCode);
      toast.success("Code Copied", `Referral code ${referral.referralCode} copied.`);
    } catch {
      toast.info("Referral Code", referral.referralCode);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareUrl);
      toast.success("Link Copied", "Referral link copied to clipboard.");
    } catch {
      toast.info("Referral Link", fullShareUrl);
    }
  };

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Bhagya Commerce",
          text: "Discover authentic GI-tagged handlooms and artisanal crafts. Use my referral link to get 150 welcome reward points on your first order!",
          url: fullShareUrl,
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          copyLink();
        }
      }
    } else {
      copyLink();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="size-8 animate-spin text-amber-600 dark:text-amber-400" />
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading referral program...</p>
      </div>
    );
  }

  const completedCount = history.filter((h) => h.status === "REWARDED" || h.status === "QUALIFIED").length;
  const pendingCount = history.filter((h) => h.status === "REGISTERED" || h.status === "CLICKED").length;
  const totalEarnedPoints = completedCount * 300; // 300 pts per completed referral

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
              Artisan Patron Network
            </span>
            <span className="text-xs text-stone-400">• Refer & Earn</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 sm:text-3xl">
            Refer Friends, Earn Points
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Share your love for authentic Indian crafts. Give friends ₹150 in bonus points, and receive 300 points on their first qualifying order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={"/account/loyalty" as any}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <Award className="size-3.5" />
              View Loyalty Balance
            </Button>
          </Link>
          <button
            type="button"
            onClick={loadData}
            className="rounded-xl border border-stone-300 p-2 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
            title="Refresh referral data"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Two-Sided Reward Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-amber-50/50 to-stone-50 p-6 shadow-sm dark:border-amber-700/50 dark:from-amber-950/40 dark:via-stone-900 dark:to-stone-900">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-600/15 px-3 py-0.5 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Sparkles className="size-3.5" /> Two-Sided Artisan Community Reward
            </div>
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 sm:text-2xl">
              Give 150 points, Get 300 points
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              When a friend joins with your personal referral link and completes their first qualifying order (min ₹500), they immediately receive 150 welcome bonus points, and you earn 300 points credited directly to your Artisan Guild account.
            </p>
          </div>

          {/* Referral Code & Share CTA */}
          {referral && (
            <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs dark:border-stone-800 dark:bg-stone-850 shrink-0 w-full lg:w-80 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Your Unique Referral Code
                </span>
                <div className="mt-1 flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2">
                  <span className="font-mono text-base font-bold text-amber-900 dark:text-amber-300">
                    {referral.referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="text-stone-500 hover:text-amber-700 dark:hover:text-amber-300 p-1"
                    title="Copy Code"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={shareNative}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs"
                >
                  <Share2 className="size-3.5" />
                  Share Link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyLink}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Referral Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Friends Referred
              </span>
              <Users className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {history.length}
            </div>
            <p className="mt-1 text-[11px] text-stone-400">
              {pendingCount} pending first order
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Qualified Orders
              </span>
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {completedCount}
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              Orders above ₹500
            </p>
          </CardContent>
        </Card>

        <Card className="border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                Reward Points Earned
              </span>
              <Award className="size-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
              +{totalEarnedPoints}
            </div>
            <p className="mt-1 text-[11px] text-stone-400">
              Credited to your balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy-Safe Referral History Table */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
            Referral Activity
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Track invitation statuses and points credited. Customer privacy is strictly preserved.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-850">
                <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">Attribution</th>
                <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">Status</th>
                <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">Points Earned</th>
                <th className="py-3 px-4 font-semibold text-right text-stone-700 dark:text-stone-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-stone-500 dark:text-stone-400">
                    No referrals yet. Share your link above with friends to start earning!
                  </td>
                </tr>
              ) : (
                history.map((item, idx) => {
                  const isCompleted = item.status === "REWARDED" || item.status === "QUALIFIED";

                  return (
                    <tr key={item.id} className="hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-stone-900 dark:text-stone-100">
                        <div className="flex items-center gap-2">
                          <Users className="size-3.5 text-stone-400" />
                          <span>Artisan Friend #{idx + 1}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isCompleted
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${isCompleted ? "bg-emerald-600" : "bg-amber-600"}`} />
                          {isCompleted ? "Qualifying Order Completed" : "Joined — Awaiting First Order"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {isCompleted ? "+300 pts" : "Pending"}
                      </td>

                      <td className="py-3.5 px-4 text-right text-stone-400 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
