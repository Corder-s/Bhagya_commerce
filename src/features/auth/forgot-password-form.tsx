"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthNotice } from "@/features/auth/auth-notice";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SuccessState } from "@/components/ui/success-state";
import { authRoutes } from "@/config/routes";
import { toast } from "@/lib/toast";

/**
 * ForgotPasswordForm.
 *
 * Two states in one route: request, then a confirmation that the email was sent.
 * The confirmation is deliberately neutral about whether the address exists —
 * that is the correct behaviour for account enumeration, and it is why the copy
 * says "if an account exists" rather than "we emailed you".
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That does not look like an email address");
      return;
    }

    setError(undefined);
    setSubmitting(true);
    // Phase 2: POST /auth/password/forgot
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    setSent(true);
    toast.info(
      "Reset emails are not sent yet",
      "Password recovery is part of Phase 2.",
    );
  }

  if (sent) {
    return (
      <SuccessState
        title="Check your inbox"
        description={`If an account exists for ${email}, a reset link is on its way. The link stays valid for 30 minutes.`}
        details={[
          { label: "Sent to", value: email },
          { label: "Next step", value: "Open the link to set a new password" },
        ]}
        actions={
          <>
            <Button asChild variant="outline" size="md">
              <Link href={authRoutes.login}>Back to sign in</Link>
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Use a different email
            </Button>
          </>
        }
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthNotice>
        Password recovery requires the email service, which arrives in Phase 2.
        The flow below is the real interaction; no email is actually sent.
      </AuthNotice>

      <Field
        label="Email"
        required
        error={error}
        description="We will send a reset link to this address."
      >
        <Input
          type="email"
          name="email"
          autoComplete="email"
          inputSize="lg"
          leadingIcon={<Mail aria-hidden="true" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-required
        />
      </Field>

      <Button type="submit" size="lg" fullWidth loading={submitting} loadingLabel="Sending link">
        Send reset link
      </Button>

      <p className="text-center text-body-sm text-ink-soft">
        Remembered it?{" "}
        <Link
          href={authRoutes.login}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
