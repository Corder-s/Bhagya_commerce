"use client";

import { Check, LockKeyhole } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { AuthNotice } from "@/features/auth/auth-notice";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authRoutes } from "@/config/routes";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/**
 * Password rules, expressed once and reused for the live checklist.
 * Rules are surfaced *before* submission rather than as a rejection afterwards.
 */
const rules = [
  { id: "length", label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { id: "mixed", label: "Upper and lower case", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { id: "number", label: "A number", test: (value: string) => /\d/.test(value) },
] as const;

export function ResetPasswordForm() {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [errors, setErrors] = React.useState<{ password?: string; confirm?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);

  const passed = rules.filter((rule) => rule.test(password)).length;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { password?: string; confirm?: string } = {};

    if (passed < rules.length) next.password = "Password does not meet the rules yet";
    if (password !== confirm) next.confirm = "Passwords do not match";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Phase 2: POST /auth/password/reset with the token from the email link.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    toast.info(
      "Password reset is not live yet",
      "The reset endpoint and email links arrive in Phase 2.",
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthNotice>
        This form is reached from the emailed reset link, which is generated in
        Phase 2. Submitting here does not change any password.
      </AuthNotice>

      <Field label="New password" required error={errors.password}>
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

      {/* Live rule checklist — status shown by icon + text, never colour alone. */}
      <ul className="flex flex-col gap-1.5 rounded-md border border-line bg-surface px-3.5 py-3">
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-2 text-caption",
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

      <Field
        label="Confirm new password"
        required
        error={errors.confirm}
        description="Type it once more to be sure."
      >
        <Input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          inputSize="lg"
          leadingIcon={<LockKeyhole aria-hidden="true" />}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          aria-required
        />
      </Field>

      <Button type="submit" size="lg" fullWidth loading={submitting} loadingLabel="Updating password">
        Update password
      </Button>

      <p className="text-center text-body-sm text-ink-soft">
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
