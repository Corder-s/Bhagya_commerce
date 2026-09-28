export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "PAUSED"
  | "CANCELLED"
  | "EXPIRED";

export interface MerchantPlan {
  id: string;
  name: string;
  description: string;
  monthlyPriceInr: number;
  yearlyPriceInr: number;
  commissionPercent: number;
  maxProducts: number;
  customDomainEnabled: boolean;
  aiTier: "NONE" | "STANDARD" | "ADVANCED" | "UNLIMITED";
  storageLimitGb: number;
  features: string[];
}

export interface MerchantSubscription {
  id: string;
  organizationId: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  billingInterval: "MONTHLY" | "YEARLY";
  provider: string;
  providerSubscriptionId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingProfile {
  organizationId: string;
  legalBusinessName: string;
  gstin?: string;
  billingEmail: string;
  billingPhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  updatedAt?: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  periodStart: string;
  periodEnd: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED";
  paymentMethod: string;
  paidAt?: string;
  issuedAt: string;
}

export interface BillingOverviewData {
  subscription: MerchantSubscription;
  profile: BillingProfile;
  plans: MerchantPlan[];
  invoices: BillingInvoice[];
}
