import type { Metadata } from "next";
import * as React from "react";

import { LoginForm } from "@/features/auth/login-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Sign in",
  description: "Sign in to your Bhagya Commerce account.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink font-display">Welcome back</h1>
        <p className="text-body-sm text-ink-soft">
          Sign in to see your orders, wishlist, and saved addresses.
        </p>
      </header>
      <React.Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-surface-raised" />}>
        <LoginForm />
      </React.Suspense>
    </>
  );
}
