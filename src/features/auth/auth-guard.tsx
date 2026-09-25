"use client";

import { LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { authRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 py-16">
        <div className="size-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
        <p className="text-body-sm text-ink-soft">Loading your account details…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    const loginHref = `${authRoutes.login}?redirect=${encodeURIComponent(pathname || "/account")}`;
    const registerHref = `${authRoutes.register}?redirect=${encodeURIComponent(pathname || "/account")}`;

    return (
      <div className="mx-auto max-w-xl py-6">
        <Card variant="surface" padding="lg" radius="xl" className="shadow-card text-center border-line">
          <CardContent className="flex flex-col items-center gap-5 py-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-gold-soft text-gold-dark dark:text-gold border border-gold/20 shadow-xs">
              <LockKeyhole className="size-6" />
            </div>

            <div className="flex flex-col gap-2 max-w-md">
              <h2 className="font-display text-heading-xl font-semibold text-ink">
                Sign in to view your account
              </h2>
              <p className="text-body-sm text-ink-soft leading-relaxed">
                Access your orders, saved delivery addresses, wishlist items, and account preferences securely in one place.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs pt-2">
              <Button asChild variant="primary" size="lg" fullWidth>
                <Link href={loginHref as any}>Sign in</Link>
              </Button>
              <Button asChild variant="outline" size="lg" fullWidth>
                <Link href={registerHref as any}>Create account</Link>
              </Button>
            </div>

            <div className="flex items-center gap-1.5 text-caption text-ink-faint pt-2">
              <Sparkles className="size-3.5 text-gold-dark dark:text-gold" />
              <span>One unified identity for shopping and selling</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
