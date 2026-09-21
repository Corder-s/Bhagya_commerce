import type { ReactNode } from "react";

import { AuthShell } from "@/components/layout/auth-shell";

/**
 * Auth route group — login, register, OTP and password recovery.
 *
 * These routes deliberately drop the storefront chrome: authentication is a
 * single-task moment, and the shell removes navigation rather than shrinking it.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
