# Bhagya Commerce

**Good for People. Great for Tomorrow.**

An Indian marketplace where customers discover considered, sustainably made goods — and where
makers can open a store of their own when they are ready. One identity, two experiences:
**Shop** for everyone, **Sell** when a customer chooses to grow into it.

The **homepage is built**: an editorial storefront with categories, a featured collection, a
tabbed product grid, brand discovery, the Bhagya AI preview, the sustainability story, the journal,
the seller invitation and the closing CTA. `/shop`, `/brands`, `/collections`, `/journal` and
`/start-selling` are real routes too. See `STEP-1-REPORT.md`.

Everything on the page is rendered from demo data in `src/data/`, shaped by the interfaces in
`src/types/catalogue.ts`, so swapping in Spring Boot endpoints is a change at the data layer only.
No commerce functionality is wired up yet — and nothing pretends otherwise: Quick Add, the wishlist
and the AI conversation all say out loud what is not connected.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4 (CSS-first `@theme`), design tokens in `src/styles` |
| Components | In-repo primitive kit on Radix UI, `class-variance-authority` |
| Motion | Framer Motion (honours `prefers-reduced-motion`) |
| Icons | Lucide |
| Feedback | Sonner, wrapped behind `src/lib/toast.ts` |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

No environment variables are required in Phase 1. `.env.example` documents the variables later
phases will need, grouped by concern.

## Structure

```
src/
  app/            route groups: (marketing) (shop) (auth) (customer) (merchant)
  components/
    ui/           primitive kit — button, field, card, modal, tabs, states…
    layout/       shells, header, footer, announcement bar, section heading
    navigation/   desktop nav, mobile menu, tab bar, sidebars, search, account menu
    common/       brand mark, reveal, page transition, skip link, placeholders
  features/       domain components: auth, products, cart, checkout, orders, customer, merchant, ai
  data/           demo content: categories, products, brands, collections, journal, ai
  config/         site, routes, navigation, breakpoints, seo
  hooks/          media query, scroll, active path, mounted
  lib/            cn, formatters, motion variants, toast facade
  styles/         tokens.css · theme.css · animations.css
  types/          shared types
```

## Design system

Two layers, one direction of dependency:

1. **`tokens.css`** holds raw `--bhagya-*` values — brand greens, ivory, sand, gold, an
   accessibility-checked ink ramp, spacing, radii, shadows, easings, z-index ladder, containers.
2. **`theme.css`** maps them into Tailwind's `@theme` namespaces and the base layer, so components
   only ever write utilities (`bg-primary`, `text-ink-soft`, `rounded-lg`) — never hex values.

Green means brand: the mark, primary buttons, active states, highlights. Everything else sits on
ivory, white and neutral surfaces, with Cormorant Garamond reserved for storytelling headings and
Inter carrying the interface.

Motion lives in `src/lib/motion.ts` and is mirrored in `animations.css`; every animation collapses
to a no-op under `prefers-reduced-motion`.

## Accessibility

Semantic landmarks and one `h1` per route, a skip link, visible focus rings on every interactive
element, 44px minimum touch targets on coarse pointers, labelled controls wired through the field
context, states that pair colour with an icon and a word, and no meaning encoded in colour alone.

## Roadmap

Phase 2 adds identity and commerce: real authentication and OTP, catalogue and search, cart,
checkout and payments, orders and tracking, merchant onboarding, inventory, analytics and the AI
assist backend.
