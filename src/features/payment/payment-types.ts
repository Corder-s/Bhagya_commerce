import type { Address, CheckoutContact } from "@/features/checkout/checkout-types";
import type { CartItem } from "@/features/cart/cart-types";

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

export type PaymentStatus =
  | "created"
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "cancelled"
  | "refunded";

export interface Payment {
  id: string;
  orderId?: string;
  orderNumber?: string;
  orderReference?: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  provider?: string;
  providerPaymentId?: string;
  idempotencyKey?: string;
  methodDetails?: {
    upiId?: string;
    cardLast4?: string;
    cardNetwork?: string;
    bankName?: string;
    walletProvider?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSession {
  sessionId: string;
  orderReference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  provider?: string;
  checkoutUrl?: string;
  idempotencyKey?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface PaymentSessionRequest {
  amount: number;
  currency: string;
  orderReference?: string;
  method: PaymentMethod;
  idempotencyKey?: string;
  contact: CheckoutContact;
  shippingAddress: Address;
  items?: CartItem[];
  metadata?: Record<string, unknown>;
}

export type MockOutcome = "SUCCESS" | "FAILED" | "PENDING" | "CANCELLED";

export interface PaymentVerificationRequest {
  sessionId: string;
  paymentId?: string;
  signature?: string;
  method: PaymentMethod;
  mockOutcome?: MockOutcome;
}

export interface PaymentVerificationResponse {
  success: boolean;
  status: PaymentStatus;
  paymentId: string;
  orderId?: string;
  orderNumber?: string;
  message: string;
  capturedAt?: string;
}

export interface PaymentProvider {
  createSession(request: PaymentSessionRequest): Promise<PaymentSession>;
  verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  cancelPayment(paymentId: string): Promise<boolean>;
  retryPayment(paymentId: string): Promise<PaymentSession>;
}
