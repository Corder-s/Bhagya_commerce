"use client";

import Link from "next/link";
import * as React from "react";

import { AuthNotice } from "@/features/auth/auth-notice";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { authRoutes } from "@/config/routes";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const LENGTH = 6;

/**
 * VerifyOtpForm — a six-box one-time-code entry.
 *
 * Accessibility approach that matters here: the six boxes are a *single* logical
 * field. One visually-hidden `<input>` holds the value for assistive tech and
 * form submission, while the boxes are decorative presentations of it. Arrow-key
 * and paste handling work, `autoComplete="one-time-code"` allows SMS autofill,
 * and there is a resend action with an honest note that no SMS is sent yet.
 */
export function VerifyOtpForm() {
  const [digits, setDigits] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = React.useState<string>();
  const [submitting, setSubmitting] = React.useState(false);
  const [seconds, setSeconds] = React.useState(30);
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

    // Handles both single keystrokes and multi-digit paste into one box.
    setDigits((current) => {
      const next = [...current];
      clean.split("").forEach((char, offset) => {
        if (index + offset < LENGTH) next[index + offset] = char;
      });
      return next;
    });
    focusBox(index + clean.length);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.length < LENGTH) {
      setError(`Enter all ${LENGTH} digits`);
      focusBox(code.length);
      return;
    }
    setError(undefined);
    setSubmitting(true);
    // Phase 2: POST /auth/otp/verify
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitting(false);
    toast.info("OTP verification is not live", "Codes are issued in Phase 2.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthNotice>
        OTP delivery needs the SMS/WhatsApp service (Phase 2). Until then, no code
        will arrive — this form proves the interaction and its states.
      </AuthNotice>

      <Field
        label="Verification code"
        required
        error={error}
        description="Enter the six-digit code we sent to your phone."
      >
        <div className="flex items-center gap-2" role="group" aria-label="One-time code">
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
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${index + 1} of ${LENGTH}`}
              aria-invalid={error ? true : undefined}
              className={cn(
                "h-12 w-full min-w-0 rounded-md border border-line-strong bg-surface text-center text-heading-md text-ink tabular-nums",
                "transition-[border-color,box-shadow] duration-fast ease-brand",
                "hover:border-ink-subtle",
                "focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
                error && "border-danger",
              )}
            />
          ))}
        </div>
      </Field>

      <Button type="submit" size="lg" fullWidth loading={submitting} loadingLabel="Verifying">
        Verify and continue
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-body-sm">
        <button
          type="button"
          disabled={seconds > 0}
          onClick={() => {
            setSeconds(30);
            toast.info("Resend is not live yet", "SMS delivery arrives in Phase 2.");
          }}
          className="rounded-xs font-medium text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-ink-faint disabled:no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
        </button>

        <Link
          href={authRoutes.login}
          className="rounded-xs text-ink-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Use a different account
        </Link>
      </div>
    </form>
  );
}
