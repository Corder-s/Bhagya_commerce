"use client";

import { Check, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupOption } from "@/components/ui/radio-group";
import { authRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const passwordRules = [
  { id: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { id: "mixed", label: "Upper & lowercase letters", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { id: "number", label: "At least one number", test: (v: string) => /\d/.test(v) },
] as const;

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/account";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [intent, setIntent] = React.useState<"shop" | "sell-later">("shop");
  const [accepted, setAccepted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = React.useState(false);

  function validate() {
    const next: Record<string, string | undefined> = {};
    if (!name.trim()) next.name = "Please enter your full name";
    if (!email.trim()) {
      next.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid email address";
    }

    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-+()]/g, "");
      if (cleanPhone.length < 10) {
        next.phone = "Please enter a valid 10-digit phone number";
      }
    }

    const passedRules = passwordRules.filter((r) => r.test(password)).length;
    if (passedRules < passwordRules.length) {
      next.password = "Password does not satisfy the security requirements";
    }

    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    if (!accepted) {
      next.accepted = "Please accept the terms of use and privacy policy";
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
      const success = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        intent,
      });

      if (success) {
        router.push(`${authRoutes.verifyOtp}?redirect=${encodeURIComponent(redirectUrl)}` as any);
      } else {
        setErrors({
          general: "An account with this email already exists or registration could not be completed.",
        });
      }
    } catch {
      setErrors({
        general: "Something went wrong while creating your account. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {errors.general ? (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger-surface px-3.5 py-2.5 text-caption text-danger"
        >
          {errors.general}
        </div>
      ) : null}

      <Field label="Full name" required error={errors.name}>
        <Input
          name="name"
          autoComplete="name"
          inputSize="lg"
          leadingIcon={<UserRound aria-hidden="true" />}
          placeholder="e.g. Aarav Sharma"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          aria-required
        />
      </Field>

      <Field label="Email address" required error={errors.email}>
        <Input
          type="email"
          name="email"
          autoComplete="email"
          inputSize="lg"
          leadingIcon={<Mail aria-hidden="true" />}
          placeholder="aarav@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          aria-required
        />
      </Field>

      <Field
        label="Phone number"
        hint="Optional"
        error={errors.phone}
        description="Used for order tracking updates and SMS OTP verification."
      >
        <Input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputSize="lg"
          leadingIcon={<Phone aria-hidden="true" />}
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
        />
      </Field>

      <Field
        label="Password"
        required
        error={errors.password}
        description="Create a secure password with at least 8 characters."
      >
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="new-password"
          inputSize="lg"
          leadingIcon={<LockKeyhole aria-hidden="true" />}
          trailingIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
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
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          aria-required
        />
      </Field>

      {/* Live rule checklist */}
      <ul className="flex flex-col gap-1.5 rounded-md border border-line bg-surface-raised px-3.5 py-2.5">
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-caption transition-colors duration-fast",
                ok ? "text-success" : "text-ink-soft",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-4 shrink-0 place-items-center rounded-pill border",
                  ok ? "border-success/40 bg-success-surface" : "border-line",
                )}
              >
                {ok ? <Check className="size-3" strokeWidth={3} /> : null}
              </span>
              {rule.label}
              <span className="sr-only">{ok ? " — met" : " — not met yet"}</span>
            </li>
          );
        })}
      </ul>

      <Field label="Confirm password" required error={errors.confirmPassword}>
        <Input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          inputSize="lg"
          leadingIcon={<LockKeyhole aria-hidden="true" />}
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (errors.confirmPassword) {
              setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }
          }}
          aria-required
        />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-body-sm font-medium text-ink">
          One unified identity:
        </legend>
        <RadioGroup
          value={intent}
          onValueChange={(value) => setIntent(value as typeof intent)}
        >
          <RadioGroupOption
            id="intent-shop"
            value="shop"
            label="I want to shop"
            description="Browse artisanal collections, checkout quickly and track deliveries."
          />
          <RadioGroupOption
            id="intent-sell"
            value="sell-later"
            label="I plan to sell, eventually"
            description="Same single account — unlock store & seller onboarding whenever you are ready."
          />
        </RadioGroup>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-body-sm text-ink-soft">
          <Checkbox
            name="terms"
            className="mt-0.5"
            checked={accepted}
            onCheckedChange={(value) => {
              setAccepted(value === true);
              if (errors.accepted) {
                setErrors((prev) => ({ ...prev, accepted: undefined }));
              }
            }}
            aria-invalid={errors.accepted ? true : undefined}
            aria-required
          />
          <span>
            I agree to the{" "}
            <Link href="/help#terms" className="text-gold-dark dark:text-gold underline-offset-4 hover:underline">
              terms of use
            </Link>{" "}
            and{" "}
            <Link href="/help#privacy" className="text-gold-dark dark:text-gold underline-offset-4 hover:underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.accepted ? (
          <p role="alert" className="text-caption font-medium text-danger">
            {errors.accepted}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting}
        loading={submitting}
        loadingLabel="Creating account…"
      >
        Create your account
      </Button>

      <p className="text-center text-body-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href={(`${authRoutes.login}${redirectUrl !== "/account" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`) as any}
          className="font-medium text-gold-dark dark:text-gold underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
