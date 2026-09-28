import type {
  BillingInvoice,
  BillingOverviewData,
  BillingProfile,
  MerchantPlan,
  MerchantSubscription,
} from "@/features/merchant/billing/billing-types";

const PLANS: MerchantPlan[] = [
  {
    id: "plan_starter",
    name: "Starter Artisan",
    description: "For emerging craftspeople taking their first steps online.",
    monthlyPriceInr: 0,
    yearlyPriceInr: 0,
    commissionPercent: 4.5,
    maxProducts: 25,
    customDomainEnabled: false,
    aiTier: "NONE",
    storageLimitGb: 2,
    features: [
      "Up to 25 products",
      "Standard storefront",
      "4.5% transaction fee",
      "Community support",
      "Basic sales dashboard",
    ],
  },
  {
    id: "plan_growth",
    name: "Growth Guild",
    description: "For established artisan studios scaling direct craft sales.",
    monthlyPriceInr: 999,
    yearlyPriceInr: 9990,
    commissionPercent: 2.5,
    maxProducts: 250,
    customDomainEnabled: true,
    aiTier: "STANDARD",
    storageLimitGb: 10,
    features: [
      "Up to 250 products",
      "Custom domain & SSL",
      "2.5% transaction fee",
      "Bhagya AI Craft Storyteller",
      "Automated WhatsApp tracking updates",
      "Priority artisan support",
    ],
  },
  {
    id: "plan_pro",
    name: "Master Guild Pro",
    description: "For high-volume artisan cooperatives and master weavers.",
    monthlyPriceInr: 2499,
    yearlyPriceInr: 24990,
    commissionPercent: 1.5,
    maxProducts: 1500,
    customDomainEnabled: true,
    aiTier: "ADVANCED",
    storageLimitGb: 50,
    features: [
      "Up to 1,500 products",
      "White-label custom storefront",
      "1.5% transaction fee",
      "Advanced AI inventory & pricing assistant",
      "Multi-staff accounts (5 seats)",
      "Dedicated account manager",
    ],
  },
  {
    id: "plan_enterprise",
    name: "Artisan Heritage Enterprise",
    description: "For state handicraft federations and heritage clusters.",
    monthlyPriceInr: 5999,
    yearlyPriceInr: 59990,
    commissionPercent: 0.9,
    maxProducts: 10000,
    customDomainEnabled: true,
    aiTier: "UNLIMITED",
    storageLimitGb: 200,
    features: [
      "Unlimited handcrafted products",
      "Multi-cluster store network",
      "0.9% transaction fee",
      "Custom AI copilot training on craft archive",
      "Unlimited staff seats",
      "24/7 SLA telephone support",
    ],
  },
];

let activeSubscription: MerchantSubscription = {
  id: "sub_org_active_01",
  organizationId: "org_dev_merchant",
  planId: "plan_growth",
  planName: "Growth Guild",
  status: "ACTIVE",
  billingInterval: "MONTHLY",
  provider: "MOCK_RAZORPAY",
  providerSubscriptionId: "sub_rzp_884910294",
  currentPeriodStart: new Date(Date.now() - 14 * 86400000).toISOString(),
  currentPeriodEnd: new Date(Date.now() + 16 * 86400000).toISOString(),
  cancelAtPeriodEnd: false,
  createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

let activeProfile: BillingProfile = {
  organizationId: "org_dev_merchant",
  legalBusinessName: "Tula Organics & Handlooms Pvt Ltd",
  gstin: "33AABCT9981F1Z8",
  billingEmail: "billing@tulaorganics.in",
  billingPhone: "+91 98401 23456",
  addressLine1: "42, Weaver Colony, Gandhi Nagar",
  addressLine2: "Near Heritage Handloom Center",
  city: "Coimbatore",
  state: "Tamil Nadu",
  postalCode: "641001",
  country: "India",
  updatedAt: new Date().toISOString(),
};

let activeInvoices: BillingInvoice[] = [
  {
    id: "bi_2026_09",
    invoiceNumber: "SUB-2026-98124",
    organizationId: "org_dev_merchant",
    subscriptionId: "sub_org_active_01",
    planId: "plan_growth",
    planName: "Growth Guild",
    periodStart: new Date(Date.now() - 14 * 86400000).toISOString(),
    periodEnd: new Date(Date.now() + 16 * 86400000).toISOString(),
    subtotal: 999,
    tax: 179.82, // 18% SaaS GST
    total: 1178.82,
    currency: "INR",
    status: "PAID",
    paymentMethod: "HDFC Business Card ending in 4092",
    paidAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    issuedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "bi_2026_08",
    invoiceNumber: "SUB-2026-87102",
    organizationId: "org_dev_merchant",
    subscriptionId: "sub_org_active_01",
    planId: "plan_growth",
    planName: "Growth Guild",
    periodStart: new Date(Date.now() - 44 * 86400000).toISOString(),
    periodEnd: new Date(Date.now() - 14 * 86400000).toISOString(),
    subtotal: 999,
    tax: 179.82,
    total: 1178.82,
    currency: "INR",
    status: "PAID",
    paymentMethod: "HDFC Business Card ending in 4092",
    paidAt: new Date(Date.now() - 44 * 86400000).toISOString(),
    issuedAt: new Date(Date.now() - 44 * 86400000).toISOString(),
  },
];

export const billingService = {
  async getBillingOverview(): Promise<BillingOverviewData> {
    return Promise.resolve({
      subscription: { ...activeSubscription },
      profile: { ...activeProfile },
      plans: [...PLANS],
      invoices: [...activeInvoices],
    });
  },

  async getPlans(): Promise<MerchantPlan[]> {
    return Promise.resolve([...PLANS]);
  },

  async getSubscription(): Promise<MerchantSubscription> {
    return Promise.resolve({ ...activeSubscription });
  },

  async changePlan(newPlanId: string): Promise<MerchantSubscription> {
    const plan = PLANS.find((p) => p.id === newPlanId) || PLANS[1];
    activeSubscription = {
      ...activeSubscription,
      planId: plan.id,
      planName: plan.name,
      status: "ACTIVE",
      cancelAtPeriodEnd: false,
      updatedAt: new Date().toISOString(),
    };

    if (plan.monthlyPriceInr > 0) {
      const tax = Math.round(plan.monthlyPriceInr * 0.18 * 100) / 100;
      const newInvoice: BillingInvoice = {
        id: `bi_${Date.now()}`,
        invoiceNumber: `SUB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        organizationId: "org_dev_merchant",
        subscriptionId: activeSubscription.id,
        planId: plan.id,
        planName: plan.name,
        periodStart: new Date().toISOString(),
        periodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
        subtotal: plan.monthlyPriceInr,
        tax,
        total: plan.monthlyPriceInr + tax,
        currency: "INR",
        status: "PAID",
        paymentMethod: "HDFC Business Card ending in 4092",
        paidAt: new Date().toISOString(),
        issuedAt: new Date().toISOString(),
      };
      activeInvoices = [newInvoice, ...activeInvoices];
    }

    return Promise.resolve({ ...activeSubscription });
  },

  async cancelSubscription(): Promise<MerchantSubscription> {
    activeSubscription = {
      ...activeSubscription,
      cancelAtPeriodEnd: true,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ ...activeSubscription });
  },

  async resumeSubscription(): Promise<MerchantSubscription> {
    activeSubscription = {
      ...activeSubscription,
      cancelAtPeriodEnd: false,
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ ...activeSubscription });
  },

  async updateBillingProfile(updated: Partial<BillingProfile>): Promise<BillingProfile> {
    activeProfile = {
      ...activeProfile,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    return Promise.resolve({ ...activeProfile });
  },

  async getInvoices(): Promise<BillingInvoice[]> {
    return Promise.resolve([...activeInvoices]);
  },
};
