"use client";

import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/account";

  const [showPassword, setShowPassword] = React.useState(false);
  const [emailOrPhone, setEmailOrPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [errors, setErrors] = React.useState<{
    emailOrPhone?: string;
    password?: string;
    general?: string;
  }>({});
  const [submitting, setSubmitting] = React.useState(false);

  function validate() {
    const next: { emailOrPhone?: string; password?: string; general?: string } = {};
    const input = emailOrPhone.trim();

    if (!input) {
      next.emailOrPhone = "Please enter your email or phone number";
    } else if (input.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
        next.emailOrPhone = "Please enter a valid email address";
      }
    } else {
      const cleanPhone = input.replace(/[\s\-+()]/g, "");
      if (cleanPhone.length < 10) {
        next.emailOrPhone = "Please enter a valid 10-digit phone number";
      }
    }

    if (!password) {
      next.password = "Please enter your password";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    setErrors({});

    try {
      const success = await login({
        emailOrPhone: emailOrPhone.trim(),
        password,
        rememberMe,
      });

      if (success) {
        router.push(redirectUrl as any);
      } else {
        setErrors({
          general: "Incorrect email, phone, or password. Please try again.",
        });
      }
    } catch {
      setErrors({
        general: "Something went wrong during sign-in. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoCredentials() {
    setEmailOrPhone("aarav.sharma@example.com");
    setPassword("Password123!");
    setErrors({});
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* Demo Credentials Quick-Fill helper */}
      <div className="flex items-center justify-between rounded-md border border-line bg-surface-raised px-3.5 py-2.5 text-caption">
        <div className="flex items-center gap-2 text-ink-soft">
          <Sparkles className="size-3.5 text-gold-dark dark:text-gold" aria-hidden="true" />
          <span>Demo Account available</span>
        </div>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="rounded-xs font-medium text-gold-dark dark:text-gold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Quick Fill
        </button>
      </div>

      {errors.general ? (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger-surface px-3.5 py-2.5 text-caption text-danger"
        >
          {errors.general}
        </div>
      ) : null}

      <Field
        label="Email or mobile phone"
        required
        error={errors.emailOrPhone}
        description="Use the email or phone number you shop with."
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
            if (errors.emailOrPhone) {
              setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
            }
          }}
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
          onChange={(event) => {
            setPassword(event.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          aria-required
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-ink-soft">
          <Checkbox
            name="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          Keep me signed in
        </label>
        <Link
          href={authRoutes.forgotPassword}
          className="rounded-xs text-body-sm font-medium text-gold-dark dark:text-gold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting}
        loading={submitting}
        loadingLabel="Signing in…"
      >
        Sign in
      </Button>

      <Divider label="New to Bhagya?" spacing="sm" />

      <Button asChild variant="outline" size="lg" fullWidth>
        <Link href={(`${authRoutes.register}${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`) as any}>
          Create your Bhagya account
        </Link>
      </Button>
    </form>
  );
}
