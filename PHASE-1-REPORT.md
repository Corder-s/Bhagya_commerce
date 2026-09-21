# Bhagya Commerce — Phase 1 Report

**Good for People. Great for Tomorrow.**

Phase 1 delivered the application foundation: architecture, design system, brand system, global
layout, navigation, responsive behaviour, the reusable component kit, the route structure, and the
SEO / accessibility / motion / state systems. No commerce functionality is implemented — every
route is a real, server-rendered page that honestly states what arrives next.

Verified: `npx tsc --noEmit` clean · `npm run lint` clean · `npm run build` clean (46/46 pages) ·
41 routes served in production with HTTP 200, exactly one `<h1>` each, alt text on every image,
`lang="en-IN"` set · dev server log free of warnings and errors.

---

## 1. Project structure

```
src/
├── app/                                  41 pages · 5 route groups · 48 routes in the build table
│   ├── layout.tsx                        root: fonts, metadata, JSON-LD, skip link, providers, toaster
│   ├── template.tsx                      route-level page transition (entrance only)
│   ├── globals.css                       tailwindcss → tw-animate-css → styles/{tokens,theme,animations}
│   ├── icon.svg · apple-icon.tsx · opengraph-image.tsx     brand icons + OG card
│   ├── robots.ts · sitemap.ts · manifest.ts                SEO foundations
│   ├── not-found.tsx · error.tsx · global-error.tsx        global states
│   ├── (marketing)/                      layout + template + home, shop, brands, collections,
│   │                                     collections/[slug], journal, start-selling, about, contact,
│   │                                     help, faq, sustainability, search
│   ├── (auth)/                           layout + login, register, forgot-password, verify-otp, reset-password
│   ├── (shop)/                           layout + template + loading + cart, checkout, payment, order-success
│   ├── (customer)/                       layout + template + loading + account/{orders,wishlist,addresses,
│   │                                     preferences}, orders/[id], orders/[id]/tracking
│   └── (merchant)/                       layout + template + loading + merchant/{onboarding,dashboard,
│                                         products,orders,inventory,customers,analytics,marketing,ai,store,settings}
├── components/
│   ├── ui/           29 primitives   button, icon-button, field, input, textarea, select, checkbox,
│   │                                 radio-group, switch, badge, avatar, card, divider, tooltip,
│   │                                 dropdown-menu, modal, drawer, tabs, breadcrumb, skeleton, spinner,
│   │                                 empty-state, error-state, success-state, state-view, container,
│   │                                 section, page-header, toaster
│   ├── layout/        8 files        app-shell, site-header, site-footer, announcement-bar,
│   │                                 auth-shell, merchant-shell, section-heading, newsletter-form
│   ├── navigation/    10 files       nav-icon, desktop-nav, mobile-tab-bar, mobile-menu (+panel),
│   │                                 account-menu, search-command (+panel), merchant-sidebar, account-sidebar
│   └── common/        6 files        brand-mark, reveal, page-transition, motion-provider, skip-link,
│                                     feature-placeholder
├── features/          16 files       auth (6 forms + notice + barrel), products (product-card,
│                                     catalogue-toolbar), cart, checkout, orders, customer (account-summary,
│                                     preferences-form), merchant (overview cards), ai (assist panel)
├── config/            site · routes · navigation · breakpoints · seo
├── hooks/             use-media-query · use-scrolled · use-active-path · use-mounted (+ barrel)
├── lib/               utils · format · motion · toast
├── styles/            tokens.css · theme.css · animations.css
└── types/             navigation · index
```

151 files under `src` — 126 `.tsx`, 20 `.ts`, 4 `.css`, 1 `.svg`. Nothing in the tree is an empty
placeholder folder: every directory holds working code.

## 2. Files created / changed

**Created** — all of the above except the files listed as changed.

**Changed from the `create-next-app` scaffold**

| File | Change |
| --- | --- |
| `src/app/layout.tsx` | replaced the boilerplate: Cormorant Garamond + Inter via `next/font`, metadata + viewport, Organization/WebSite JSON-LD, skip link, `MotionProvider`, `TooltipProvider`, `Toaster` |
| `src/app/globals.css` | replaced with the three-layer token pipeline |
| `next.config.ts` | `typedRoutes`, `poweredByHeader: false`, AVIF/WebP image config, `reactStrictMode` |
| `package.json` | runtime deps (Framer Motion, Lucide, `cn`, CVA, Sonner, 9 Radix packages) and `tw-animate-css` |
| `README.md` | rewritten as project documentation |
| `.gitignore` | added `tsconfig.tsbuildinfo` and env files |
| `.env.example` | documents every variable later phases need, grouped and phase-tagged |

**Removed** — create-next-app boilerplate: `public/{next,vercel,file,globe,window}.svg`,
`src/app/favicon.ico`, `src/app/page.tsx` (recreated as `(marketing)/page.tsx`).

**Late Phase-1 changes made during verification** — `src/components/layout/newsletter-form.tsx`
(added: the footer form previously passed an `onSubmit` handler from a Server Component, which
fails prerendering, and Sonner moved behind a dynamic import), `src/config/seo.ts` (absolute title
for the home route so the layout template does not double the brand name), `EmptyState`,
`ErrorState`, `SuccessState` (optional `titleAs` so a page whose only content is a state still
starts its outline at `h1`), `Reveal` (tag union instead of `ElementType`), `site-footer` (lucide
ships no brand icons, so socials are labelled text pills), route config (typed `Route` values).

## 3. Design system summary

**Tokens** — two layers with one direction of dependency. `src/styles/tokens.css` holds raw
`--bhagya-*` values: the brand greens (`primary #0B4D36`, `deep #063B2A`, `botanical #2F7D4A`),
surfaces (soft green, warm ivory, warm sand), muted gold, an ink ramp (`ink`, `ink-soft`,
`ink-subtle`, `ink-faint`, plus inverse), hairlines, status pairs, spacing on an 8px base, radii
(8/12/16/24/9999), restrained shadows, easings, durations, a z-index ladder and container widths.
`src/styles/theme.css` maps them into Tailwind v4's `@theme` namespaces, so components only ever
write utilities — there is no hex value in any component except the brand mark's leaf vein.

**Colour discipline** — green means brand: mark, primary buttons, active states, highlights.
Everything else sits on ivory, white and neutral surfaces. Contrast was checked and adjusted: ink
on ivory is 15.9:1, `ink-soft` 5.6:1, `ink-subtle` 4.8:1; the gold used for text is a darkened
`#8A6D2F` at 4.9:1. Status is always icon **and** label, never colour alone.

**Typography** — Cormorant Garamond for storytelling headings, Inter for the interface, loaded
through `next/font` with `display: swap` and exposed as `--font-display` / `--font-sans`. The scale
runs Display XL/LG/MD, Heading XL/LG/MD, Body LG/MD/SM, Caption, Label; a `label-text` utility
carries the small-caps treatment.

**Motion** — one vocabulary in `src/lib/motion.ts` (fade, fade-up, scale, stagger, overlay, drawer,
hover), mirrored by keyframes in `animations.css` for the Radix states CSS owns. `MotionConfig
reducedMotion="user"` makes every animation collapse under `prefers-reduced-motion`, and the
feature set is trimmed with `LazyMotion` + `domAnimation`.

**Responsiveness** — verified from 320px up: no horizontal overflow (`overflow-x: clip` safety net),
44px minimum touch targets on coarse pointers, fluid type via `clamp()`, and navigation that changes
shape rather than shrinking — the desktop rail, the phone drawer and the five-slot bottom tab bar
are separate components.

## 4. Routes created

| Group | Routes |
| --- | --- |
| Marketing | `/` · `/shop` · `/brands` · `/collections` · `/collections/[slug]` · `/journal` · `/start-selling` · `/search` · `/about` · `/contact` · `/help` · `/faq` · `/sustainability` |
| Auth | `/login` · `/register` · `/forgot-password` · `/verify-otp` · `/reset-password` |
| Shop / commerce | `/cart` · `/checkout` · `/payment` · `/order-success` |
| Customer | `/account` · `/account/orders` · `/account/wishlist` · `/account/addresses` · `/account/preferences` · `/orders/[id]` · `/orders/[id]/tracking` |
| Merchant | `/merchant` · `/merchant/onboarding` · `/merchant/dashboard` · `/merchant/products` · `/merchant/orders` · `/merchant/inventory` · `/merchant/customers` · `/merchant/analytics` · `/merchant/marketing` · `/merchant/ai` · `/merchant/store` · `/merchant/settings` |
| System | `/not-found` (404) · `/error` boundary · `/global-error` · `/robots.txt` · `/sitemap.xml` · `/manifest.webmanifest` · `/icon.svg` · `/apple-icon` · `/opengraph-image` |

Each page is a real page at its own URL — one route visible at a time, no stacked screens.

## 5. Components created

**Primitives (29)** — Button (primary, secondary, outline, ghost, destructive, link × sm/md/lg/icon),
IconButton, Field (context-driven label/description/error/required wiring), Input, Textarea, Select,
Checkbox, RadioGroup, Switch, Badge, Avatar, Card, Divider, Tooltip, DropdownMenu, Modal (incl.
confirm dialog), Drawer, Tabs, Breadcrumb, Skeleton, Spinner, EmptyState, ErrorState, SuccessState,
StateView, Container, Section, PageHeader, Toaster.

**Layout (8)** — AppShell, SiteHeader, SiteFooter, AnnouncementBar, AuthShell, MerchantShell,
SectionHeading, NewsletterForm.

**Navigation (10)** — NavIcon, DesktopNav, MobileTabBar, MobileMenu (+ lazily loaded panel),
AccountMenu, SearchCommand (+ lazily loaded panel), MerchantSidebar, AccountSidebar.

**Common (6)** — BrandMark (leaf + wordmark), Reveal, PageTransition, MotionProvider, SkipLink,
FeaturePlaceholder.

**Feature components (16)** — six auth forms + auth notice, ProductCard, CatalogueToolbar,
CartSummaryShell, CheckoutStepper, OrderTimeline, AccountSummary, PreferencesForm,
MerchantOverviewCards, AiAssistPanel.

## 6. Build / lint result

```
npx tsc --noEmit      ✓ 0 errors
npm run lint          ✓ 0 errors, 0 warnings
npm run build         ✓ compiled, TypeScript passed, 46/46 pages generated
next start            ✓ 41 routes HTTP 200 · one h1 per route · alt text present · lang="en-IN"
next dev              ✓ log clean — no warnings, no errors
```

First-load JavaScript, measured from the built HTML (gzip): home 274 KB, shop 273 KB, login 257 KB,
merchant dashboard 248 KB. React 19 plus the Next client runtime account for the bulk of that; the
optional libraries are kept off the critical path — the search dialog, the mobile menu panel, the
toast library and the unused half of the motion bundle are all fetched on demand.

## 7. What to implement in Phase 2

1. **Identity** — real auth (sessions, OTP delivery, reset tokens), protecting `/account`,
   `/merchant/**`, `/cart`, `/checkout` via `proxy.ts`, and hydrating `AccountMenu` with a session.
2. **Catalogue** — products, collections, brands and journal backed by real data: search, facets,
   pagination, image pipeline, product detail pages, and the shop grid that currently shows an
   empty state.
3. **Cart & checkout** — persisted cart, address book, shipping, tax, coupons, and a payment
   integration behind `/payment` (the page exists and deliberately has no form yet).
4. **Orders** — order creation, order detail, and a tracking timeline driven by real fulfilment
   events (`OrderTimeline` already renders the shape).
5. **Merchant workspace** — onboarding, product and inventory management, order operations,
   customers, analytics, marketing tools and the AI assist backend.
6. **Notifications** — WhatsApp, SMS and email (the `Toaster` and `lib/toast.ts` facade already
   define how the app speaks to a user).
7. **Data layer** — PostgreSQL, Redis and object storage, replacing the placeholder feature
   components with server-fetched data and adding caching plus revalidation.

**Note on the product rule:** customers are never pushed into selling. `/start-selling` and the
header CTA are invitations; `/merchant` lives on the same identity, and nothing in the Shop
experience requires an organisation.
