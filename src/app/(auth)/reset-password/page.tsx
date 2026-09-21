import type { Metadata } from "next";

import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { constructMetadata } from "@/config/seo";

export const metadata: Metadata = constructMetadata({
  title: "Set a new password",
  description: "Choose a new password for your Bhagya Commerce account.",
  path: "/reset-password",
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <>
      <header className="mb-7 flex flex-col gap-2">
        <h1 className="text-heading-xl text-ink">Set a new password</h1>
        <p className="text-body-sm text-ink-soft">
          Pick something you have not used on Bhagya before.
        </p>
      </header>
      <ResetPasswordForm />
    </>
  );
}
