"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

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
    const [{ toast }] = await Promise.all([
      import("@/lib/toast"),
      new Promise((resolve) => setTimeout(resolve, 400)),
    ]);
    setSubmitting(false);
    toast.info(
      "Mailing list subscription",
      "Thank you for subscribing to Letters from Bhagya.",
    );
    setEmail("");
  }

  const inputId = "footer-newsletter";

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-3", className)}>
      <label htmlFor={inputId} className="text-sm font-semibold text-[#FAF7F0]">
        Letters from Bhagya
      </label>
      <p className="text-xs text-[#8A8378]">
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
            "h-11 min-w-0 flex-1 rounded-xl border border-[#3A3A35] bg-[#2A2A27] px-3.5 text-xs text-[#FAF7F0]",
            "placeholder:text-[#8A8378]",
            "transition-colors duration-fast ease-brand",
            "hover:border-[#C99A3D]/40",
            "focus:border-[#C99A3D] focus:outline-none focus:ring-1 focus:ring-[#C99A3D]",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-[#B64032]",
          )}
        />
        <button
          type="submit"
          disabled={submitting}
          className="h-11 shrink-0 rounded-xl bg-[#C99A3D] hover:bg-[#B8892D] px-5 text-xs font-bold text-[#171717] transition-all duration-fast shadow-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-xs font-medium text-[#B64032]"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
