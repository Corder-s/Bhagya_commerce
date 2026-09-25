import type { Metadata } from "next";
import * as React from "react";

import { RegisterForm } from "@/features/auth/register-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Create account",
  description:
    "Create one Bhagya Commerce account — shop now, and add a store to the same account whenever you are ready.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink font-display">Create your account</h1>
        <p className="text-body-sm text-ink-soft">
          One unified account for shopping and managing your orders.
        </p>
      </header>
      <React.Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-surface-raised" />}>
        <RegisterForm />
      </React.Suspense>
    </>
  );
}
