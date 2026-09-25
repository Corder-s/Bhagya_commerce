"use client";

import { Check, CheckCircle2, Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const rules = [
  { id: "length", label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { id: "mixed", label: "Upper and lowercase letters", test: (value: string) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { id: "number", label: "At least one number", test: (value: string) => /\d/.test(value) },
] as const;

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const { resetPassword } = useAuth();

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState<{ password?: string; confirm?: string; general?: string }>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const passed = rules.filter((rule) => rule.test(password)).length;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: { password?: string; confirm?: string; general?: string } = {};

    if (passed < rules.length) {
      next.password = "Password does not meet all the security requirements";
    }
    if (password !== confirm) {
      next.confirm = "Passwords do not match";
    }

    setErrors(next);
    if (Object.keys(next).length > 0 || submitting) return;

    setSubmitting(true);
    try {
      const ok = await resetPassword(password, token);
      if (ok) {
        setIsSuccess(true);
      } else {
        setErrors({ general: "Invalid or expired reset token. Please request a new link." });
      }
    } catch {
      setErrors({ general: "Unable to update password. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-card animate-fade-in text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-pill bg-success-surface text-success">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-heading-lg font-semibold text-ink">Password Updated</h2>
          <p className="text-body-sm text-ink-soft max-w-sm mx-auto">
            Your password has been reset successfully. You can now sign in with your new credentials.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild variant="primary" size="lg" fullWidth>
            <Link href={authRoutes.login}>Sign In Now</Link>
          </Button>
        </div>
      </div>
    );
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

      <Field label="New password" required error={errors.password}>
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
        {rules.map((rule) => {
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

      <Field
        label="Confirm new password"
        required
        error={errors.confirm}
        description="Type your new password again to confirm."
      >
        <Input
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          inputSize="lg"
          leadingIcon={<LockKeyhole aria-hidden="true" />}
          value={confirm}
          onChange={(event) => {
            setConfirm(event.target.value);
            if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
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
        loadingLabel="Updating password…"
      >
        Update password
      </Button>

      <p className="text-center text-body-sm text-ink-soft">
        <Link
          href={authRoutes.login}
          className="font-medium text-gold-dark dark:text-gold underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
