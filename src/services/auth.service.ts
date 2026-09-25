/**
 * Authentication Service
 *
 * Frontend service abstraction prepared for future Spring Boot REST API:
 *  - POST /api/v1/auth/register
 *  - POST /api/v1/auth/login
 *  - POST /api/v1/auth/verify-otp
 *  - POST /api/v1/auth/resend-otp
 *  - POST /api/v1/auth/forgot-password
 *  - POST /api/v1/auth/reset-password
 *  - POST /api/v1/auth/refresh
 *  - POST /api/v1/auth/logout
 *  - GET  /api/v1/auth/me
 */

import { authStorage } from "@/lib/storage/auth-storage";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendOtpRequest,
  ResetPasswordRequest,
  User,
  VerifyOtpRequest,
} from "@/types/auth";

// Initial demo user for convenient testing
const DEMO_USER: User = {
  id: "usr_aarav_01",
  name: "Aarav Sharma",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  avatarUrl: null,
  emailVerified: true,
  phoneVerified: true,
  role: "customer",
  organizationMembership: {
    organizationId: "org_artisan_01",
    organizationName: "Varanasi Silk Guild",
    role: "owner",
    storeId: "store_varanasi_silk",
    storeName: "Varanasi Heritage Silks",
  },
  createdAt: "2026-01-15T08:30:00.000Z",
};

// Internal mock user store for registration/login simulation
const mockUsersByEmail: Record<string, User> = {
  [DEMO_USER.email.toLowerCase()]: DEMO_USER,
};

class AuthService {
  /**
   * Log in user with email/phone and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const input = credentials.emailOrPhone.trim().toLowerCase();
    const password = credentials.password ?? "";

    // Check existing mock user or allow demo credentials
    let user = mockUsersByEmail[input];

    if (!user) {
      // If user logs in with phone or matches demo
      if (input === "aarav" || input === "9876543210" || input === "+91 98765 43210") {
        user = DEMO_USER;
      } else if (input.includes("@") && password.length >= 6) {
        // Auto-provision demo account for standard email testing
        user = {
          id: `usr_${Date.now()}`,
          name: input.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          email: input,
          emailVerified: true,
          phoneVerified: false,
          role: "customer",
          organizationMembership: null,
          createdAt: new Date().toISOString(),
        };
        mockUsersByEmail[input] = user;
      }
    }

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password. Please check your credentials.",
      };
    }

    // Save active profile in non-sensitive authStorage
    authStorage.setUser(user);

    return {
      success: true,
      user,
      session: {
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  }

  /**
   * Register a new customer
   */
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 450));

    const email = payload.email.trim().toLowerCase();

    // Check duplicate account
    if (mockUsersByEmail[email] && mockUsersByEmail[email].id === DEMO_USER.id) {
      return {
        success: false,
        message: "An account with this email address already exists. Please sign in instead.",
      };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: payload.name.trim(),
      email,
      phone: payload.phone?.trim() || undefined,
      avatarUrl: null,
      emailVerified: false,
      phoneVerified: Boolean(payload.phone),
      role: "customer",
      organizationMembership: payload.intent === "sell-later" ? null : null,
      createdAt: new Date().toISOString(),
    };

    mockUsersByEmail[email] = newUser;

    // Save pending verification state in session storage
    authStorage.setPendingVerification({
      emailOrPhone: email,
      purpose: "registration",
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    return {
      success: true,
      user: newUser,
      requiresOtp: true,
      otpDestination: payload.phone || email,
      message: "Registration successful. Please verify the code sent to your device.",
    };
  }

  /**
   * Verify one-time password code
   */
  async verifyOtp(payload: VerifyOtpRequest): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanCode = payload.code.trim();

    // Simulated validation: accept any 6-digit number or test code
    if (!/^\d{6}$/.test(cleanCode)) {
      return {
        success: false,
        message: "Invalid code. Please enter a valid 6-digit verification code.",
      };
    }

    // Reject simulated failure code
    if (cleanCode === "000000") {
      return {
        success: false,
        message: "The verification code has expired. Please request a new code.",
      };
    }

    const pending = authStorage.getPendingVerification();
    const email = payload.emailOrPhone || pending?.emailOrPhone || DEMO_USER.email;
    let user = mockUsersByEmail[email.toLowerCase()];

    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        emailVerified: true,
        phoneVerified: true,
        role: "customer",
        organizationMembership: null,
        createdAt: new Date().toISOString(),
      };
      mockUsersByEmail[email.toLowerCase()] = user;
    } else {
      user = { ...user, emailVerified: true };
      mockUsersByEmail[email.toLowerCase()] = user;
    }

    authStorage.clearPendingVerification();
    authStorage.setUser(user);

    return {
      success: true,
      user,
      session: {
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      message: "Account verified successfully.",
    };
  }

  /**
   * Resend verification OTP
   */
  async resendOtp(payload?: ResendOtpRequest): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const pending = authStorage.getPendingVerification();
    const destination = payload?.emailOrPhone || pending?.emailOrPhone || "your registered device";

    return {
      success: true,
      message: `A new verification code was sent to ${destination}.`,
    };
  }

  /**
   * Request password recovery link/code
   */
  async forgotPassword(_payload: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Never reveal if an account exists to avoid account enumeration
    return {
      success: true,
      message: "If an account exists for this address, password recovery instructions have been sent.",
    };
  }

  /**
   * Reset password with reset token
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (payload.newPassword.length < 8) {
      return {
        success: false,
        message: "Password must be at least 8 characters long.",
      };
    }
    return {
      success: true,
      message: "Your password has been successfully reset. You can now sign in with your new password.",
    };
  }

  /**
   * Retrieve currently authenticated user profile
   */
  async getCurrentUser(): Promise<User | null> {
    return authStorage.getUser();
  }

  /**
   * Refresh authentication session
   */
  async refreshSession(): Promise<AuthResponse | null> {
    const user = authStorage.getUser();
    if (!user) return null;
    return {
      success: true,
      user,
      session: {
        user,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  }

  /**
   * Log out currently authenticated user
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    authStorage.clearUser();
    authStorage.clearPendingVerification();
  }
}

export const authService = new AuthService();
