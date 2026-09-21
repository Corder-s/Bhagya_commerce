# Bhagya Commerce — Step 1 Report

**The real website.** One homepage, fully built, at `/` — plus five real routes. No design board, no
screen gallery, no jump-to-screen, no prototype chrome. Open the app and you land on the Bhagya
Commerce homepage, scroll it like a page, and click into pages like a website.

Verified in a real browser (Chromium, 8 widths × 6 routes): no console errors, no horizontal
overflow at 320/375/390/430/768/1024/1280/1440, no broken images, no missing alt text, one `h1` per
route, every internal link returns 200, every touch target ≥44px, and no content is hidden when
JavaScript does not run. `npx tsc --noEmit`, `npm run lint` and `npm run build` are all clean.

---

## 1. Files created

**Data layer — demo content, API-shaped** (this is the layer Phase 2 swaps for Spring Boot)

| File | Contents |
| --- | --- |
| `src/types/catalogue.ts` | `MediaRef`, `Category`, `BrandSummary`, `ProductSummary`, `ProductBucket`, `CollectionSummary`, `JournalPost`, `ConversationTurn` — the API contract |
| `src/lib/catalogue.ts` | `discountPercent` (guards fake discounts), `availabilityLabel/Note`, `formatRating`, `formatReviewCount` |
| `src/data/categories.ts` | 8 categories with images, descriptors and tone fallbacks |
| `src/data/products.ts` | 8 products + `productBuckets` (For You / Trending / New Arrivals / Best Sellers) + `getProductsByBucket` |
| `src/data/brands.ts` | 6 demo makers with craft and region |
| `src/data/collections.ts` | 3 collections + `featuredCollection` |
| `src/data/journal.ts` | 3 articles + 5 journal categories |
| `src/data/ai.ts` | AI preview transcript, recommendations, capabilities, starter prompts |
| `src/data/index.ts` | barrel — the only place that knows the data is fake |

**Homepage sections** (`src/features/home/`) — 12 files, one per section of the page:
`hero`, `trust-strip`, `category-rail`, `featured-collection`, `trending-products`, `todays-edit`,
`brand-rail`, `ai-preview`, `editorial-impact`, `journal-section`, `merchant-cta`, `final-cta`.

**Cards and shared blocks**
`src/features/categories/category-card.tsx` · `src/features/brands/brand-card.tsx` ·
`src/features/journal/journal-card.tsx` · `src/features/products/product-grid.tsx` ·
`src/components/common/media-tile.tsx` (designed fallback for a record with no photograph) ·
`src/components/common/route-shell.tsx` (the "coming next" page used by the four secondary routes) ·
`src/components/common/reveal-observer.tsx`.

**Dev tooling** (not shipped): `scripts/check.mjs` (responsive/a11y/link audit),
`scripts/review.mjs` (screenshots + reveal behaviour test).

**Media** `public/images/` — 18 files, 2.4 MB: hero still life + detail, featured collection,
sustainability, 6 category photographs, 8 product photographs.

## 2. Files modified

| File | Change |
| --- | --- |
| `src/app/(marketing)/page.tsx` | replaced with a 12-section composition — the homepage |
| `src/app/(marketing)/{shop,brands,collections,journal}/page.tsx` | rebuilt as real "coming next" pages with their own metadata, planned scope and live links |
| `src/app/(marketing)/start-selling/page.tsx` | full seller page: hero, worked fee example, four steps, tool grid, pricing table, close |
| `src/components/layout/site-header.tsx` | three-zone desktop bar (left brand · centre nav · right utilities + CTA), lean mobile bar (brand + search + cart + menu) |
| `src/components/layout/site-footer.tsx` | five columns as specified, newsletter, icon **and** label socials, legal row |
| `src/config/navigation.ts` | footer columns (Shop / For Business / Company / Support), mobile tab bar (Home, Discover, Wishlist, Orders, Account) |
| `src/components/navigation/desktop-nav.tsx` | text links with growing underline, `aria-current`, duplicate-route active-state guard |
| `src/components/navigation/{mobile-menu,mobile-menu-panel,search-command,search-command-panel}.tsx` | split trigger from panel so the drawer and dialog load on first open |
| `src/features/products/product-card.tsx` | rebuilt: `next/image`, wishlist toggle, Quick Add, rating, price/MRP/discount |
| `src/components/common/reveal.tsx` | rewritten as CSS-driven server components (see §5) |
| `src/components/common/page-transition.tsx` | CSS entrance, server component |
| `src/app/layout.tsx` | inline `html.js` marker, `RevealObserver` mount |
| `src/styles/{tokens,theme,animations}.css` | container token rename (bug fix), reveal + transition CSS, reduced-motion and print safeguards |
| `src/lib/motion.ts` | reduced to interaction motion only |

**Deleted:** `src/features/home/seller-cta.tsx` (superseded by `merchant-cta.tsx`).

## 3. Components created

`Hero` · `TrustStrip` · `CategoryCard` · `CategoryRail` · `FeaturedCollection` · `ProductCard` ·
`ProductGrid` (`+ ProductGridSkeleton`) · `BrandCard` · `BrandRail` · `AiPreview` · `TodaysEdit` ·
`EditorialImpact` · `JournalSection` (`+ JournalCard`) · `MerchantCTA` · `FinalCTA` · `MediaTile` ·
`RouteShell` · `RevealObserver` — plus the existing kit (`Button`, `Container`, `Section`,
`PageHeader`, `Badge`, `Tabs`, `Card`, `Drawer`, `Modal`…) reused rather than re-implemented.
The homepage is a composition of twelve section components; no single file holds the page.

## 4. Routes created

| Route | State |
| --- | --- |
| `/` | **fully implemented** — 12 sections, editorial hero, all product/brand/journal/AI/seller content |
| `/shop` | real page: header, scope, category badges, live links |
| `/brands` | real page: scope, demo-maker notice, two brand cards |
| `/collections` | real page: scope, planned collections |
| `/journal` | real page: scope, the three demo articles |
| `/start-selling` | **fully implemented** — seller story, worked example, steps, tools, pricing |

All six are real routes with their own metadata, breadcrumbs and headings. Clicking Explore Products
→ `/shop`, Start Selling → `/start-selling`, Shop → `/shop`, Brands → `/brands`, Collections →
`/collections`, Journal → `/journal`.

## 5. Design system implemented

Colour, type, spacing, radii, shadows, motion and container tokens were already centralised in
`src/styles/tokens.css` (raw `--bhagya-*`) and `src/styles/theme.css` (Tailwind `@theme` bridge).
This step put them to work and fixed one real bug in that layer:

- **Container-token collision (found and fixed).** Tailwind v4 generates `w-*` and `max-w-*`
  utilities from the `--container-*` namespace, so a token named `--container-full` silently
  overwrote `.w-full` and `.max-w-full` — every `w-full` element laid out at 1440px, and the site
  overflowed on every device. The token is now `--container-edge`, with a comment in `tokens.css`
  explaining the naming rule.
- **Editorial hierarchy in practice:** Cormorant Garamond carries the hero and every section
  heading; Inter carries navigation, prices, filters and captions. Green appears only on primary
  buttons, active states, the AI band, the closing CTA and the footer.
- **Motion, split by purpose.** Entrance motion (scroll reveal, page transition) is CSS, driven by
  one shared `IntersectionObserver`; interaction motion (the wishlist pop, the tab-panel fade) is
  Framer Motion. Nothing in the JS bundle owns the first paint.
- **Honest states.** Every claim on the page is one the first version can keep: no invented
  statistics, no certifications, demo makers labelled as demo, the AI section labelled *Preview*,
  and Quick Add / wishlist saying plainly what is not connected yet.

## 6. Responsive behaviour

Verified by measurement, not by eye — 8 widths × 6 routes in Chromium:

| Width | What changes |
| --- | --- |
| 320–430 | Mobile header shows brand + search + cart + menu only; bottom tab bar (Home, Discover, Wishlist, Orders, Account) with 78×64px targets; categories and brands become horizontal snap rails; product grid is two columns; hero stacks with the image below the copy |
| 768 | Two-column category and brand grids; products still two-up with wider gutters; seller sections go side-by-side |
| 1024 | Desktop nav appears; product grid becomes four columns; collection panels move to the asymmetric lead + stacked pair |
| 1280–1440 | Wider gutters and larger editorial type; content capped at the 1312px container so lines never run long |

Fixed during verification: an AI-preview grid that overflowed by 60px at 320px, a collection panel
that printed its name twice, a right-hand column that did not stretch to its lead, and a product
grid whose prices sat on different baselines when a title wrapped. All four are fixed and
re-checked.

## 7. Build result

```
npx tsc --noEmit   ✓ 0 errors
npm run lint       ✓ 0 errors, 0 warnings
npm run build      ✓ compiled · TypeScript passed · 46/46 pages generated
next start         ✓ 6 routes 200 · one h1 each · alt text on every image
next dev           ✓ clean log, no warnings or errors
browser audit      ✓ 8 widths × 6 routes: no console errors, no overflow, no broken
                     images, no missing alt, no broken internal links, targets ≥44px
no-JS check        ✓ 0 elements hidden (reveals are gated on `html.js`)
reduced-motion     ✓ 0 elements hidden, no transition or animation
```

Home page: 20 script files, 916 KB raw / **295 KB gzip** of JavaScript (React 19 + the Next client
runtime dominate; the search dialog, mobile menu, toaster and unused half of the motion bundle all
load on demand). 97 KB of CSS, image masters 2.4 MB across 18 files, served responsive AVIF/WebP
through `next/image`.

## 8. What should be built in STEP 2

1. **Catalogue service** — replace `src/data/products.ts` and `categories.ts` with
   `GET /api/v1/products?bucket=…`, streaming each home tab behind Suspense; build the real `/shop`
   grid with URL-driven filters and sorting.
2. **Product detail pages** — ingredients, care, maker story, shipping, structured data.
3. **Brand and collection pages** — directory, store pages, editorial collection templates.
4. **Journal** — article index and reading experience wired to the CMS.
5. **Accounts and cart** — real sign-in, wishlist and cart persistence, so Quick Add and the
   heart become functional instead of honest placeholders.
6. **Bhagya AI** — the assistant service behind the preview already on the homepage.
7. **Merchant workspace** — the `/merchant/**` shells connected to real store, inventory and order
   management.

Not started, as instructed: no checkout, no authentication, no merchant dashboard logic, no backend.

---

*Media note: five images could not be generated this pass — the two remaining category photographs
(Spiritual, Handmade) and three journal photographs. Those slots render the designed botanical tile
instead, which is why the fallback looks deliberate rather than broken. Say the word and they can be
filled in next turn; nothing else depends on them.*
