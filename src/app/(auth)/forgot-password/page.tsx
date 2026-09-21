import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Forgot password",
  description: "Reset your Bhagya Commerce password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink">Reset your password</h1>
        <p className="text-body-sm text-ink-soft">
          Tell us your email and we will send a link to set a new password.
        </p>
      </header>
      <ForgotPasswordForm />
    </>
  );
}
