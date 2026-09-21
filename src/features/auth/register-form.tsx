"use client";

import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthNotice } from "@/features/auth/auth-notice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupOption } from "@/components/ui/radio-group";
import { authRoutes } from "@/config/routes";
import { toast } from "@/lib/toast";

/**
 * RegisterForm.
 *
 * The brief's rule, encoded in the UI: a new user is a **customer first**.
 * "I want to sell" is an optional intent captured for later, never a forced
 * branch that turns this into a merchant sign-up. One identity, and a store can
 * be added to it later from the account area.
 */
export function RegisterForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [intent, setIntent] = React.useState<"shop" | "sell-later">("shop");
  const [accepted, setAccepted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = React.useState(false);

  function validate() {
    const next: Record<string, string | undefined> = {};
    if (!name.trim()) next.name = "Tell us what to call you";
    if (!email.trim()) next.email = "An email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That does not look like an email address";
    if (phone && !/^[+]?[\d\s-]{10,15}$/.test(phone))
      next.phone = "Enter a valid phone number";
    if (password.length < 8) next.password = "Use at least 8 characters";
    if (!accepted) next.accepted = "Please accept the terms to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Phase 2: POST /auth/register → create the user, then send an OTP.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    toast.info(
      "Registration is not live yet",
      "Accounts and OTP verification arrive in Phase 2. Nothing was submitted.",
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthNotice>
        One account is all you need. Selling can be switched on later from your
        account — you are never asked to choose a “seller account” up front.
      </AuthNotice>

      <Field label="Full name" required error={errors.name}>
        <Input
          name="name"
          autoComplete="name"
          inputSize="lg"
          leadingIcon={<UserRound aria-hidden="true" />}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-required
        />
      </Field>

      <Field label="Email" required error={errors.email}>
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

      <Field
        label="Phone"
        hint="Optional"
        error={errors.phone}
        description="Used for delivery updates and OTP verification."
      >
        <Input
          type="tel"
          name="phone"
          autoComplete="tel"
          inputSize="lg"
          leadingIcon={<Phone aria-hidden="true" />}
          placeholder="+91 90000 00000"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </Field>

      <Field
        label="Password"
        required
        error={errors.password}
        description="At least 8 characters. Long beats complicated."
      >
        <Input
          type="password"
          name="password"
          autoComplete="new-password"
          inputSize="lg"
          leadingIcon={<LockKeyhole aria-hidden="true" />}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-required
        />
      </Field>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-body-sm font-medium text-ink">
          What brings you here?
        </legend>
        <RadioGroup
          value={intent}
          onValueChange={(value) => setIntent(value as typeof intent)}
        >
          <RadioGroupOption
            id="intent-shop"
            value="shop"
            label="I want to shop"
            description="Browse and buy. You can start selling any time later."
          />
          <RadioGroupOption
            id="intent-sell"
            value="sell-later"
            label="I plan to sell, eventually"
            description="Same account — we will nudge you when your store is worth setting up."
          />
        </RadioGroup>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-body-sm text-ink-soft">
          <Checkbox
            name="terms"
            className="mt-0.5"
            checked={accepted}
            onCheckedChange={(value) => setAccepted(value === true)}
            aria-invalid={errors.accepted ? true : undefined}
            aria-required
          />
          <span>
            I agree to the{" "}
            <Link href="/help#terms" className="text-primary underline-offset-4 hover:underline">
              terms of use
            </Link>{" "}
            and{" "}
            <Link href="/help#privacy" className="text-primary underline-offset-4 hover:underline">
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

      <Button type="submit" size="lg" fullWidth loading={submitting} loadingLabel="Creating account">
        Create account
      </Button>

      <p className="text-center text-body-sm text-ink-soft">
        Already have an account?{" "}
        <Link
          href={authRoutes.login}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
