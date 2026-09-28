"use client";

import * as React from "react";
import {
  Award,
  CheckCircle2,
  Clock,
  Coins,
  Edit2,
  Gift,
  HelpCircle,
  Plus,
  RefreshCw,
  Search,
  Share2,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/toast";
import {
  loyaltyService,
  type CustomerReferral,
  type LoyaltyAccount,
  type LoyaltyLedgerEntry,
  type LoyaltyOverview,
  type LoyaltyProgram,
  type LoyaltyReward,
  type PointAdjustmentRequest,
  type RewardCreateRequest,
} from "@/services/loyalty.service";

export function MerchantLoyaltyView() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "rules" | "rewards" | "members" | "referrals">("overview");
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  // Data states
  const [overview, setOverview] = React.useState<LoyaltyOverview | null>(null);
  const [program, setProgram] = React.useState<LoyaltyProgram | null>(null);
  const [rewards, setRewards] = React.useState<LoyaltyReward[]>([]);
  const [members, setMembers] = React.useState<LoyaltyAccount[]>([]);
  const [referrals, setReferrals] = React.useState<CustomerReferral[]>([]);

  // Search & filter states
  const [memberSearch, setMemberSearch] = React.useState("");
  const [rewardSearch, setRewardSearch] = React.useState("");

  // Modals
  const [isRewardModalOpen, setIsRewardModalOpen] = React.useState(false);
  const [editingReward, setEditingReward] = React.useState<LoyaltyReward | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = React.useState(false);
  const [selectedMemberForAdjust, setSelectedMemberForAdjust] = React.useState<LoyaltyAccount | null>(null);

  // Form states for Settings
  const [settingsForm, setSettingsForm] = React.useState({
    enabled: true,
    pointsPerUnitCurrency: 1.0,
    signupBonusPoints: 100,
    firstOrderBonusPoints: 200,
    pointExpiryDays: 365,
    minRedemptionPoints: 100,
    referralProgramEnabled: true,
    referrerRewardPoints: 500,
    referredCustomerRewardPoints: 250,
    minQualifyingOrderAmount: 999,
    referralWindowDays: 90,
  });
  const [isSavingSettings, setIsSavingSettings] = React.useState(false);

  // Form state for Reward create/edit
  const [rewardForm, setRewardForm] = React.useState<RewardCreateRequest>({
    name: "",
    description: "",
    type: "FIXED_AMOUNT_OFF",
    pointsCost: 500,
    discountValue: 100,
    minimumOrderValue: 500,
    maximumDiscount: 100,
    usageLimit: 0,
    perCustomerLimit: 1,
    enabled: true,
  });
  const [isSavingReward, setIsSavingReward] = React.useState(false);

  // Form state for Manual Adjustment
  const [adjustForm, setAdjustForm] = React.useState<PointAdjustmentRequest>({
    customerId: "",
    points: 100,
    isCredit: true,
    reason: "",
  });
  const [isSubmittingAdjust, setIsSubmittingAdjust] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [overviewData, programData, rewardsData, membersData, referralsData] = await Promise.all([
        loyaltyService.getMerchantOverview(),
        loyaltyService.getMerchantProgram(),
        loyaltyService.getMerchantRewards(),
        loyaltyService.getMerchantMembers(),
        loyaltyService.getMerchantReferrals(),
      ]);

      setOverview(overviewData);
      setProgram(programData);
      setRewards(rewardsData);
      setMembers(membersData);
      setReferrals(referralsData);

      if (programData) {
        setSettingsForm({
          enabled: programData.enabled,
          pointsPerUnitCurrency: programData.pointsPerUnitCurrency,
          signupBonusPoints: programData.signupBonusPoints,
          firstOrderBonusPoints: programData.firstOrderBonusPoints,
          pointExpiryDays: programData.pointExpiryDays,
          minRedemptionPoints: programData.minRedemptionPoints,
          referralProgramEnabled: programData.referralProgramEnabled,
          referrerRewardPoints: programData.referrerRewardPoints,
          referredCustomerRewardPoints: programData.referredCustomerRewardPoints,
          minQualifyingOrderAmount: programData.minQualifyingOrderAmount,
          referralWindowDays: programData.referralWindowDays,
        });
      }
    } catch {
      toast.error("Fetch Error", "Could not load loyalty data. Using synchronized merchant cache.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await loyaltyService.updateMerchantProgram(settingsForm);
      setProgram(updated);
      toast.success("Settings Saved", "Loyalty and referral configuration updated successfully.");
    } catch {
      toast.error("Save Error", "Failed to update program settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Open Create/Edit Reward Modal
  const openRewardModal = (reward?: LoyaltyReward) => {
    if (reward) {
      setEditingReward(reward);
      setRewardForm({
        name: reward.name,
        description: reward.description || "",
        type: reward.type,
        pointsCost: reward.pointsCost,
        discountValue: reward.discountValue,
        minimumOrderValue: reward.minimumOrderValue,
        maximumDiscount: reward.maximumDiscount,
        usageLimit: reward.usageLimit,
        perCustomerLimit: reward.perCustomerLimit,
        enabled: reward.enabled,
      });
    } else {
      setEditingReward(null);
      setRewardForm({
        name: "",
        description: "",
        type: "FIXED_AMOUNT_OFF",
        pointsCost: 500,
        discountValue: 100,
        minimumOrderValue: 500,
        maximumDiscount: 100,
        usageLimit: 0,
        perCustomerLimit: 1,
        enabled: true,
      });
    }
    setIsRewardModalOpen(true);
  };

  // Submit Reward Save
  const handleSaveReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardForm.name.trim()) {
      toast.error("Validation Error", "Reward name is required.");
      return;
    }
    if (rewardForm.pointsCost <= 0) {
      toast.error("Validation Error", "Points cost must be greater than zero.");
      return;
    }

    setIsSavingReward(true);
    try {
      if (editingReward) {
        const res = await loyaltyService.updateMerchantReward(editingReward.id, rewardForm);
        setRewards((prev) => prev.map((r) => (r.id === res.id ? res : r)));
        toast.success("Reward Updated", `${res.name} has been updated.`);
      } else {
        const res = await loyaltyService.createMerchantReward(rewardForm);
        setRewards((prev) => [res, ...prev]);
        toast.success("Reward Created", `${res.name} is now available in your catalog.`);
      }
      setIsRewardModalOpen(false);
    } catch {
      toast.error("Save Error", "Could not save reward voucher.");
    } finally {
      setIsSavingReward(false);
    }
  };

  // Toggle Reward Active State
  const handleToggleReward = async (reward: LoyaltyReward) => {
    try {
      const res = await loyaltyService.updateMerchantReward(reward.id, {
        enabled: !reward.enabled,
      });
      setRewards((prev) => prev.map((r) => (r.id === res.id ? res : r)));
      toast.success("Status Changed", `${reward.name} is now ${res.enabled ? "Active" : "Disabled"}.`);
    } catch {
      toast.error("Update Error", "Could not toggle reward state.");
    }
  };

  // Open Manual Point Adjustment Modal
  const openAdjustModal = (member: LoyaltyAccount) => {
    setSelectedMemberForAdjust(member);
    setAdjustForm({
      customerId: member.customerId,
      points: 100,
      isCredit: true,
      reason: "",
    });
    setIsAdjustModalOpen(true);
  };

  // Submit Manual Adjustment
  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustForm.reason.trim()) {
      toast.error("Audit Requirement", "A detailed business reason is mandatory for manual adjustments.");
      return;
    }
    if (adjustForm.points <= 0) {
      toast.error("Validation Error", "Points amount must be greater than zero.");
      return;
    }

    setIsSubmittingAdjust(true);
    try {
      const updated = await loyaltyService.adjustCustomerPoints(adjustForm);
      setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      toast.success(
        "Adjustment Applied",
        `${adjustForm.isCredit ? "Credited" : "Debited"} ${adjustForm.points} points. New balance: ${updated.availablePoints} pts.`
      );
      setIsAdjustModalOpen(false);
      // Refresh overview stats
      loyaltyService.getMerchantOverview().then(setOverview).catch(() => {});
    } catch {
      toast.error("Adjustment Failed", "Could not adjust points. Ensure customer has sufficient balance if debiting.");
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  // Filtered members & rewards
  const filteredMembers = React.useMemo(() => {
    return members.filter(
      (m) =>
        (m.customerName || "Patron").toLowerCase().includes(memberSearch.toLowerCase()) ||
        (m.customerEmail || m.customerId).toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.tier.toLowerCase().includes(memberSearch.toLowerCase())
    );
  }, [members, memberSearch]);

  const filteredRewards = React.useMemo(() => {
    return rewards.filter(
      (r) =>
        r.name.toLowerCase().includes(rewardSearch.toLowerCase()) ||
        r.type.toLowerCase().includes(rewardSearch.toLowerCase())
    );
  }, [rewards, rewardSearch]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-stone-500 dark:text-charcoal-400">
          <RefreshCw className="h-7 w-7 animate-spin text-sage-600" />
          <p className="text-sm font-medium">Loading merchant loyalty engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-cream-50 sm:text-3xl">
              Loyalty, Rewards & Referrals
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                program?.enabled
                  ? "bg-sage-100 text-sage-800 dark:bg-sage-900/60 dark:text-sage-300"
                  : "bg-stone-100 text-stone-600 dark:bg-charcoal-800 dark:text-charcoal-400"
              }`}
            >
              {program?.enabled ? "Program Active" : "Program Disabled"}
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-600 dark:text-charcoal-300">
            Automated customer points ledger, handcrafted vouchers, and anti-fraud referral tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => openRewardModal()}
            className="gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Reward</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-charcoal-400">
                Active Patrons
              </span>
              <Users className="h-4 w-4 text-sage-600 dark:text-sage-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-cream-50">
              {overview?.totalMembers.toLocaleString() || "0"}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              {overview?.activeMembersCount || 0} active balances
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-charcoal-400">
                Points Issued
              </span>
              <Coins className="h-4 w-4 text-accent-600 dark:text-accent-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-cream-50">
              {overview?.totalPointsIssued.toLocaleString() || "0"}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              Lifetime ledger credits
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-charcoal-400">
                Points Redeemed
              </span>
              <Gift className="h-4 w-4 text-sage-600 dark:text-sage-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-cream-50">
              {overview?.totalPointsRedeemed.toLocaleString() || "0"}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              {overview?.redemptionRate ? `${overview.redemptionRate.toFixed(1)}% burn rate` : "0% burn rate"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-charcoal-400">
                Points Liability
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-cream-50">
              ₹{(overview?.outstandingLiabilityInr || 0).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              Outstanding points reserve
            </p>
          </CardContent>
        </Card>

        <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-charcoal-400">
                Referral Orders
              </span>
              <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-stone-900 dark:text-cream-50">
              {overview?.referralConversions || 0}
            </p>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              Qualified 1st purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cream-200 dark:border-charcoal-800 pb-3">
        {[
          { id: "overview", label: "Overview & Analytics", icon: TrendingUp },
          { id: "rules", label: "Program Settings", icon: Coins },
          { id: "rewards", label: `Rewards Catalog (${rewards.length})`, icon: Gift },
          { id: "members", label: `Patron Accounts (${members.length})`, icon: Users },
          { id: "referrals", label: `Referral Track (${referrals.length})`, icon: Share2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sage-600 text-white shadow-sm dark:bg-sage-700 dark:text-white"
                  : "text-stone-600 hover:bg-cream-100 hover:text-stone-900 dark:text-charcoal-300 dark:hover:bg-charcoal-800 dark:hover:text-cream-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tier Distribution */}
          <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-cream-50">
                  Patron Tier Distribution
                </h3>
                <Award className="h-5 w-5 text-accent-600" />
              </div>

              <div className="space-y-4">
                {[
                  {
                    tier: "BRONZE",
                    label: "Artisan Novice (Bronze)",
                    pointsReq: "0 - 999 pts",
                    count: members.filter((m) => m.tier === "BRONZE").length,
                    color: "bg-amber-600",
                  },
                  {
                    tier: "SILVER",
                    label: "Craft Companion (Silver)",
                    pointsReq: "1,000 - 4,999 pts",
                    count: members.filter((m) => m.tier === "SILVER").length,
                    color: "bg-stone-400",
                  },
                  {
                    tier: "GOLD",
                    label: "Heritage Patron (Gold)",
                    pointsReq: "5,000 - 9,999 pts",
                    count: members.filter((m) => m.tier === "GOLD").length,
                    color: "bg-amber-400",
                  },
                  {
                    tier: "PLATINUM",
                    label: "Master Collector (Platinum)",
                    pointsReq: "10,000+ pts",
                    count: members.filter((m) => m.tier === "PLATINUM").length,
                    color: "bg-purple-500",
                  },
                ].map((item) => {
                  const pct = members.length > 0 ? (item.count / members.length) * 100 : 0;
                  return (
                    <div key={item.tier} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-stone-800 dark:text-cream-100">
                          {item.label}
                        </span>
                        <span className="text-stone-500 dark:text-charcoal-400">
                          {item.count} patrons ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-cream-100 dark:bg-charcoal-800">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Rules Summary */}
          <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-cream-50">
                  Active Earning Rules
                </h3>
                <Sparkles className="h-5 w-5 text-sage-600" />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-cream-100 dark:border-charcoal-800">
                  <span className="text-stone-600 dark:text-charcoal-300">Base Earn Rate</span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-cream-50">
                    {program?.pointsPerUnitCurrency || 1} pt per ₹100 spent
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100 dark:border-charcoal-800">
                  <span className="text-stone-600 dark:text-charcoal-300">Signup Welcome Bonus</span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-cream-50">
                    +{program?.signupBonusPoints || 0} pts
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100 dark:border-charcoal-800">
                  <span className="text-stone-600 dark:text-charcoal-300">First Order Bonus</span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-cream-50">
                    +{program?.firstOrderBonusPoints || 0} pts
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-cream-100 dark:border-charcoal-800">
                  <span className="text-stone-600 dark:text-charcoal-300">Referrer Bonus (2-sided)</span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-cream-50">
                    +{program?.referrerRewardPoints || 0} pts to patron
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-stone-600 dark:text-charcoal-300">Points Expiry Window</span>
                  <span className="font-mono font-semibold text-stone-900 dark:text-cream-50">
                    {program?.pointExpiryDays || 365} days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: RULES & SETTINGS */}
      {activeTab === "rules" && (
        <Card className="border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90">
          <CardContent className="p-6">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-cream-50">
                  Storewide Loyalty & Points Configuration
                </h3>
                <p className="mt-1 text-xs text-stone-600 dark:text-charcoal-400">
                  Adjust points multipliers, welcome gifts, and expiry rules. All calculations run server-side with exact precision.
                </p>
              </div>

              {/* Master Switches */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div className="flex items-center justify-between rounded-xl border border-cream-200 p-4 dark:border-charcoal-800 bg-cream-50/50 dark:bg-charcoal-950/40">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-cream-50">
                      Enable Loyalty Engine
                    </p>
                    <p className="text-xs text-stone-500 dark:text-charcoal-400">
                      Customers automatically earn points on paid orders.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsForm((f) => ({ ...f, enabled: !f.enabled }))}
                    className="text-sage-600 dark:text-sage-400"
                  >
                    {settingsForm.enabled ? (
                      <ToggleRight className="h-8 w-8 text-sage-600" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-stone-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-cream-200 p-4 dark:border-charcoal-800 bg-cream-50/50 dark:bg-charcoal-950/40">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-cream-50">
                      Enable Referral Program
                    </p>
                    <p className="text-xs text-stone-500 dark:text-charcoal-400">
                      Allow customers to generate shareable links and earn rewards.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSettingsForm((f) => ({ ...f, referralProgramEnabled: !f.referralProgramEnabled }))
                    }
                    className="text-sage-600 dark:text-sage-400"
                  >
                    {settingsForm.referralProgramEnabled ? (
                      <ToggleRight className="h-8 w-8 text-sage-600" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-stone-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Points Rules */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Points Per ₹100 Spent
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={settingsForm.pointsPerUnitCurrency}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, pointsPerUnitCurrency: parseFloat(e.target.value) || 0 })
                    }
                    className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">e.g. 1 point for every ₹100 of merchandise.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Signup Welcome Bonus (Points)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.signupBonusPoints}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, signupBonusPoints: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">Awarded immediately upon account registration.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    First Order Bonus (Points)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.firstOrderBonusPoints}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, firstOrderBonusPoints: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">Additional bonus on first paid order completion.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Points Expiry Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    value={settingsForm.pointExpiryDays}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, pointExpiryDays: parseInt(e.target.value, 10) || 365 })
                    }
                    className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">Auto-expired by background scheduler.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Min Redemption Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={settingsForm.minRedemptionPoints}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, minRedemptionPoints: parseInt(e.target.value, 10) || 100 })
                    }
                    className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                  <p className="mt-1 text-[11px] text-stone-500">Minimum balance before rewards unlock.</p>
                </div>
              </div>

              {/* Referral Settings */}
              <div className="border-t border-cream-200 dark:border-charcoal-800 pt-6">
                <h4 className="font-serif text-base font-bold text-stone-900 dark:text-cream-50 mb-3">
                  Two-Sided Referral Rules
                </h4>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                      Referrer Reward (Points)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.referrerRewardPoints}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, referrerRewardPoints: parseInt(e.target.value, 10) || 0 })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                      Referred Friend Reward (Points)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.referredCustomerRewardPoints}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, referredCustomerRewardPoints: parseInt(e.target.value, 10) || 0 })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                      Min Qualifying Order (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.minQualifyingOrderAmount}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, minQualifyingOrderAmount: parseFloat(e.target.value) || 0 })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                      Attribution Window (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={settingsForm.referralWindowDays}
                      onChange={(e) =>
                        setSettingsForm({ ...settingsForm, referralWindowDays: parseInt(e.target.value, 10) || 90 })
                      }
                      className="mt-1.5 w-full rounded-lg border border-cream-300 bg-white px-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" type="submit" disabled={isSavingSettings} className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isSavingSettings ? "Saving Rules..." : "Save Program Settings"}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB CONTENT: REWARDS CATALOG */}
      {activeTab === "rewards" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search rewards by title or type..."
                value={rewardSearch}
                onChange={(e) => setRewardSearch(e.target.value)}
                className="w-full rounded-lg border border-cream-300 bg-white pl-9 pr-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
              />
            </div>
            <Button variant="primary" size="sm" onClick={() => openRewardModal()} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Reward</span>
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:bg-charcoal-800/60 dark:text-charcoal-300">
                  <tr>
                    <th className="px-5 py-3.5">Reward Title</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Points Cost</th>
                    <th className="px-5 py-3.5">Voucher Value</th>
                    <th className="px-5 py-3.5">Min Order (₹)</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 dark:divide-charcoal-800">
                  {filteredRewards.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-stone-500 dark:text-charcoal-400">
                        No rewards found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRewards.map((reward) => (
                      <tr key={reward.id} className="hover:bg-cream-50/50 dark:hover:bg-charcoal-800/30">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-stone-900 dark:text-cream-50">{reward.name}</p>
                          {reward.description && (
                            <p className="text-xs text-stone-500 dark:text-charcoal-400 line-clamp-1">
                              {reward.description}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-medium text-stone-700 dark:bg-charcoal-800 dark:text-charcoal-300">
                            {reward.type.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-accent-700 dark:text-accent-400">
                          {reward.pointsCost} pts
                        </td>
                        <td className="px-5 py-4 font-semibold text-stone-900 dark:text-cream-100">
                          {reward.type === "PERCENTAGE_OFF"
                            ? `${reward.discountValue}% OFF`
                            : reward.type === "FREE_SHIPPING"
                            ? "Free Delivery"
                            : `₹${reward.discountValue} OFF`}
                        </td>
                        <td className="px-5 py-4 text-stone-600 dark:text-charcoal-300">
                          ₹{reward.minimumOrderValue}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleReward(reward)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold"
                          >
                            {reward.enabled ? (
                              <span className="flex items-center gap-1 text-sage-700 dark:text-sage-400">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-stone-400 dark:text-charcoal-500">
                                <X className="h-3.5 w-3.5" /> Inactive
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openRewardModal(reward)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MEMBERS & AUDITED POINT ADJUSTMENTS */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search patrons by name, email, or tier..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full rounded-lg border border-cream-300 bg-white pl-9 pr-3.5 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:bg-charcoal-800/60 dark:text-charcoal-300">
                  <tr>
                    <th className="px-5 py-3.5">Patron</th>
                    <th className="px-5 py-3.5">Tier</th>
                    <th className="px-5 py-3.5">Available Balance</th>
                    <th className="px-5 py-3.5">Lifetime Earned</th>
                    <th className="px-5 py-3.5">Lifetime Redeemed</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 dark:divide-charcoal-800">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-stone-500 dark:text-charcoal-400">
                        No loyalty members found.
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-cream-50/50 dark:hover:bg-charcoal-800/30">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-stone-900 dark:text-cream-50">
                            {member.customerName}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-charcoal-400">
                            {member.customerEmail}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              member.tier === "PLATINUM"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                                : member.tier === "GOLD"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                                : member.tier === "SILVER"
                                ? "bg-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-300"
                                : "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300"
                            }`}
                          >
                            {member.tier}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-sage-700 dark:text-sage-400">
                          {member.availablePoints.toLocaleString()} pts
                        </td>
                        <td className="px-5 py-4 text-stone-600 dark:text-charcoal-300">
                          +{member.lifetimeEarnedPoints.toLocaleString()}
                        </td>
                        <td className="px-5 py-4 text-stone-600 dark:text-charcoal-300">
                          -{member.lifetimeRedeemedPoints.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              member.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAdjustModal(member)}
                            className="gap-1.5 text-xs"
                          >
                            <Coins className="h-3.5 w-3.5 text-accent-600" />
                            <span>Adjust Points</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REFERRALS TRACK */}
      {activeTab === "referrals" && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-cream-200/80 bg-white/95 dark:border-charcoal-700 dark:bg-charcoal-900/90 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-100/60 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:bg-charcoal-800/60 dark:text-charcoal-300">
                  <tr>
                    <th className="px-5 py-3.5">Referral Code</th>
                    <th className="px-5 py-3.5">Referrer</th>
                    <th className="px-5 py-3.5">Referred Friend</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">First Order</th>
                    <th className="px-5 py-3.5">Rewards Granted</th>
                    <th className="px-5 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 dark:divide-charcoal-800">
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-stone-500 dark:text-charcoal-400">
                        No customer referrals recorded yet.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-cream-50/50 dark:hover:bg-charcoal-800/30">
                        <td className="px-5 py-4 font-mono font-bold text-stone-900 dark:text-cream-50">
                          {ref.referralCode}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900 dark:text-cream-100">
                            {ref.referrerName || "Artisan Patron"}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-charcoal-400">
                            {ref.referrerEmail}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-900 dark:text-cream-100">
                            {ref.referredName || "New Shopper"}
                          </p>
                          <p className="text-xs text-stone-500 dark:text-charcoal-400">
                            {ref.referredEmail}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              ref.status === "REWARDED"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : ref.status === "QUALIFIED"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                                : ref.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                            }`}
                          >
                            {ref.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-stone-700 dark:text-charcoal-300">
                          {ref.qualifiedOrderNumber ? (
                            <span className="font-mono text-xs font-semibold">
                              #{ref.qualifiedOrderNumber}
                            </span>
                          ) : (
                            <span className="text-xs text-stone-400">Pending Order</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {ref.status === "REWARDED" ? (
                            <div className="text-xs font-medium text-sage-700 dark:text-sage-400">
                              +{ref.referrerPointsAwarded} / +{ref.referredPointsAwarded} pts
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-stone-500 dark:text-charcoal-400">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT REWARD */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-cream-200 bg-white p-6 shadow-2xl dark:border-charcoal-700 dark:bg-charcoal-900">
            <button
              onClick={() => setIsRewardModalOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 dark:hover:text-cream-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-cream-50">
              {editingReward ? "Edit Loyalty Reward" : "Create New Reward Voucher"}
            </h3>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              Configured rewards generate one-time usable discount codes in the promotion engine upon redemption.
            </p>

            <form onSubmit={handleSaveReward} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                  Reward Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹200 OFF Handcrafted Textiles"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Eligible on all organic products. Single-use voucher."
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Reward Type
                  </label>
                  <select
                    value={rewardForm.type}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, type: e.target.value as RewardCreateRequest["type"] })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  >
                    <option value="FIXED_AMOUNT_OFF">Fixed Amount Off (₹)</option>
                    <option value="PERCENTAGE_OFF">Percentage Off (%)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                    <option value="STORE_CREDIT">Store Credit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Points Cost *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={rewardForm.pointsCost}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, pointsCost: parseInt(e.target.value, 10) || 0 })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Discount Value (₹ or %)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={rewardForm.discountValue}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, discountValue: parseFloat(e.target.value) || 0 })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                    Minimum Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={rewardForm.minimumOrderValue}
                    onChange={(e) =>
                      setRewardForm({ ...rewardForm, minimumOrderValue: parseFloat(e.target.value) || 0 })
                    }
                    className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="rewardEnabled"
                  checked={rewardForm.enabled}
                  onChange={(e) => setRewardForm({ ...rewardForm, enabled: e.target.checked })}
                  className="rounded border-cream-300 text-sage-600 focus:ring-sage-500"
                />
                <label htmlFor="rewardEnabled" className="text-xs font-medium text-stone-700 dark:text-charcoal-300">
                  Active and available for customer redemption immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cream-200 dark:border-charcoal-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRewardModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSavingReward}
                >
                  {isSavingReward ? "Saving..." : editingReward ? "Update Reward" : "Create Reward"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL AUDITED POINT ADJUSTMENT */}
      {isAdjustModalOpen && selectedMemberForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-cream-200 bg-white p-6 shadow-2xl dark:border-charcoal-700 dark:bg-charcoal-900">
            <button
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-600 dark:hover:text-cream-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 text-accent-600 dark:text-accent-400">
              <ShieldAlert className="h-5 w-5" />
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-cream-50">
                Audited Point Adjustment
              </h3>
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-charcoal-400">
              Modify points balance for patron <strong>{selectedMemberForAdjust.customerName}</strong>. Current balance: <strong>{selectedMemberForAdjust.availablePoints} pts</strong>.
            </p>

            <form onSubmit={handleSubmitAdjustment} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300 mb-1.5">
                  Action Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, isCredit: true })}
                    className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                      adjustForm.isCredit
                        ? "bg-emerald-600 text-white"
                        : "bg-cream-100 text-stone-700 dark:bg-charcoal-800 dark:text-charcoal-300"
                    }`}
                  >
                    + Credit Points
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustForm({ ...adjustForm, isCredit: false })}
                    className={`rounded-lg py-2 text-xs font-bold transition-colors ${
                      !adjustForm.isCredit
                        ? "bg-rose-600 text-white"
                        : "bg-cream-100 text-stone-700 dark:bg-charcoal-800 dark:text-charcoal-300"
                    }`}
                  >
                    - Debit Points
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                  Points Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustForm.points}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, points: parseInt(e.target.value, 10) || 0 })
                  }
                  className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-charcoal-300">
                  Mandatory Audit Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Customer support goodwill compensation for delayed artisan delivery (Ticket #4029)"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-cream-300 bg-white px-3 py-2 text-sm text-stone-900 dark:border-charcoal-700 dark:bg-charcoal-950 dark:text-cream-100"
                />
                <p className="mt-1 text-[11px] text-stone-500">
                  Recorded in server audit logs with your team actor ID.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-cream-200 dark:border-charcoal-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdjustModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingAdjust}
                >
                  {isSubmittingAdjust ? "Applying..." : "Apply Adjustment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
