/**
 * Site-wide configuration.
 *
 * Everything brand/URL/SEO related funnels through here so that a rename or a
 * domain change is a one-file edit. Values that must vary per environment are
 * read from `NEXT_PUBLIC_*` env vars (see `.env.example`).
 */

const FALLBACK_URL = "https://bhagyacommerce.com";

/** Absolute site origin, normalised (no trailing slash). */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_URL
).replace(/\/$/, "");

export const siteConfig = {
  name: "Bhagya Commerce",
  shortName: "Bhagya",
  title: "Bhagya Commerce — Good for People. Great for Tomorrow.",
  tagline: "Good for People. Great for Tomorrow.",
  description:
    "Bhagya Commerce is a conscious marketplace where customers discover thoughtfully made products from independent Indian brands, and sellers build stores that grow with them.",
  shortDescription:
    "A conscious marketplace for thoughtfully made products and independent Indian brands.",
  locale: "en_IN",
  language: "en-IN",
  url: siteUrl,
  ogImage: "/opengraph-image",
  twitterHandle: "@bhagyacommerce",
  themeColor: "#0B4D36",
  backgroundColor: "#F7F4EA",
  keywords: [
    "conscious commerce",
    "sustainable marketplace India",
    "Indian independent brands",
    "handmade products",
    "ethical shopping",
    "sell online India",
    "Bhagya Commerce",
  ],
  support: {
    email: "hello@bhagyacommerce.com",
    phone: "+91 90000 00000",
    hours: "Mon–Sat, 10:00–19:00 IST",
    address: "New Delhi, India",
  },
  social: {
    instagram: "https://instagram.com/bhagyacommerce",
    linkedin: "https://linkedin.com/company/bhagyacommerce",
    x: "https://x.com/bhagyacommerce",
    youtube: "https://youtube.com/@bhagyacommerce",
  },
} as const;

export type SiteConfig = typeof siteConfig;
