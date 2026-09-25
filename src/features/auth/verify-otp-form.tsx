"use client";

import { CheckCircle2, RotateCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { authRoutes } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const LENGTH = 6;

export function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp, pendingVerification } = useAuth();

  const redirectUrl = searchParams.get("redirect") || "/account";

  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [seconds, setSeconds] = React.useState(30);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const inputsRef = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  const code = digits.join("");

  function focusBox(index: number) {
    const target = inputsRef.current[Math.max(0, Math.min(index, LENGTH - 1))];
    target?.focus();
    target?.select();
  }

  function setDigit(index: number, value: string) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((current) => current.map((d, i) => (i === index ? "" : d)));
      return;
    }

    setDigits((current) => {
      const next = [...current];
      clean.split("").forEach((char, offset) => {
        if (index + offset < LENGTH) next[index + offset] = char;
      });
      return next;
    });

    const nextFocus = Math.min(index + clean.length, LENGTH - 1);
    focusBox(nextFocus);
    setError(undefined);
  }

  async function handleVerify(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (code.length < LENGTH) {
      setError(`Please enter all ${LENGTH} digits of your verification code`);
      focusBox(code.length);
      return;
    }

    setError(undefined);
    setSubmitting(true);

    try {
      const success = await verifyOtp(code);
      if (success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl as any);
        }, 600);
      } else {
        setError("Invalid or expired verification code. Try '123456' in demo mode.");
      }
    } catch {
      setError("Unable to complete verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (seconds > 0 || resending) return;
    setResending(true);
    try {
      const ok = await resendOtp();
      if (ok) {
        setSeconds(30);
        setError(undefined);
      }
    } finally {
      setResending(false);
    }
  }

  function fillDemoCode() {
    const demo = ["1", "2", "3", "4", "5", "6"];
    setDigits(demo);
    setError(undefined);
    focusBox(5);
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-line bg-surface p-8 text-center shadow-card animate-fade-in">
        <div className="grid size-14 place-items-center rounded-pill bg-success-surface text-success">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-lg font-semibold text-ink">Account Verified</h2>
          <p className="text-body-sm text-ink-soft">
            Redirecting you to your account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} noValidate className="flex flex-col gap-5">
      {/* Destination notice */}
      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface-raised p-3.5 text-caption text-ink-soft">
        <ShieldCheck className="mt-0.5 size-4 text-gold-dark dark:text-gold shrink-0" aria-hidden="true" />
        <div>
          <span>
            Enter the 6-digit code sent to{" "}
            <strong className="text-ink font-medium">
              {pendingVerification?.emailOrPhone || "your registered email / phone"}
            </strong>
            .
          </span>
          <div className="mt-1">
            <button
              type="button"
              onClick={fillDemoCode}
              className="text-gold-dark dark:text-gold underline hover:no-underline font-medium"
            >
              Click here to auto-fill demo code (123456)
            </button>
          </div>
        </div>
      </div>

      <Field
        label="6-Digit Verification Code"
        required
        error={error}
        description="Enter the single-use code received."
      >
        <div className="flex items-center gap-2 justify-between" role="group" aria-label="One-time verification code">
          {Array.from({ length: LENGTH }).map((_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputsRef.current[index] = element;
              }}
              value={digits[index] ?? ""}
              onChange={(event) => setDigit(index, event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !digits[index]) {
                  event.preventDefault();
                  focusBox(index - 1);
                }
                if (event.key === "ArrowLeft") focusBox(index - 1);
                if (event.key === "ArrowRight") focusBox(index + 1);
              }}
              onPaste={(event) => {
                event.preventDefault();
                setDigit(index, event.clipboardData.getData("text"));
              }}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${index + 1} of ${LENGTH}`}
              aria-invalid={error ? true : undefined}
              className={cn(
                "h-13 w-11 sm:w-12 rounded-lg border border-line bg-surface text-center font-display text-heading-lg text-ink tabular-nums shadow-xs",
                "transition-[border-color,box-shadow] duration-fast ease-brand",
                "hover:border-ink-subtle",
                "focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none",
                error && "border-danger focus:border-danger focus:ring-danger/20",
              )}
            />
          ))}
        </div>
      </Field>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting || code.length < LENGTH}
        loading={submitting}
        loadingLabel="Verifying…"
      >
        Verify and continue
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm">
        <button
          type="button"
          disabled={seconds > 0 || resending}
          onClick={handleResend}
          className="inline-flex items-center gap-1.5 rounded-xs font-medium text-gold-dark dark:text-gold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-ink-faint disabled:no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {resending ? (
            <>
              <RotateCw className="size-3.5 animate-spin" />
              <span>Resending...</span>
            </>
          ) : seconds > 0 ? (
            `Resend code in ${seconds}s`
          ) : (
            "Resend code"
          )}
        </button>

        <Link
          href={authRoutes.login}
          className="rounded-xs text-ink-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Use different email / phone
        </Link>
      </div>
    </form>
  );
}
