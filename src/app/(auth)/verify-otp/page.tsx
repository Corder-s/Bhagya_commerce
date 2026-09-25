import type { Metadata } from "next";
import * as React from "react";

import { VerifyOtpForm } from "@/features/auth/verify-otp-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Verify your account",
  description: "Verify your one-time code to continue.",
  path: "/verify-otp",
  noIndex: true,
});

export default function VerifyOtpPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink font-display">Verify your account</h1>
        <p className="text-body-sm text-ink-soft">
          Enter the six-digit verification code sent to your registered device.
        </p>
      </header>
      <React.Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-surface-raised" />}>
        <VerifyOtpForm />
      </React.Suspense>
    </>
  );
}
