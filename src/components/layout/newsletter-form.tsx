"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * NewsletterForm — footer subscription shell.
 *
 * A client component by necessity: event handlers cannot be passed from a server
 * component, and the footer is intentionally server-rendered. It owns real input
 * state and validation, and stops short of a subscription — there is no mailing
 * list provider in Phase 1, and a form that silently discards an address is worse
 * than one that says it is not connected.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string>();
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
    // Phase 2: POST /newsletter/subscribe.
    // Sonner is imported here rather than at module scope so the footer does not
    // drag the toast library into the first load of every storefront page.
    const [{ toast }] = await Promise.all([
      import("@/lib/toast"),
      new Promise((resolve) => setTimeout(resolve, 400)),
    ]);
    setSubmitting(false);
    toast.info(
      "Mailing list is not connected yet",
      "The newsletter service arrives in Phase 2 — nothing was submitted.",
    );
  }

  const inputId = "footer-newsletter";

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-3", className)}>
      <label htmlFor={inputId} className="text-body-sm font-medium text-ink-inverse">
        Letters from Bhagya
      </label>
      <p className="text-caption text-ink-inverse-soft">
        One considered email a month: new makers, craft notes, no noise.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-11 min-w-0 flex-1 rounded-md border border-line-inverse bg-ink-inverse/5 px-3.5 text-body-sm text-ink-inverse",
            "placeholder:text-ink-inverse-soft/70",
            "transition-colors duration-fast ease-brand",
            "hover:border-ink-inverse/40",
            "focus:border-ink-inverse focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-danger",
          )}
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-11 shrink-0 rounded-md bg-canvas px-5 text-body-sm font-medium text-primary transition-colors duration-fast hover:bg-soft-green focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {/* Error is announced and written out — never colour alone. */}
      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-caption font-medium text-danger"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
