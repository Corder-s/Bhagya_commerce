import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { BrandMark } from "@/components/common/brand-mark";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import { Divider } from "@/components/ui/divider";
import { footerNav } from "@/config/navigation";
import { marketingRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

/**
 * SiteFooter — the deep-green band that closes every storefront page.
 *
 * Five columns, as the brand intends: the statement column (wordmark, tagline,
 * newsletter and social) plus four link columns. This is the only large green
 * surface in the product; the rest of the UI stays ivory and white so the
 * footer reads as a deliberate full stop rather than more of the same.
 *
 * Social links are icon + label, not icon-only: Lucide ships no brand glyphs,
 * and a generic glyph standing in for Instagram is worse than the word.
 */
const socials = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
  { label: "YouTube", href: siteConfig.social.youtube },
] as const;

export function SiteFooter() {
  return (
    <footer
      data-surface="inverse"
      className="mt-auto bg-deep text-ink-inverse print:hidden"
    >
      <div className="container-wide py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-16">
          {/* ------------------------------------------------ Column 1: brand */}
          <div className="flex max-w-sm flex-col gap-6">
            <BrandMark variant="full" size="md" tone="inverse" />

            <p className="text-body-sm text-ink-inverse-soft">
              {siteConfig.shortDescription} One account for both sides of the
              marketplace.
            </p>

            <NewsletterForm />
          </div>

          {/* --------------------------------------------- Columns 2–5: links */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:gap-x-10">
            {footerNav.map((column) => (
              <nav key={column.title} aria-labelledby={`footer-${column.title}`}>
                <h2
                  id={`footer-${column.title}`}
                  className="label-text mb-3.5 text-ink-inverse-soft"
                >
                  {column.title}
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-6 items-center text-body-sm text-ink-inverse-soft transition-colors duration-fast hover:text-ink-inverse focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <Divider spacing="lg" className="bg-line-inverse" />

        {/* Social + contact */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <ul className="flex flex-wrap items-center gap-2">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex min-h-10 items-center gap-2 rounded-pill border border-line-inverse px-3.5 text-caption font-medium text-ink-inverse-soft transition-colors duration-fast hover:border-ink-inverse/40 hover:bg-ink-inverse/10 hover:text-ink-inverse focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {label}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-3 text-body-sm text-ink-inverse-soft sm:flex-row sm:flex-wrap sm:gap-6">
            <li>
              <a
                href={`mailto:${siteConfig.support.email}`}
                className="inline-flex items-center gap-2 transition-colors duration-fast hover:text-ink-inverse"
              >
                <Mail className="size-4" aria-hidden="true" />
                {siteConfig.support.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.support.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors duration-fast hover:text-ink-inverse"
              >
                <Phone className="size-4" aria-hidden="true" />
                {siteConfig.support.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {siteConfig.support.address}
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-caption text-ink-inverse-soft/80 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            Prices in INR, inclusive of GST.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {(
              [
                { label: "Privacy", href: "/help#privacy" },
                { label: "Terms", href: "/help#terms" },
                { label: "Shipping", href: "/help#shipping" },
                { label: "Returns", href: "/help#returns" },
                { label: "Help Center", href: marketingRoutes.help },
              ] as const
            ).map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="transition-colors duration-fast hover:text-ink-inverse"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
