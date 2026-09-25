"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { authStorage } from "@/lib/storage/auth-storage";
import { toast } from "@/lib/toast";
import type {
  ForgotPasswordRequest,
  LoginRequest,
  PendingVerificationState,
  RegisterRequest,
  ResetPasswordRequest,
  User,
  VerifyOtpRequest,
} from "@/types/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerification: PendingVerificationState | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (payload: RegisterRequest) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  forgotPassword: (emailOrPhone: string) => Promise<boolean>;
  resetPassword: (newPassword: string, token?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [pendingVerification, setPendingVerification] =
    React.useState<PendingVerificationState | null>(null);

  // Initialize session on mount from non-sensitive storage
  React.useEffect(() => {
    try {
      const storedUser = authStorage.getUser();
      const storedPending = authStorage.getPendingVerification();
      if (storedUser) {
        setUser(storedUser);
      }
      if (storedPending) {
        setPendingVerification(storedPending);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = React.useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        const res = await authService.login(credentials);
        if (res.success && res.user) {
          setUser(res.user);
          toast.success("Welcome back", `Signed in as ${res.user.name}`);
          return true;
        } else {
          toast.error("Sign in failed", res.message || "Invalid credentials");
          return false;
        }
      } catch {
        toast.error("Network Error", "Unable to connect to authentication service.");
        return false;
      }
    },
    [],
  );

  const register = React.useCallback(
    async (payload: RegisterRequest): Promise<boolean> => {
      try {
        const res = await authService.register(payload);
        if (res.success) {
          const pending = authStorage.getPendingVerification();
          setPendingVerification(pending);
          toast.success("Account created", "Please verify your account to continue.");
          return true;
        } else {
          toast.error("Registration failed", res.message || "Could not complete registration.");
          return false;
        }
      } catch {
        toast.error("Registration Error", "An error occurred during registration.");
        return false;
      }
    },
    [],
  );

  const verifyOtp = React.useCallback(
    async (code: string): Promise<boolean> => {
      try {
        const res = await authService.verifyOtp({ code });
        if (res.success && res.user) {
          setUser(res.user);
          setPendingVerification(null);
          toast.success("Account verified", `Welcome to Bhagya, ${res.user.name}!`);
          return true;
        } else {
          toast.error("Verification failed", res.message || "Invalid or expired code.");
          return false;
        }
      } catch {
        toast.error("Verification Error", "Unable to verify code at this time.");
        return false;
      }
    },
    [],
  );

  const resendOtp = React.useCallback(async (): Promise<boolean> => {
    try {
      const res = await authService.resendOtp();
      if (res.success) {
        toast.info("Code resent", res.message);
        return true;
      }
      return false;
    } catch {
      toast.error("Error", "Could not resend verification code.");
      return false;
    }
  }, []);

  const forgotPassword = React.useCallback(
    async (emailOrPhone: string): Promise<boolean> => {
      try {
        const res = await authService.forgotPassword({ emailOrPhone });
        toast.info("Recovery requested", res.message);
        return true;
      } catch {
        toast.error("Error", "Unable to process password reset request.");
        return false;
      }
    },
    [],
  );

  const resetPassword = React.useCallback(
    async (newPassword: string, token?: string): Promise<boolean> => {
      try {
        const res = await authService.resetPassword({ newPassword, token });
        if (res.success) {
          toast.success("Password updated", res.message);
          return true;
        } else {
          toast.error("Password reset failed", res.message);
          return false;
        }
      } catch {
        toast.error("Error", "Unable to reset password.");
        return false;
      }
    },
    [],
  );

  const logout = React.useCallback(async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    setPendingVerification(null);
    toast.info("Signed out", "You have been safely signed out.");
    router.push("/");
  }, [router]);

  const refreshUser = React.useCallback(async (): Promise<void> => {
    const res = await authService.refreshSession();
    if (res?.user) {
      setUser(res.user);
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      pendingVerification,
      login,
      register,
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
      logout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      pendingVerification,
      login,
      register,
      verifyOtp,
      resendOtp,
      forgotPassword,
      resetPassword,
      logout,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
