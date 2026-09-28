"use client";

import {
  Award,
  Check,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  Gift,
  HelpCircle,
  History,
  Info,
  Loader2,
  Percent,
  RefreshCw,
  Share2,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import {
  type LoyaltyAccount,
  type LoyaltyLedgerEntry,
  type LoyaltyReward,
  type RewardRedemption,
  loyaltyService,
} from "@/services/loyalty.service";

export function CustomerLoyaltyView() {
  const [account, setAccount] = React.useState<LoyaltyAccount | null>(null);
  const [ledger, setLedger] = React.useState<LoyaltyLedgerEntry[]>([]);
  const [rewards, setRewards] = React.useState<LoyaltyReward[]>([]);
  const [redemptions, setRedemptions] = React.useState<RewardRedemption[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedReward, setSelectedReward] = React.useState<LoyaltyReward | null>(null);
  const [redeeming, setRedeeming] = React.useState(false);
  const [issuedCode, setIssuedCode] = React.useState<string | null>(null);
  const [ledgerFilter, setLedgerFilter] = React.useState<string>("ALL");

  const loadData = React.useCallback(async () => {
    try {
      const [accData, ledData, rewData, redData] = await Promise.all([
        loyaltyService.getCustomerAccount(),
        loyaltyService.getCustomerLedger(),
        loyaltyService.getCustomerRewards(),
        loyaltyService.getCustomerRedemptions(),
      ]);
      setAccount(accData);
      setLedger(ledData);
      setRewards(rewData);
      setRedemptions(redData);
    } catch {
      toast.error("Loyalty Unavailable", "Could not load your rewards profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRedeem = async () => {
    if (!selectedReward) return;
    setRedeeming(true);
    try {
      const res = await loyaltyService.redeemReward(selectedReward.id);
      setIssuedCode(res.referenceCode);
      toast.success("Reward Redeemed!", `Your voucher code is ${res.referenceCode}.`);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to redeem reward";
      toast.error("Redemption Failed", msg);
    } finally {
      setRedeeming(false);
    }
  };

  const copyVoucherCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code Copied", `Voucher code ${code} copied to clipboard.`);
    } catch {
      toast.info("Voucher Code", code);
    }
  };

  const filteredLedger = React.useMemo(() => {
    if (ledgerFilter === "ALL") return ledger;
    if (ledgerFilter === "EARNED") {
      return ledger.filter((e) => ["EARNED", "BONUS", "REFERRAL_EARNED", "REFERRAL_REWARDED"].includes(e.type));
    }
    if (ledgerFilter === "REDEEMED") {
      return ledger.filter((e) => e.type === "REDEEMED");
    }
    return ledger;
  }, [ledger, ledgerFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="size-8 animate-spin text-amber-600 dark:text-amber-400" />
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading your Artisan Guild rewards...</p>
      </div>
    );
  }

  const activeVouchers = redemptions.filter((r) => r.status === "ISSUED");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
              Artisan Guild Rewards
            </span>
            <span className="text-xs text-stone-400">• Customer Loyalty</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 sm:text-3xl">
            Loyalty & Rewards
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Earn points on handcrafted purchases, climb guild patron tiers, and redeem exclusive artisan vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={"/account/referrals" as any}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-xs">
              <Share2 className="size-3.5" />
              Refer & Earn
            </Button>
          </Link>
          <button
            type="button"
            onClick={loadData}
            className="rounded-xl border border-stone-300 p-2 text-stone-600 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800"
            title="Refresh loyalty data"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Points Card */}
      {account && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-white to-stone-50 p-6 shadow-sm dark:border-amber-700/40 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-600/10 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                  <Award className="size-3.5" />
                  {account.tierDisplayName} ({account.tierMultiplier}x points)
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  {account.tier === "PLATINUM" ? "Top Connoisseur Tier" : `${account.pointsToNextTier} pts to next tier`}
                </span>
              </div>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-4xl font-extrabold font-serif text-stone-900 dark:text-stone-100">
                  {account.availablePoints.toLocaleString("en-IN")}
                </span>
                <span className="text-sm font-semibold text-amber-800 dark:text-amber-400">Available Points</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Equivalent to ₹{account.availablePoints} in redeemable craft discounts at checkout.
              </p>
            </div>

            {/* Lifetime stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-stone-200/80 bg-white/80 p-3 dark:border-stone-800 dark:bg-stone-800/80">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Lifetime Earned</div>
                <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  +{account.lifetimeEarnedPoints.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-stone-200/80 bg-white/80 p-3 dark:border-stone-800 dark:bg-stone-800/80">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Lifetime Redeemed</div>
                <div className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                  -{account.lifetimeRedeemedPoints.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-xl border border-stone-200/80 bg-white/80 p-3 dark:border-stone-800 dark:bg-stone-800/80 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Expiring Points</div>
                <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  0 pts (Active)
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar to next tier */}
          {account.tier !== "PLATINUM" && (
            <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-stone-800 space-y-1.5">
              <div className="flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>{account.tierDisplayName}</span>
                <span>{account.pointsToNextTier} points needed for upgrade</span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.max(10, ((account.lifetimeEarnedPoints % 1500) / 1500) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Vouchers Box */}
      {activeVouchers.length > 0 && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/70 p-5 dark:border-emerald-800/50 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
              <Ticket className="size-4 text-emerald-700 dark:text-emerald-400" />
              <h3 className="text-sm font-bold">Your Active Reward Vouchers</h3>
            </div>
            <Link href="/cart" className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
              Apply in Cart <ExternalLink className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {activeVouchers.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-white p-3.5 shadow-xs dark:border-emerald-800/70 dark:bg-stone-900"
              >
                <div>
                  <div className="font-bold text-xs text-stone-900 dark:text-stone-100">{v.rewardName}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {v.referenceCode}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Expires {new Date(v.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyVoucherCode(v.referenceCode)}
                  className="h-8 px-2.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800"
                >
                  <Copy className="size-3 mr-1" />
                  Copy
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Rewards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
              Available Rewards
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Exchange your artisan points for instant coupon codes and shipping savings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const canAfford = account ? account.availablePoints >= reward.pointsCost : false;

            return (
              <Card
                key={reward.id}
                className="border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
                      {reward.type === "FREE_SHIPPING" ? (
                        <Truck className="size-5" />
                      ) : reward.type === "PERCENTAGE_OFF" ? (
                        <Percent className="size-5" />
                      ) : (
                        <Tag className="size-5" />
                      )}
                    </div>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                      {reward.pointsCost} Points
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-stone-900 dark:text-stone-100">
                    {reward.name}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {reward.description}
                  </p>

                  {reward.minimumOrderValue > 0 && (
                    <div className="mt-2 text-[11px] text-stone-400 dark:text-stone-500">
                      Min order: ₹{reward.minimumOrderValue}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {canAfford ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="size-3" /> Ready to claim
                        </span>
                      ) : (
                        <span>Needs {reward.pointsCost - (account?.availablePoints || 0)} more pts</span>
                      )}
                    </span>

                    <Button
                      variant={canAfford ? "primary" : "outline"}
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => {
                        setSelectedReward(reward);
                        setIssuedCode(null);
                      }}
                      className="h-8 px-3 text-xs"
                    >
                      Redeem
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Points History Ledger */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
              Points Activity Ledger
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Complete, server-authoritative record of every point credit, bonus, and redemption.
            </p>
          </div>

          <div className="flex gap-2">
            {["ALL", "EARNED", "REDEEMED"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setLedgerFilter(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  ledgerFilter === f
                    ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-850">
                <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">Activity & Description</th>
                <th className="py-3 px-4 font-semibold text-stone-700 dark:text-stone-300">Type</th>
                <th className="py-3 px-4 font-semibold text-right text-stone-700 dark:text-stone-300">Points Movement</th>
                <th className="py-3 px-4 font-semibold text-right text-stone-700 dark:text-stone-300">Balance After</th>
                <th className="py-3 px-4 font-semibold text-right text-stone-700 dark:text-stone-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-500 dark:text-stone-400">
                    No points transactions found.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((entry) => {
                  const isCredit = entry.points > 0;

                  return (
                    <tr key={entry.id} className="hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-stone-900 dark:text-stone-100">
                        {entry.description}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            entry.type === "BONUS"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
                              : entry.type === "REFERRAL_REWARDED" || entry.type === "REFERRAL_EARNED"
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                              : entry.type === "REDEEMED"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          }`}
                        >
                          {entry.type.replace("_", " ")}
                        </span>
                      </td>

                      <td className={`py-3.5 px-4 text-right font-bold ${isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}`}>
                        {isCredit ? `+${entry.points}` : entry.points}
                      </td>

                      <td className="py-3.5 px-4 text-right text-stone-600 dark:text-stone-400 font-mono">
                        {entry.balanceAfter.toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4 text-right text-stone-400 text-[11px]">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redemption Confirmation Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => !redeeming && setSelectedReward(null)}
          />

          <div className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
            {!issuedCode ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <Gift className="size-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-base font-bold font-serif text-stone-900 dark:text-stone-100">
                      Confirm Reward Redemption
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="rounded-lg p-1 text-stone-400 hover:text-stone-600"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-300 border border-amber-500/20">
                    <div className="font-bold text-sm">{selectedReward.name}</div>
                    <div className="mt-1">{selectedReward.description}</div>
                  </div>

                  <div className="flex justify-between text-xs py-1">
                    <span className="text-stone-500 dark:text-stone-400">Current points balance:</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{account?.availablePoints} pts</span>
                  </div>

                  <div className="flex justify-between text-xs py-1">
                    <span className="text-stone-500 dark:text-stone-400">Points to deduct:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">-{selectedReward.pointsCost} pts</span>
                  </div>

                  <div className="flex justify-between text-xs py-1 border-t border-stone-200 dark:border-stone-800 pt-2 font-bold">
                    <span>Remaining balance:</span>
                    <span>{(account?.availablePoints || 0) - selectedReward.pointsCost} pts</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2.5">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedReward(null)}
                    disabled={redeeming}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleRedeem}
                    disabled={redeeming}
                  >
                    {redeeming ? "Generating Voucher..." : "Confirm & Redeem"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-2 space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Check className="size-6 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-stone-900 dark:text-stone-100">
                    Voucher Ready!
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    Use this single-use code in the checkout order summary for {selectedReward.name}.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 font-mono text-base font-bold text-amber-900 dark:text-amber-300">
                  <span>{issuedCode}</span>
                  <button
                    type="button"
                    onClick={() => copyVoucherCode(issuedCode)}
                    className="p-1 hover:text-amber-600"
                    title="Copy code"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/shop">
                    <Button variant="primary" className="w-full">
                      Shop Artisan Crafts
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setSelectedReward(null)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
