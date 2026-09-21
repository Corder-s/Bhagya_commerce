import type { Metadata } from "next";

import { VerifyOtpForm } from "@/features/auth/verify-otp-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Verify your number",
  description: "Verify your phone number to continue.",
  path: "/verify-otp",
  noIndex: true,
});

export default function VerifyOtpPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink">Verify your number</h1>
        <p className="text-body-sm text-ink-soft">
          We sent a six-digit code to the phone number on your account.
        </p>
      </header>
      <VerifyOtpForm />
    </>
  );
}
