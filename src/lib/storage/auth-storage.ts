/**
 * Auth Storage Abstraction
 *
 * Security Rules:
 * 1. NEVER store passwords, plaintext credentials, or private secrets in localStorage.
 * 2. Only store non-sensitive profile state needed for instantaneous client-side UI hydration.
 * 3. Architecture is fully prepared for HTTP-only cookies in future Spring Boot integration.
 */

import type { PendingVerificationState, User } from "@/types/auth";

const AUTH_USER_KEY = "bhagya_auth_user";
const PENDING_VERIFICATION_KEY = "bhagya_pending_verification";

export const authStorage = {
  getUser(): User | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch {
      // Storage quota exceeded or disabled
    }
  },

  clearUser(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Ignore
    }
  },

  getPendingVerification(): PendingVerificationState | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(PENDING_VERIFICATION_KEY);
      if (!raw) return null;
      const parsed: PendingVerificationState = JSON.parse(raw);
      if (Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  setPendingVerification(state: PendingVerificationState): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(state));
    } catch {
      // Ignore
    }
  },

  clearPendingVerification(): void {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
    } catch {
      // Ignore
    }
  },
};
