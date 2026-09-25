/**
 * =====================================================================
 * Mock Payment Provider (Step 5)
 * =====================================================================
 *
 * This is an isolated, mock implementation of the PaymentProvider interface.
 * It provides deterministic outcomes (SUCCESS, FAILED, PENDING, CANCELLED)
 * for testing and verification without contacting external gateways.
 *
 * SECURITY & ARCHITECTURAL BOUNDARY:
 * - Real card credentials, CVVs, bank passwords, and UPI PINs MUST NEVER be stored.
 * - In production, this provider will be replaced by:
 *     1. Frontend calls POST /api/v1/payments/session (Java Spring Boot)
 *     2. Spring Boot creates gateway session with Razorpay / Cashfree
 *     3. Frontend opens Razorpay Checkout / Cashfree SDK popup
 *     4. Payment completed on gateway
 *     5. Gateway webhook notifies Spring Boot backend
 *     6. Backend verifies webhook HMAC SHA256 signature and captures payment
 *     7. Frontend polling/redirect fetches verified status from backend
 * =====================================================================
 */

import type {
  MockOutcome,
  PaymentProvider,
  PaymentSession,
  PaymentSessionRequest,
  PaymentStatus,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from "../payment-types";

export class MockPaymentProvider implements PaymentProvider {
  private sessions = new Map<string, PaymentSession>();
  private defaultOutcome: MockOutcome = "SUCCESS";

  /**
   * Set default simulation outcome for test scenarios
   */
  setDefaultOutcome(outcome: MockOutcome): void {
    this.defaultOutcome = outcome;
  }

  /**
   * Create an isolated mock payment session
   */
  async createSession(request: PaymentSessionRequest): Promise<PaymentSession> {
    // Simulated network handoff latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    const sessionId = `sess_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const orderReference = request.orderReference || `ref_bg_${Date.now()}`;

    const session: PaymentSession = {
      sessionId,
      orderReference,
      amount: request.amount,
      currency: request.currency,
      status: "created",
      method: request.method,
      provider: "mock_bhagya_gateway",
      idempotencyKey: request.idempotencyKey,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Verify mock payment outcome deterministically
   */
  async verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResponse> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const outcome = request.mockOutcome || this.defaultOutcome;
    const paymentId = request.paymentId || `pay_mock_${Date.now()}`;

    switch (outcome) {
      case "SUCCESS": {
        const session = this.sessions.get(request.sessionId);
        if (session) {
          session.status = "captured";
        }
        return {
          success: true,
          status: "captured",
          paymentId,
          orderId: session?.orderReference,
          message: "Payment captured successfully.",
          capturedAt: new Date().toISOString(),
        };
      }

      case "FAILED": {
        const session = this.sessions.get(request.sessionId);
        if (session) {
          session.status = "failed";
        }
        return {
          success: false,
          status: "failed",
          paymentId,
          message: "Payment could not be completed. Transaction declined by bank.",
        };
      }

      case "PENDING": {
        const session = this.sessions.get(request.sessionId);
        if (session) {
          session.status = "pending";
        }
        return {
          success: false,
          status: "pending",
          paymentId,
          message: "Your payment is being processed by the bank.",
        };
      }

      case "CANCELLED": {
        const session = this.sessions.get(request.sessionId);
        if (session) {
          session.status = "cancelled";
        }
        return {
          success: false,
          status: "cancelled",
          paymentId,
          message: "Payment was cancelled by the user.",
        };
      }

      default: {
        return {
          success: true,
          status: "captured",
          paymentId,
          message: "Payment captured.",
        };
      }
    }
  }

  /**
   * Check status of a payment
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    // For mock testing, check if any session has this ID or return captured
    return "captured";
  }

  /**
   * Cancel an active payment session
   */
  async cancelPayment(paymentId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return true;
  }

  /**
   * Retry a payment session
   */
  async retryPayment(paymentId: string): Promise<PaymentSession> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newSessionId = `sess_retry_${Date.now()}`;
    const session: PaymentSession = {
      sessionId: newSessionId,
      orderReference: `ref_bg_${Date.now()}`,
      amount: 0,
      currency: "INR",
      status: "created",
      method: "upi",
      provider: "mock_bhagya_gateway",
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(newSessionId, session);
    return session;
  }
}

export const mockPaymentProvider = new MockPaymentProvider();
