/**
 * Bhagya Commerce — Customer & Merchant Authentication Types
 *
 * Core Identity Principle:
 * Every user has ONE unified identity. A user is a Customer by default,
 * and can obtain Organization Membership (to create/manage a Store) without
 * creating a separate account.
 */

export interface OrganizationMembership {
  organizationId: string;
  organizationName: string;
  role: "owner" | "admin" | "member";
  storeId?: string;
  storeName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: "customer" | "merchant" | "admin";
  organizationMembership?: OrganizationMembership | null;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthSession {
  user: User;
  token?: string;
  expiresAt?: string;
}

export interface LoginRequest {
  emailOrPhone: string;
  password?: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  intent?: "shop" | "sell-later";
}

export interface VerifyOtpRequest {
  code: string;
  emailOrPhone?: string;
  purpose?: "registration" | "login" | "reset";
}

export interface ResendOtpRequest {
  emailOrPhone?: string;
  purpose?: "registration" | "login" | "reset";
}

export interface ForgotPasswordRequest {
  emailOrPhone: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
  token?: string;
  emailOrPhone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session?: AuthSession;
  requiresOtp?: boolean;
  otpDestination?: string;
  message?: string;
}

export interface PendingVerificationState {
  emailOrPhone: string;
  purpose: "registration" | "login" | "reset";
  expiresAt: number;
}
