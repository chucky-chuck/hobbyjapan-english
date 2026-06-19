# Hobby Japan English Site — Agent Handoff

**Last updated:** 2026-06-19  
**Purpose:** Let a future agent/session continue the site improvement work without re-discovering context.

---

## Project at a glance

| Item | Value |
|------|--------|
| **Local path** | `D:\Claude\hobbyjapan-next` |
| **Production URL** | https://english.hobbyjapan.co.jp |
| **GitHub** | https://github.com/chucky-chuck/hobbyjapan-english.git |
| **Default branch** | `master` |
| **Hosting** | Vercel (team: `windyclover-3111s-projects`, project: `hobbyjapan-english`) |
| **CMS** | Sanity (`/studio`, dataset via `.env.local`) |
| **Stack** | Next.js 15 App Router, React 19, TypeScript, inline styles + `globals.css` (no Tailwind) |

**Note:** Open `D:\Claude\hobbyjapan-next` as the Cursor workspace for full git/TS/lint integration.

---

## What this site does

Official English catalog for Hobby Japan publications (Gunpla / model kit books). Main flows:

1. **Homepage** — featured hero + series filter chips + publication grid
2. **Book detail** — `/books/[slug]` with cover, description, Amazon CTA, optional PDF preview, related books, prev/next navigation
3. **Sanity Studio** — `/studio` (blocked in `robots.ts`)

Data comes from Sanity `book` documents. Sort order: pinned → `releaseDate` desc → legacy `order` field.

---

## Completed work

### Sprint 1 — shipped (commit `068693f`)

| Fix | File(s) |
|-----|---------|
| Hero + grid respect active series filter; featured book no longer duplicated in grid | `app/(site)/page.tsx` |
| Description ellipsis only when text > 200 chars | `app/(site)/page.tsx` |
| Empty state when filter returns no books | `app/(site)/page.tsx` |
| Book page title: no duplicate `\| HOBBY JAPAN` suffix | `app/(site)/books/[slug]/page.tsx` → `generateMetadata` uses `book.title` only; layout template adds suffix |
| Series breadcrumb links to `/?series=…` (UI + JSON-LD) | `app/(site)/books/[slug]/page.tsx` |
| Real 404 pages (not redirect to `/`) | `app/(site)/not-found.tsx`, `app/not-found.tsx` |
| Removed phantom `SearchAction` from WebSite JSON-LD | `app/layout.tsx` |
| Removed unused Header/Footer imports from root layout | `app/layout.tsx` |

**Production verified** after deploy: filter hero, titles, breadcrumbs, 404 all correct.

### Vercel build fix — shipped (commit `5d35f2e`)

**Problem:** Build failed with `No Output Directory named "dist" found`. Vercel was treating the project like a static site.

**Fix:** Added minimal `vercel.json`:

```json
{
  "framework": "nextjs"
}
```

Do **not** add `outputDirectory`, `buildCommand`, or `installCommand` for this Next.js app.

**If build fails again:** Vercel Dashboard → hobbyjapan-english → Settings → Build & Development → Framework Preset = **Next.js**, Output Directory = **empty** (remove `dist`).

### Sprint 2 — UX polish — shipped (commit `ddf9a8b`)

| Fix | File(s) |
|-----|---------|
| Card hover/focus states (lift, border highlight, focus ring) | `app/globals.css`, `app/(site)/page.tsx` |
| Release dates on grid cards; “Coming soon” for future dates | `lib/dates.ts`, `app/(site)/page.tsx` |
| Related books (up to 4 same-series titles) on detail page | `sanity/queries.ts` → `getRelatedBooks`, `app/(site)/books/[slug]/page.tsx` |
| Prev/next labels → “Newer release” / “Older release” | `app/(site)/books/[slug]/page.tsx` |
| Filter bar scroll hint on mobile (fade + thin scrollbar) | `app/globals.css`, `app/(site)/page.tsx` |
| Series colors on filter chips | `lib/series.ts`, `app/(site)/page.tsx` |
| Wired up `.header-inner` class | `components/Header.tsx`, `app/globals.css` |
| Social links use `aria-label` instead of `title` | `components/Header.tsx` |
| Skip-to-content link | `app/(site)/layout.tsx`, `app/globals.css` |
| Contrast: `--text-muted` bumped `#999` → `#adadad` | `app/globals.css` |

**New shared helpers:**

- `lib/series.ts` — `SERIES_COLORS`, `seriesColor()`
- `lib/dates.ts` — `formatReleaseDate()`, `isComingSoon()`

**Production verified** (2026-06-18): Vercel deploy succeeded for both `hobbyjapan-english` and `hobbyjapan-next` projects; https://english.hobbyjapan.co.jp/ loads.

### Post–Sprint 2 — shipped (commit `6e97d6b`)

| Fix | File(s) |
|-----|---------|
| “Japanese Site” link to https://hobbyjapan.co.jp/ in header (external-link icon, hover/focus styles) | `components/Header.tsx`, `app/globals.css` → `.header-corporate-link` |

Label choice: **“Japanese Site”** reads naturally on the English publications subdomain (clearer than “Corporate Site” or raw URL). Footer link still optional.

### Sprint 3 — SEO & URL structure — shipped (commit `2a92139`)

| Fix | File(s) |
|-----|---------|
| Clean series routes `/series/gundam-forward` (replaces `/?series=…`) | `app/(site)/series/[slug]/page.tsx`, `lib/series.ts` |
| Per-series metadata (title, description, canonical, OG/Twitter) | `app/(site)/series/[slug]/page.tsx` |
| Shared catalog UI extracted from homepage | `components/CatalogView.tsx`, `app/(site)/page.tsx` |
| Legacy `/?series=` → `/series/…` 301 redirects | `next.config.ts` |
| Breadcrumb + JSON-LD series links use `/series/…` | `app/(site)/books/[slug]/page.tsx` |
| Sitemap includes all series pages | `app/sitemap.ts` |
| `llms.txt` series sections link to series URLs | `app/llms.txt/route.ts` |
| Centralized `ALL_SERIES`, slugs, descriptions in `lib/series.ts` | `lib/series.ts` |

**New helpers in `lib/series.ts`:** `ALL_SERIES`, `SERIES_DESCRIPTIONS`, `seriesSlug()`, `seriesFromSlug()`, `seriesPath()`

**Per-book OG images:** already wired in book `generateMetadata` (cover from Sanity CDN).

### Sprint 4 — Code quality & features — shipped (uncommitted)

| Fix | File(s) |
|-----|---------|
| Shared `getSiteUrl()` / `PRODUCTION_SITE_URL` | `lib/site.ts`; used in layout, robots, sitemap, llms.txt, book JSON-LD |
| `loading.tsx` skeleton while catalog loads | `app/(site)/loading.tsx`, `app/globals.css` |
| `error.tsx` with retry + home link | `app/(site)/error.tsx` |
| Client-side catalog search (title, series, subtitle, description) | `components/CatalogInteractive.tsx` |
| Vercel Analytics custom events for Amazon + PDF clicks | `components/TrackOutboundLink.tsx`, hero + book detail |
| Catalog UI split: server shell + client interactivity | `components/CatalogView.tsx` → `CatalogInteractive.tsx` |

**Not in this sprint:** full CSS refactor (Tailwind/modules), Sanity preview/draft mode, optional About page.

---

## Remaining improvement plan

Prioritized from the original site analysis. Sprints 1–4 core items are done.

### Sprint 4 — Code quality & features — **done** (see above)

| Task | Status |
|------|--------|
| Shared `lib/site.ts` | Done |
| `loading.tsx` / `error.tsx` | Done — `(site)` route group |
| Search | Done — client-side catalog search |
| Analytics events | Done — `Amazon Click`, `PDF Download` via `@vercel/analytics` |
| CSS refactor | Not started (large scope; defer) |
| Sanity preview / draft mode | Not started |

### Future / optional

| Task | Details |
|------|---------|
| CSS refactor | Move inline styles → CSS modules or Tailwind |
| Sanity preview / draft mode | For editors |
| About page | Short explainer for English line |
| Footer corporate link | Duplicate of header Japanese Site link |

---

## Key files map

```
app/
  layout.tsx              # Root metadata, org + website JSON-LD, Analytics
  (site)/
    layout.tsx            # Skip link, Header + main#main-content + Footer
    page.tsx              # Homepage: all publications (no query params)
    series/[slug]/page.tsx # Per-series catalog + metadata
    loading.tsx           # Catalog skeleton
    error.tsx             # Sanity/fetch error boundary with retry
    not-found.tsx         # 404 with site chrome
    books/[slug]/page.tsx # Book detail + metadata + JSON-LD + related books
  not-found.tsx           # Fallback 404 (routes outside (site))
  globals.css             # CSS variables, card/filter/header/skip-link/corporate-link styles
  sitemap.ts, robots.ts, llms.txt/route.ts
components/
  Header.tsx              # Logo, Japanese Site link, social icons
  Footer.tsx
  CatalogView.tsx         # Server wrapper for catalog pages
  CatalogInteractive.tsx  # Client catalog: search, hero, filter, grid
  TrackOutboundLink.tsx   # Outbound links with Vercel Analytics events
lib/
  site.ts                 # getSiteUrl(), PRODUCTION_SITE_URL
  series.ts               # ALL_SERIES, SERIES_COLORS, SERIES_DESCRIPTIONS, seriesSlug/Path/FromSlug
  dates.ts                # formatReleaseDate(), isComingSoon()
sanity/
  queries.ts              # getAllBooks, getBook, getAdjacentBooks, getRelatedBooks
  schemas/book.ts         # CMS schema
vercel.json               # framework: nextjs only
docs/
  CONTINUATION.md         # This handoff doc
```

### Patterns to follow

- **ISR:** `export const revalidate = 60` on dynamic pages
- **Styling:** Mostly inline `style={{}}` for layout; interactive/hover states in `globals.css` — match gold/dark palette (`--accent: #c8a84b`, `--text-muted: #adadad`)
- **Images:** Sanity CDN via `cover { asset->{ url } }`; `next.config.ts` allows `cdn.sanity.io`
- **Featured book logic** (post–Sprint 1):

```ts
const isAll = !activeSeries || activeSeries === 'ALL'
const catalog = isAll ? books : books.filter((b) => b.series === activeSeries)
const featured = catalog[0] ?? null
const gridBooks = catalog.slice(1)
```

- **Adjacent book nav** (post–Sprint 2): `prev` = newer release, `next` = older release (by `releaseDate` desc catalog order)

### Known slug example

Featured book “Mobile Suit Gundam 0080: War in the Pocket” → slug `war-in-the-pocket` (not `mobile-suit-gundam-0080-war-in-the-pocket`).

---

## Deployment

### Normal flow

```powershell
cd D:\Claude\hobbyjapan-next
npm run build          # verify locally first
git push origin master # triggers Vercel auto-deploy
```

### Environment variables (Vercel + `.env.local`)

- `NEXT_PUBLIC_SITE_URL` → `https://english.hobbyjapan.co.jp`
- Sanity: project ID, dataset, API token (see `.env.local` — do not commit)

### Auth gotchas (learned 2026-06-17)

| Tool | Issue | Resolution |
|------|-------|------------|
| `git push` | 403 with default token | User ran `gh auth refresh -h github.com -s repo` (Option B device flow) |
| `vercel deploy` | Logged into wrong team (`azurepebbleous-7537`) | Project lives under `windyclover-3111s-projects` — use Git push instead, or `vercel login` with correct account |
| Vercel MCP | Same team scope 403 | Authenticate to windyclover team if using MCP tools |

### Do not commit

`.env.local`, `.vercel/`, `.claude/`, `.cursor/`, `.letta/`, `tsconfig.tsbuildinfo`, editor artifacts.

---

## Uncommitted local changes (as of 2026-06-18)

**Modified (not staged):**

- `.gitignore`
- `scripts/migrate.mjs` — description typo fixes only; unrelated to site deploys

**Untracked (review before committing):**

- `app/favicon.ico`, `app/llms.txt/` (route may already exist in tree — verify)
- `scripts/migrate-assets.mjs`, `scripts/patch-dates.mjs`, `scripts/patch-descriptions.mjs`
- `manual.html`, `next-env.d.ts`
- `.claude/`, `.cursor/`, `.letta/` — do not commit

---

## Production smoke test checklist

After any deploy, verify:

- [ ] https://english.hobbyjapan.co.jp/ loads
- [ ] `/series/gundam-forward` → hero shows **IBO 10th Anniversary** (GUNDAM FORWARD), not 0080
- [ ] `/?series=GUNDAM%20FORWARD` 301 → `/series/gundam-forward`
- [ ] `/books/war-in-the-pocket` → title `… \| HOBBY JAPAN` (single suffix)
- [ ] Breadcrumb “HJ MECHANICS” is clickable → `/series/hj-mechanics`
- [ ] `/books/nonexistent-slug` → 404 page with header/footer (HTTP 404, not redirect)
- [ ] Amazon + PDF links work on a book with those fields
- [ ] Catalog search filters publications by title (e.g. "0080")
- [ ] `/studio` still loads for editors
- [ ] Grid cards show formatted release dates; hover/focus states work
- [ ] Book detail shows “More in {series}” related books when applicable
- [ ] Prev/next nav labels read “Newer release” / “Older release”
- [ ] Tab on load reveals skip-to-content link
- [ ] Header “Japanese Site” opens https://hobbyjapan.co.jp/ in a new tab

---

## Original analysis context

The site was analyzed live at `http://localhost:3000` and via codebase review. Overall assessment: **solid foundation** (Sanity, SEO basics, `llms.txt`, OG image, analytics) with **URL structure and deeper SEO** as the main remaining gaps. Sprint 1 fixed confusing bugs (filter/hero mismatch, SEO inconsistencies, 404 behavior). Sprint 2 added UX polish and accessibility.

**Suggested next action for the next agent:** Optional About page, Sanity preview/draft mode, or CSS refactor — otherwise site improvement backlog is largely complete.

---

## Git history (relevant commits)

```
6e97d6b Add Japanese Site link to header for hobbyjapan.co.jp
ddf9a8b Polish catalog UX with hover states, release dates, related books, and a11y improvements
5d35f2e Fix Vercel build: use Next.js framework preset instead of dist output
068693f Fix catalog filter logic, 404 handling, and SEO metadata
2eb3771 Add Vercel Analytics
b04b31a Add programmatic OG image (1200x630) via next/og
```
