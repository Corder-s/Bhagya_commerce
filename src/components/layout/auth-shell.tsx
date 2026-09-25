import { ShieldCheck, Sparkles, Trees } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { marketingRoutes } from "@/config/routes";

/**
 * AuthShell — a deliberately quiet frame for sign-in, OTP and reset routes.
 *
 * No storefront nav and no tab bar: authentication is a single-task moment and
 * the distraction is removed rather than shrunk. A split layout on desktop keeps
 * the brand present (the green panel is one of the few large brand surfaces)
 * while the form column stays a plain ivory canvas at a comfortable measure.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      {/* Form column */}
      <div className="flex min-h-dvh flex-col lg:min-h-0">
        <header className="px-[var(--gutter)] py-6">
          <Link
            href={marketingRoutes.home}
            aria-label="Bhagya Commerce — home"
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <BrandMark variant="compact" size="sm" />
          </Link>
        </header>

        <main
          id="main"
          className="flex flex-1 flex-col justify-center px-[var(--gutter)] pb-12 pt-4"
        >
          <div className="mx-auto w-full max-w-[26rem]">{children}</div>
        </main>

        <footer className="px-[var(--gutter)] pb-8 text-caption text-ink-soft">
          <div className="mx-auto flex w-full max-w-[26rem] flex-wrap items-center gap-x-4 gap-y-2">
            <Link href={marketingRoutes.help} className="hover:text-primary">
              Need help?
            </Link>
            <Link href="/help#privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/help#terms" className="hover:text-primary">
              Terms
            </Link>
          </div>
        </footer>
      </div>

      {/* Brand column — desktop only */}
      <aside
        data-surface="inverse"
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-charcoal p-10 text-ink-inverse lg:flex lg:flex-col lg:justify-between"
        style={{ background: "linear-gradient(160deg, #1e1e1c 0%, #151515 60%, #1a160d 100%)" }}
      >
        {/* Gold glow orb */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-pill blur-3xl animate-breathe"
          style={{ background: "radial-gradient(circle, rgba(201,154,61,0.20) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-pill blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(201,154,61,0.12) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Logo top-left */}
        <div className="relative">
          <span
            className="font-display text-lg font-semibold tracking-wide"
            style={{ color: "#c99a3d" }}
          >
            Bhagya Commerce
          </span>
        </div>

        <p className="relative font-display text-display-md font-medium text-ink-inverse">
          Good for People.
          <br />
          Great for Tomorrow.
        </p>

        <ul className="relative flex flex-col gap-5">
          {[
            {
              Icon: Trees,
              title: "Every order plants a tree",
              body: "41,280 native trees planted with our maker partners.",
            },
            {
              Icon: Sparkles,
              title: "One identity, two ways to use it",
              body: "Shop as a customer. Open a store later, on the same account.",
            },
            {
              Icon: ShieldCheck,
              title: "Maker-verified",
              body: "Every brand on Bhagya is vetted for materials and fair pay.",
            },
          ].map(({ Icon, title, body }) => (
            <li key={title} className="flex gap-3.5">
              <span
                className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md"
                style={{ border: "1px solid rgba(201,154,61,0.35)", background: "rgba(201,154,61,0.10)", color: "#c99a3d" }}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-body-sm font-semibold text-ink-inverse">{title}</p>
                <p className="text-caption text-ink-inverse-soft">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
