/**
 * =====================================================================
 * Bhagya Commerce Payment Service Abstraction (Step 5)
 * =====================================================================
 *
 * This service provides a provider-neutral gateway abstraction for all payment
 * operations. It delegates to the currently active payment provider (MockPaymentProvider
 * in dev/testing, Razorpay/Cashfree via Java Spring Boot in production).
 *
 * FUTURE BACKEND ARCHITECTURE (Spring Boot API):
 * 1. Frontend: POST /api/v1/payments/session with Idempotency-Key header
 * 2. Spring Boot API:
 *    - Validates cart & price breakdown from PostgreSQL database
 *    - Executes inventory reservation (pessimistic lock / redis lock)
 *    - Calls Razorpay/Cashfree Order API with secret keys
 *    - Returns signed payment session object to frontend
 * 3. Gateway Checkout:
 *    - Customer authorizes payment via UPI / Card / NetBanking
 * 4. Webhook Reconciliation:
 *    - Gateway sends POST /api/v1/payments/webhook to Spring Boot
 *    - Backend verifies HMAC-SHA256 signature
 *    - Backend marks payment captured & commits inventory
 *    - Backend generates authoritative Order ID (BG-YYYYMMDD-XXXXXX)
 *    - Triggers transactional SMS/WhatsApp & Email notification
 * =====================================================================
 */

import type {
  MockOutcome,
  PaymentMethod,
  PaymentProvider,
  PaymentSession,
  PaymentSessionRequest,
  PaymentStatus,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from "./payment-types";
import { mockPaymentProvider } from "./providers/mock-payment.provider";

/**
 * Generate a client idempotency key to prevent double submission
 */
export function createIdempotencyKey(prefix = "pay"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

class PaymentService {
  private activeProvider: PaymentProvider;

  constructor(provider: PaymentProvider = mockPaymentProvider) {
    this.activeProvider = provider;
  }

  /**
   * Swap the active provider (e.g., for testing or future Razorpay/Cashfree adapter)
   */
  setProvider(provider: PaymentProvider): void {
    this.activeProvider = provider;
  }

  /**
   * Set test outcome for the mock provider
   */
  setMockOutcome(outcome: MockOutcome): void {
    if ("setDefaultOutcome" in this.activeProvider) {
      (this.activeProvider as typeof mockPaymentProvider).setDefaultOutcome(outcome);
    }
  }

  /**
   * Create a secure payment session
   */
  async createPaymentSession(request: PaymentSessionRequest): Promise<PaymentSession> {
    if (!request.idempotencyKey) {
      request.idempotencyKey = createIdempotencyKey();
    }
    return this.activeProvider.createSession(request);
  }

  /**
   * Verify a completed payment
   * NOTE: In production, frontend never independently trusts verification.
   * Spring Boot backend handles webhook signature verification.
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    return this.activeProvider.verifyPayment(request);
  }

  /**
   * Query status of a payment by ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    return this.activeProvider.getPaymentStatus(paymentId);
  }

  /**
   * Cancel an in-flight payment
   */
  async cancelPayment(paymentId: string): Promise<boolean> {
    return this.activeProvider.cancelPayment(paymentId);
  }

  /**
   * Retry a payment session
   */
  async retryPayment(paymentId: string): Promise<PaymentSession> {
    return this.activeProvider.retryPayment(paymentId);
  }
}

export const paymentService = new PaymentService();
