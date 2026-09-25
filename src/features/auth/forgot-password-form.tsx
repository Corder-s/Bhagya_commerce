"use client";

import { CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [error, setError] = React.useState<string>();
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = emailOrPhone.trim();

    if (!input) {
      setError("Please enter your registered email address or phone number");
      return;
    }

    setError(undefined);
    setSubmitting(true);

    try {
      await forgotPassword(input);
      setSent(true);
    } catch {
      setError("Unable to process request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card animate-fade-in text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-pill bg-success-surface text-success">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-lg font-semibold text-ink">Instructions Sent</h2>
          <p className="text-body-sm text-ink-soft max-w-sm mx-auto">
            If an account exists for <strong className="text-ink font-medium">{emailOrPhone}</strong>, you will receive password reset instructions shortly.
          </p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Button asChild variant="primary" size="lg" fullWidth>
            <Link href={authRoutes.login}>Back to Sign In</Link>
          </Button>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmailOrPhone("");
            }}
            className="text-body-sm text-ink-soft hover:text-ink font-medium"
          >
            Try another email or phone
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Field
        label="Email or registered phone"
        required
        error={error}
        description="We will send a password reset link or SMS code."
      >
        <Input
          type="text"
          name="emailOrPhone"
          autoComplete="username"
          inputSize="lg"
          leadingIcon={<Mail aria-hidden="true" />}
          placeholder="name@example.com or 9876543210"
          value={emailOrPhone}
          onChange={(event) => {
            setEmailOrPhone(event.target.value);
            if (error) setError(undefined);
          }}
          aria-required
        />
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting}
        loading={submitting}
        loadingLabel="Sending reset link…"
      >
        Send reset instructions
      </Button>

      <p className="text-center text-body-sm text-ink-soft">
        Remembered your password?{" "}
        <Link
          href={authRoutes.login}
          className="font-medium text-gold-dark dark:text-gold underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
