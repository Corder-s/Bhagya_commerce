"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthNotice } from "@/features/auth/auth-notice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authRoutes } from "@/config/routes";
import { toast } from "@/lib/toast";

/**
 * LoginForm.
 *
 * Presentational and client-side only: it owns real field state, validation and
 * error/focus behaviour, and stops short of authentication. Submitting surfaces a
 * toast explaining that sessions land in Phase 2 — no fake redirect, no fake
 * "welcome back".
 */
export function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>(
    {},
  );
  const [submitting, setSubmitting] = React.useState(false);

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) next.email = "Enter your email address";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That does not look like an email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Phase 2: POST /auth/login, then redirect to the intended route.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    toast.info(
      "Sign-in is not live yet",
      "Authentication is part of Phase 2. Your input was not sent anywhere.",
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthNotice />

      <Field
        label="Email"
        required
        error={errors.email}
        description="Use the email you shop with."
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

      <Field label="Password" required error={errors.password}>
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          inputSize="lg"
          leadingIcon={<LockKeyhole aria-hidden="true" />}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="grid size-9 place-items-center rounded-sm text-ink-soft transition-colors duration-fast hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          }
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-required
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-ink-soft">
          <Checkbox name="remember" defaultChecked />
          Keep me signed in
        </label>
        <Link
          href={authRoutes.forgotPassword}
          className="rounded-xs text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" fullWidth loading={submitting} loadingLabel="Signing in">
        Sign in
      </Button>

      <Divider label="New to Bhagya Commerce?" spacing="sm" />

      <Button asChild variant="outline" size="lg" fullWidth>
        <Link href={authRoutes.register}>Create an account</Link>
      </Button>
    </form>
  );
}
