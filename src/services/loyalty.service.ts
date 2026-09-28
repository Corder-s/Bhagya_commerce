/**
 * Bhagya Commerce — Loyalty, Rewards & Referrals Service (Step 24)
 * Provides store-scoped loyalty accounts, immutable points ledger,
 * reward catalog and redemption, referral code generation and attribution.
 */

export interface LoyaltyProgram {
  id: string;
  storeId: string;
  enabled: boolean;
  programName: string;
  pointsPerSpent: number; // e.g. 0.05 => 1 pt per ₹20
  pointsPerUnitCurrency: number; // e.g. 1 pt per ₹100
  currencyRatio: number;  // 1 pt = ₹1 credit
  signupBonusPoints: number;
  firstOrderBonusPoints: number;
  reviewBonusPoints: number;
  referralSenderPoints: number;
  referralReceiverPoints: number;
  referrerRewardPoints: number;
  referredCustomerRewardPoints: number;
  minOrderForPoints: number;
  minOrderForReferral: number;
  minQualifyingOrderAmount: number;
  pointsExpiryDays: number;
  pointExpiryDays: number;
  expiryNotificationDays: number;
  minRedemptionPoints: number;
  referralProgramEnabled: boolean;
  referralWindowDays: number;
  updatedAt: string;
}

export interface LoyaltyAccount {
  id: string;
  storeId: string;
  customerId: string;
  customerName?: string;
  customerEmail?: string;
  status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  availablePoints: number;
  lifetimeEarnedPoints: number;
  lifetimeRedeemedPoints: number;
  lifetimeExpiredPoints: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
  tierDisplayName: string;
  tierMultiplier: number;
  pointsToNextTier: number;
  updatedAt: string;
}

export interface LoyaltyLedgerEntry {
  id: string;
  storeId: string;
  customerId: string;
  type:
    | "EARNED"
    | "REDEEMED"
    | "EXPIRED"
    | "ADJUSTED"
    | "REFUNDED"
    | "REVERSED"
    | "BONUS"
    | "REFERRAL_EARNED"
    | "REFERRAL_REWARDED";
  points: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  description: string;
  expiresAt?: string;
  createdAt: string;
}

export interface LoyaltyReward {
  id: string;
  storeId: string;
  name: string;
  description: string;
  type: "FIXED_AMOUNT_OFF" | "PERCENTAGE_OFF" | "FREE_SHIPPING" | "STORE_CREDIT";
  pointsCost: number;
  value: number;
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  usageLimit?: number;
  perCustomerLimit: number;
  startsAt?: string;
  endsAt?: string;
  enabled: boolean;
  isActive: boolean;
}

export interface RewardRedemption {
  id: string;
  storeId: string;
  customerId: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  status: "PENDING" | "ISSUED" | "USED" | "EXPIRED" | "CANCELLED" | "REVERSED";
  referenceCode: string;
  couponId?: string;
  orderId?: string;
  expiresAt: string;
  redeemedAt?: string;
  createdAt: string;
}

export interface CustomerReferral {
  id: string;
  storeId: string;
  referrerCustomerId: string;
  referrerName?: string;
  referrerEmail?: string;
  referredCustomerId?: string;
  referredName?: string;
  referredEmail?: string;
  referralCode: string;
  referralUrl: string;
  status: "CREATED" | "CLICKED" | "REGISTERED" | "QUALIFIED" | "REWARDED" | "REJECTED" | "EXPIRED";
  qualifiedOrderId?: string;
  qualifiedOrderNumber?: string;
  referrerPointsAwarded?: number;
  referredPointsAwarded?: number;
  message?: string;
  createdAt: string;
  qualifiedAt?: string;
  rewardedAt?: string;
}

export interface LoyaltyOverview {
  storeId: string;
  programEnabled: boolean;
  programName: string;
  totalMembers: number;
  activeMembers: number;
  activeMembersCount?: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  outstandingPointsLiability: number;
  outstandingLiabilityInr?: number;
  outstandingValueInr: number;
  activeRewardsCount: number;
  totalRedemptionsCount: number;
  totalReferralsCreated: number;
  totalReferralsQualified: number;
  referralConversions?: number;
  redemptionRate?: number;
  referralSalesInr: number;
}

export interface PointAdjustmentRequest {
  customerId: string;
  points: number;
  isCredit: boolean;
  reason: string;
}

export interface RewardCreateRequest {
  name: string;
  description?: string;
  type: "FIXED_AMOUNT_OFF" | "PERCENTAGE_OFF" | "FREE_SHIPPING" | "STORE_CREDIT";
  pointsCost: number;
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  usageLimit?: number;
  perCustomerLimit?: number;
  enabled?: boolean;
}

const STORAGE_KEY_PROGRAM = "bhagya_loyalty_program_v1";
const STORAGE_KEY_ACCOUNT = "bhagya_loyalty_account_v1";
const STORAGE_KEY_LEDGER = "bhagya_loyalty_ledger_v1";
const STORAGE_KEY_REWARDS = "bhagya_loyalty_rewards_v1";
const STORAGE_KEY_REDEMPTIONS = "bhagya_loyalty_redemptions_v1";
const STORAGE_KEY_REFERRALS = "bhagya_loyalty_referrals_v1";

const DEFAULT_PROGRAM: LoyaltyProgram = {
  id: "prog_store_main",
  storeId: "store_main",
  enabled: true,
  programName: "Artisan Guild Rewards",
  pointsPerSpent: 0.05,
  pointsPerUnitCurrency: 1.0,
  currencyRatio: 1.0,
  signupBonusPoints: 100,
  firstOrderBonusPoints: 150,
  reviewBonusPoints: 50,
  referralSenderPoints: 300,
  referralReceiverPoints: 150,
  referrerRewardPoints: 500,
  referredCustomerRewardPoints: 250,
  minOrderForPoints: 100,
  minOrderForReferral: 500,
  minQualifyingOrderAmount: 999,
  pointsExpiryDays: 365,
  pointExpiryDays: 365,
  expiryNotificationDays: 14,
  minRedemptionPoints: 100,
  referralProgramEnabled: true,
  referralWindowDays: 90,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_ACCOUNT: LoyaltyAccount = {
  id: "loy_acc_01",
  storeId: "store_main",
  customerId: "usr_dev_customer_01",
  customerName: "Priya Sharma",
  customerEmail: "priya.sharma@example.com",
  status: "ACTIVE",
  availablePoints: 1240,
  lifetimeEarnedPoints: 1840,
  lifetimeRedeemedPoints: 600,
  lifetimeExpiredPoints: 0,
  tier: "SILVER",
  tierDisplayName: "Guild Apprentice",
  tierMultiplier: 1.1,
  pointsToNextTier: 260,
  updatedAt: new Date().toISOString(),
};

const DEFAULT_LEDGER: LoyaltyLedgerEntry[] = [
  {
    id: "led_01",
    storeId: "store_main",
    customerId: "usr_dev_customer_01",
    type: "BONUS",
    points: 100,
    balanceAfter: 100,
    referenceType: "SIGNUP",
    description: "Welcome Artisan Guild signup bonus",
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: "led_02",
    storeId: "store_main",
    customerId: "usr_dev_customer_01",
    type: "EARNED",
    points: 740,
    balanceAfter: 840,
    referenceType: "ORDER",
    referenceId: "ord_9812",
    description: "Earned on Order #ORD-2026-9812 (Banarasi handloom)",
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: "led_03",
    storeId: "store_main",
    customerId: "usr_dev_customer_01",
    type: "REFERRAL_REWARDED",
    points: 500,
    balanceAfter: 1340,
    referenceType: "REFERRAL",
    description: "Referral reward: Friend completed first qualifying order",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "led_04",
    storeId: "store_main",
    customerId: "usr_dev_customer_01",
    type: "REDEEMED",
    points: -100,
    balanceAfter: 1240,
    referenceType: "REWARD_REDEMPTION",
    description: "Redeemed ₹100 Guild voucher coupon (Code: BG-FIX-8421)",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_REWARDS: LoyaltyReward[] = [
  {
    id: "rew_fixed_100",
    storeId: "store_main",
    name: "₹100 Guild Artisan Voucher",
    description: "Flat ₹100 off on any craft or handloom order above ₹500.",
    type: "FIXED_AMOUNT_OFF",
    pointsCost: 500,
    value: 100,
    discountValue: 100,
    minimumOrderValue: 500,
    perCustomerLimit: 1,
    enabled: true,
    isActive: true,
  },
  {
    id: "rew_free_shipping",
    storeId: "store_main",
    name: "Free Express Delivery",
    description: "Complimentary fragile-handling insured courier shipping on any order.",
    type: "FREE_SHIPPING",
    pointsCost: 300,
    value: 150,
    discountValue: 150,
    minimumOrderValue: 0,
    perCustomerLimit: 2,
    enabled: true,
    isActive: true,
  },
  {
    id: "rew_percent_15",
    storeId: "store_main",
    name: "15% Connoisseur Discount",
    description: "Enjoy 15% discount across curated handlooms and brass masterworks (up to ₹1,500).",
    type: "PERCENTAGE_OFF",
    pointsCost: 750,
    value: 15,
    discountValue: 15,
    minimumOrderValue: 1500,
    maximumDiscount: 1500,
    perCustomerLimit: 1,
    enabled: true,
    isActive: true,
  },
  {
    id: "rew_master_500",
    storeId: "store_main",
    name: "₹500 Master Craftsman Credit",
    description: "Exclusive ₹500 credit on heritage silk saris and bell metal sculptures.",
    type: "STORE_CREDIT",
    pointsCost: 2000,
    value: 500,
    discountValue: 500,
    minimumOrderValue: 2500,
    usageLimit: 100,
    perCustomerLimit: 1,
    enabled: true,
    isActive: true,
  },
];

const DEFAULT_REDEMPTIONS: RewardRedemption[] = [
  {
    id: "rdm_01",
    storeId: "store_main",
    customerId: "usr_dev_customer_01",
    rewardId: "rew_fixed_100",
    rewardName: "₹100 Guild Artisan Voucher",
    pointsSpent: 500,
    status: "ISSUED",
    referenceCode: "BG-FIX-8421",
    expiresAt: new Date(Date.now() + 86400000 * 28).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const DEFAULT_REFERRAL: CustomerReferral = {
  id: "ref_01",
  storeId: "store_main",
  referrerCustomerId: "usr_dev_customer_01",
  referralCode: "BG-PRIYA25",
  referralUrl: "/ref/BG-PRIYA25",
  status: "CREATED",
  createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
};

class LoyaltyService {
  private getStored<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return fallback;
  }

  private setStored<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  // ── Customer APIs ──────────────────────────────────────────────────────

  async getCustomerAccount(storeId = "store_main"): Promise<LoyaltyAccount> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.availablePoints !== undefined) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return this.getStored(STORAGE_KEY_ACCOUNT, DEFAULT_ACCOUNT);
  }

  async getCustomerLedger(storeId = "store_main"): Promise<LoyaltyLedgerEntry[]> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty/ledger?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 80));
    return this.getStored(STORAGE_KEY_LEDGER, DEFAULT_LEDGER);
  }

  async getCustomerRewards(storeId = "store_main"): Promise<LoyaltyReward[]> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty/rewards?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 80));
    return this.getStored(STORAGE_KEY_REWARDS, DEFAULT_REWARDS);
  }

  async redeemReward(rewardId: string, storeId = "store_main"): Promise<RewardRedemption> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty/rewards/${rewardId}/redeem?storeId=${storeId}`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {}

    await new Promise((r) => setTimeout(r, 150));
    const rewards = this.getStored(STORAGE_KEY_REWARDS, DEFAULT_REWARDS);
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) throw new Error("Reward not found");

    const account = this.getStored(STORAGE_KEY_ACCOUNT, DEFAULT_ACCOUNT);
    if (account.availablePoints < reward.pointsCost) {
      throw new Error(`Insufficient points. You have ${account.availablePoints} points but need ${reward.pointsCost}.`);
    }

    // Deduct points
    account.availablePoints -= reward.pointsCost;
    account.lifetimeRedeemedPoints += reward.pointsCost;
    this.setStored(STORAGE_KEY_ACCOUNT, account);

    // Create redemption
    const code = "BG-" + reward.type.substring(0, 3) + "-" + Math.floor(1000 + Math.random() * 9000);
    const redemption: RewardRedemption = {
      id: "rdm_" + Date.now(),
      storeId,
      customerId: account.customerId,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsSpent: reward.pointsCost,
      status: "ISSUED",
      referenceCode: code,
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      createdAt: new Date().toISOString(),
    };

    const redemptions = this.getStored(STORAGE_KEY_REDEMPTIONS, DEFAULT_REDEMPTIONS);
    redemptions.unshift(redemption);
    this.setStored(STORAGE_KEY_REDEMPTIONS, redemptions);

    // Record in ledger
    const ledger = this.getStored(STORAGE_KEY_LEDGER, DEFAULT_LEDGER);
    ledger.unshift({
      id: "led_" + Date.now(),
      storeId,
      customerId: account.customerId,
      type: "REDEEMED",
      points: -reward.pointsCost,
      balanceAfter: account.availablePoints,
      referenceType: "REWARD_REDEMPTION",
      description: `Redeemed ${reward.name} (Voucher: ${code})`,
      createdAt: new Date().toISOString(),
    });
    this.setStored(STORAGE_KEY_LEDGER, ledger);

    return redemption;
  }

  async getCustomerRedemptions(storeId = "store_main"): Promise<RewardRedemption[]> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty/redemptions?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return this.getStored(STORAGE_KEY_REDEMPTIONS, DEFAULT_REDEMPTIONS);
  }

  async getCustomerReferral(storeId = "store_main"): Promise<CustomerReferral> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty/referral?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.referralCode) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return this.getStored(STORAGE_KEY_REFERRALS, DEFAULT_REFERRAL);
  }

  async getCustomerReferralHistory(storeId = "store_main"): Promise<CustomerReferral[]> {
    try {
      const res = await fetch(`/api/v1/customer/loyalty/referral/history?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return [
      {
        id: "ref_attr_01",
        storeId,
        referrerCustomerId: "usr_dev_customer_01",
        referredCustomerId: "usr_friend_kavita",
        referralCode: "BG-PRIYA25",
        referralUrl: "/ref/BG-PRIYA25",
        status: "REWARDED",
        qualifiedOrderId: "ord_9942",
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        qualifiedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        rewardedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "ref_attr_02",
        storeId,
        referrerCustomerId: "usr_dev_customer_01",
        referredCustomerId: "usr_friend_vikas",
        referralCode: "BG-PRIYA25",
        referralUrl: "/ref/BG-PRIYA25",
        status: "REGISTERED",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];
  }

  // ── Merchant APIs ──────────────────────────────────────────────────────

  async getMerchantOverview(storeId = "store_main"): Promise<LoyaltyOverview> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/overview?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        return await res.json();
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 80));
    return {
      storeId,
      programEnabled: true,
      programName: "Artisan Guild Rewards",
      totalMembers: 142,
      activeMembers: 138,
      totalPointsIssued: 48950,
      totalPointsRedeemed: 16400,
      outstandingPointsLiability: 32550,
      outstandingValueInr: 32550,
      activeRewardsCount: 4,
      totalRedemptionsCount: 29,
      totalReferralsCreated: 58,
      totalReferralsQualified: 34,
      referralSalesInr: 62900,
    };
  }

  async getProgram(storeId = "store_main"): Promise<LoyaltyProgram> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/program?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) return await res.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return this.getStored(STORAGE_KEY_PROGRAM, DEFAULT_PROGRAM);
  }

  async updateProgram(storeId: string, update: Partial<LoyaltyProgram>): Promise<LoyaltyProgram> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/program?storeId=${storeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(update),
      });
      if (res.ok) return await res.json();
    } catch {}

    await new Promise((r) => setTimeout(r, 120));
    const current = this.getStored(STORAGE_KEY_PROGRAM, DEFAULT_PROGRAM);
    const merged: LoyaltyProgram = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.setStored(STORAGE_KEY_PROGRAM, merged);
    return merged;
  }

  async getStoreRewards(storeId = "store_main"): Promise<LoyaltyReward[]> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/rewards?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return this.getStored(STORAGE_KEY_REWARDS, DEFAULT_REWARDS);
  }

  async createReward(storeId: string, rewardData: Partial<LoyaltyReward>): Promise<LoyaltyReward> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/rewards?storeId=${storeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(rewardData),
      });
      if (res.ok) return await res.json();
    } catch {}

    await new Promise((r) => setTimeout(r, 120));
    const rewards = this.getStored(STORAGE_KEY_REWARDS, DEFAULT_REWARDS);
    const newReward: LoyaltyReward = {
      id: "rew_" + Date.now(),
      storeId,
      name: rewardData.name || "Special Craft Reward",
      description: rewardData.description || "",
      type: rewardData.type || "FIXED_AMOUNT_OFF",
      pointsCost: rewardData.pointsCost || 500,
      value: rewardData.value || 100,
      discountValue: rewardData.discountValue || rewardData.value || 100,
      minimumOrderValue: rewardData.minimumOrderValue || 0,
      maximumDiscount: rewardData.maximumDiscount,
      usageLimit: rewardData.usageLimit,
      perCustomerLimit: rewardData.perCustomerLimit || 1,
      enabled: rewardData.enabled ?? true,
      isActive: true,
    };
    rewards.unshift(newReward);
    this.setStored(STORAGE_KEY_REWARDS, rewards);
    return newReward;
  }

  async updateReward(rewardId: string, storeId: string, update: Partial<LoyaltyReward>): Promise<LoyaltyReward> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/rewards/${rewardId}?storeId=${storeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(update),
      });
      if (res.ok) return await res.json();
    } catch {}

    await new Promise((r) => setTimeout(r, 100));
    const rewards = this.getStored(STORAGE_KEY_REWARDS, DEFAULT_REWARDS);
    const item = rewards.find((r) => r.id === rewardId);
    if (!item) throw new Error("Reward not found");
    Object.assign(item, update);
    this.setStored(STORAGE_KEY_REWARDS, rewards);
    return item;
  }

  async deleteReward(rewardId: string, storeId: string): Promise<void> {
    try {
      await fetch(`/api/v1/merchant/loyalty/rewards/${rewardId}?storeId=${storeId}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {}

    const rewards = this.getStored(STORAGE_KEY_REWARDS, DEFAULT_REWARDS);
    const filtered = rewards.filter((r) => r.id !== rewardId);
    this.setStored(STORAGE_KEY_REWARDS, filtered);
  }

  async getMerchantMembers(storeId = "store_main"): Promise<LoyaltyAccount[]> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/members?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return [
      DEFAULT_ACCOUNT,
      {
        id: "loy_acc_02",
        storeId,
        customerId: "usr_customer_kavita",
        status: "ACTIVE",
        availablePoints: 2450,
        lifetimeEarnedPoints: 2450,
        lifetimeRedeemedPoints: 0,
        lifetimeExpiredPoints: 0,
        tier: "GOLD",
        tierDisplayName: "Master Patron",
        tierMultiplier: 1.25,
        pointsToNextTier: 1550,
        updatedAt: new Date().toISOString(),
      },
      {
        id: "loy_acc_03",
        storeId,
        customerId: "usr_customer_vikram",
        status: "ACTIVE",
        availablePoints: 450,
        lifetimeEarnedPoints: 450,
        lifetimeRedeemedPoints: 0,
        lifetimeExpiredPoints: 0,
        tier: "BRONZE",
        tierDisplayName: "Artisan Enthusiast",
        tierMultiplier: 1.0,
        pointsToNextTier: 50,
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async manualAdjustPoints(
    storeId: string,
    customerId: string,
    points: number,
    reason: string
  ): Promise<LoyaltyLedgerEntry> {
    if (!reason || !reason.trim()) {
      throw new Error("A reason is mandatory for manual audited point adjustments.");
    }
    if (points === 0) {
      throw new Error("Point adjustment cannot be zero.");
    }

    try {
      const res = await fetch(`/api/v1/merchant/loyalty/adjustments?storeId=${storeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ customerId, points, reason }),
      });
      if (res.ok) return await res.json();
    } catch {}

    await new Promise((r) => setTimeout(r, 120));
    const account = this.getStored(STORAGE_KEY_ACCOUNT, DEFAULT_ACCOUNT);
    if (points > 0) {
      account.availablePoints += points;
      account.lifetimeEarnedPoints += points;
    } else {
      account.availablePoints = Math.max(0, account.availablePoints + points);
    }
    this.setStored(STORAGE_KEY_ACCOUNT, account);

    const ledger = this.getStored(STORAGE_KEY_LEDGER, DEFAULT_LEDGER);
    const entry: LoyaltyLedgerEntry = {
      id: "led_" + Date.now(),
      storeId,
      customerId,
      type: "ADJUSTED",
      points,
      balanceAfter: account.availablePoints,
      referenceType: "MANUAL_ADJUSTMENT",
      description: `Staff adjustment: ${reason}`,
      createdAt: new Date().toISOString(),
    };
    ledger.unshift(entry);
    this.setStored(STORAGE_KEY_LEDGER, ledger);
    return entry;
  }

  // Merchant aliases & helpers
  async getMerchantProgram(storeId = "store_main"): Promise<LoyaltyProgram> {
    return this.getProgram(storeId);
  }

  async updateMerchantProgram(update: Partial<LoyaltyProgram>, storeId = "store_main"): Promise<LoyaltyProgram> {
    return this.updateProgram(storeId, update);
  }

  async getMerchantRewards(storeId = "store_main"): Promise<LoyaltyReward[]> {
    return this.getStoreRewards(storeId);
  }

  async createMerchantReward(rewardData: Partial<LoyaltyReward>, storeId = "store_main"): Promise<LoyaltyReward> {
    return this.createReward(storeId, rewardData);
  }

  async updateMerchantReward(rewardId: string, update: Partial<LoyaltyReward>, storeId = "store_main"): Promise<LoyaltyReward> {
    return this.updateReward(rewardId, storeId, update);
  }

  async getMerchantReferrals(storeId = "store_main"): Promise<CustomerReferral[]> {
    try {
      const res = await fetch(`/api/v1/merchant/loyalty/referrals?storeId=${storeId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 60));
    return [
      {
        id: "ref_m_01",
        storeId,
        referrerCustomerId: "usr_dev_customer_01",
        referrerName: "Priya Sharma",
        referrerEmail: "priya.sharma@example.com",
        referredCustomerId: "usr_friend_kavita",
        referredName: "Kavita Reddy",
        referredEmail: "kavita.reddy@example.com",
        referralCode: "BG-PRIYA25",
        referralUrl: "/ref/BG-PRIYA25",
        status: "REWARDED",
        qualifiedOrderId: "ord_9942",
        qualifiedOrderNumber: "ORD-2026-9942",
        referrerPointsAwarded: 500,
        referredPointsAwarded: 250,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
        qualifiedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        rewardedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "ref_m_02",
        storeId,
        referrerCustomerId: "usr_customer_vikram",
        referrerName: "Vikram Malhotra",
        referrerEmail: "vikram.m@example.com",
        referredCustomerId: "usr_friend_arun",
        referredName: "Arun Iyer",
        referredEmail: "arun.iyer@example.com",
        referralCode: "BG-VIKRAM10",
        referralUrl: "/ref/BG-VIKRAM10",
        status: "QUALIFIED",
        qualifiedOrderId: "ord_9981",
        qualifiedOrderNumber: "ORD-2026-9981",
        referrerPointsAwarded: 500,
        referredPointsAwarded: 250,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        qualifiedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ];
  }

  async adjustCustomerPoints(req: PointAdjustmentRequest, storeId = "store_main"): Promise<LoyaltyAccount> {
    const pointsDelta = req.isCredit ? Math.abs(req.points) : -Math.abs(req.points);
    await this.manualAdjustPoints(storeId, req.customerId, pointsDelta, req.reason);
    const members = await this.getMerchantMembers(storeId);
    const found = members.find((m) => m.customerId === req.customerId) || members[0];
    return {
      ...found,
      availablePoints: Math.max(0, found.availablePoints + pointsDelta),
      lifetimeEarnedPoints: pointsDelta > 0 ? found.lifetimeEarnedPoints + pointsDelta : found.lifetimeEarnedPoints,
    };
  }

  // ── Public Referral Attribution ────────────────────────────────────────

  async recordReferralAttribution(code: string, storeId = "store_main"): Promise<CustomerReferral> {
    try {
      const res = await fetch(`/api/v1/public/ref/attribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: code, storeId }),
      });
      if (res.ok) return await res.json();
    } catch {}

    // Store in cookie or localStorage for attribution during checkout
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("bhagya_pending_referral_code", code);
      } catch {}
    }

    return {
      id: "ref_guest_" + Date.now(),
      storeId,
      referrerCustomerId: "usr_patron",
      referralCode: code,
      referralUrl: `/ref/${code}`,
      status: "CLICKED",
      createdAt: new Date().toISOString(),
    };
  }
}

export const loyaltyService = new LoyaltyService();
