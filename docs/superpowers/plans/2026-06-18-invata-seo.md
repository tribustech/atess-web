# Învață (academy/blog) curation + SEO foundation Implementation Plan

> Executed task-by-task. Each task is a self-contained unit with checkbox steps (2–5 min each),
> an explicit verification gate, and a closing `git` commit. Work top to bottom; do not skip the
> verification gate before committing. NEVER run `npm run build` mid-session (dev and build share
> `.next/` and collide — use `npx tsc --noEmit` + `npm run lint` + `npm run test` as routine gates).

**Goal:** Curate the `Învață` article set to exactly the topics Teo named, pull the competitive-secret article from public view, add multi-category tagging and a `getFeaturedArticles` API for the homepage, and lay an SEO foundation (per-page metadata targeting "covor PVC"/"pardoseli"/"pardoseli de plută", sitemap/JSON-LD coverage of `/invata`).

**Architecture:** Articles live in `src/data/academy.json` and are typed/queried through the pure module `src/lib/academy.ts` (no React, easily unit-testable). Page components (`src/app/invata/page.tsx`, `src/app/invata/[slug]/page.tsx`) and shared cards (`src/components/invata/*`) consume only the exported query functions, so a schema change (single `category` → `categories[]`, plus a `status` field) is absorbed in one place. The SEO layer is Next.js App-Router metadata (`generateMetadata` / `export const metadata`), `app/sitemap.ts`, `app/robots.ts`, and inline JSON-LD `<script>` tags.

**Tech Stack:** Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Zod (available, not required here), lucide-react, Vitest 4 (jsdom, `@`→`src` alias, globals enabled).

## Global Constraints

- Stack: Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react. App lives in `/Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next`.
- Romanian-only site. No i18n / no language toggle.
- Professional Romanian register in ALL user-facing copy: NO `asta`/`astea`/`păi`/`hai să`/conversational shop-talk. Formal, confident, concise.
- ASSET STRATEGY: scaffold everything NOW with placeholders (placeholder logo-on-white, placeholder/existing photos, a parametrized 3D stub, draft copy) so the whole site is reviewable end-to-end and Teo's real assets drop in later. Mark each placeholder clearly in the plan.
- VERIFICATION (pragmatic gates, NOT strict TDD): logic/data/rules tasks get vitest + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint`; visual/3D/copy tasks get manual browser review (`cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`). Commit frequently. DO NOT run `npm run build` mid-session (dev and build share `.next/` and collide).
- Prior settled decisions: Conica removed site-wide (do not reintroduce); Home has no E2/E3/E4 mono section markers.

## File Structure

| File | Create/Modify | Single responsibility |
| --- | --- | --- |
| `src/lib/academy.ts` | Modify | Type definitions + pure query API for articles. Adds `categories[]`, `status`, multi-category grouping, `getFeaturedArticles`, `getPublishedArticles`. |
| `src/data/academy.json` | Modify | The 11 curated articles. Each gets `categories: AcademyCategory[]`; the `capcana-poliuretanilor-colorati` article gets `status: "draft"`; the rest get `status: "published"`. |
| `src/lib/__tests__/academy.test.ts` | Create | Vitest unit tests for the query API (publish filtering, multi-category grouping, featured selection, draft exclusion). |
| `src/app/invata/page.tsx` | Modify | Index page consumes `getPublishedArticles` / grouped / `getFeaturedArticles`; updated SEO copy + Blog JSON-LD over published only. |
| `src/app/invata/[slug]/page.tsx` | Modify | Article page; `generateStaticParams` excludes drafts, `generateMetadata` sets `noindex` for drafts, keyword-rich descriptions, BreadcrumbList JSON-LD. |
| `src/app/sitemap.ts` | Modify | Add `/invata` and every published article URL; keep existing entries. |
| `src/app/robots.ts` | Modify | Explicitly disallow nothing new but keep sitemap pointer (no functional change beyond review note). |
| `docs/academy-keep-cut-add-review.md` | Create | Structured keep/cut/add audit of every existing article (the §5 action item for Andrew). |

## Tasks

### Task 1: Extend the academy data model (multi-category + publish status)

Schema-only change in the typed library so every later task compiles against the new shape. `category` (single) stays as the **primary** category for backwards compatibility and ordering; a new `categories: AcademyCategory[]` array drives multi-category grouping for SEO. A new `status` field gates public visibility.

**Files:**
- Modify `src/lib/academy.ts` (interface block lines 16–27; query functions lines 63–105).

**Interfaces:**
- Produces (new exported types/functions — neighboring plans consume these):
  ```ts
  export type AcademyStatus = "published" | "draft";

  export interface AcademyArticle {
    slug: string;
    title: string;
    dek: string;
    category: AcademyCategory;          // primary category (ordering, breadcrumb)
    categories: AcademyCategory[];      // all categories this article appears under
    audience: AcademyAudience[];
    level: AcademyLevel;
    readingMin: number;
    tags: string[];
    featured: boolean;
    status: AcademyStatus;              // "draft" => excluded from all public surfaces
    sections: AcademySection[];
  }

  export function getPublishedArticles(): AcademyArticle[];
  export function getFeaturedArticles(limit?: number): AcademyArticle[]; // published + featured, primary-category order, capped at limit (default 3)
  ```
- Consumes: `academyRaw` from `@/data/academy.json` (typed via the interface).

**Steps:**
- [ ] In `src/lib/academy.ts`, after the `AcademyAudience` type (line 5), add: `export type AcademyStatus = "published" | "draft";`
- [ ] In the `AcademyArticle` interface, add `categories: AcademyCategory[];` immediately after the `category` field, and add `status: AcademyStatus;` immediately after the `featured` field.
- [ ] Add `export function getPublishedArticles(): AcademyArticle[] { return articles.filter((a) => a.status === "published"); }` directly below `getAllArticles`.
- [ ] Change `getArticleBySlug` to keep returning any article regardless of status (it is used by the draft page itself): leave its body as `return articles.find((a) => a.slug === slug);` (no change — confirm it is not filtered).
- [ ] Replace the body of `getArticlesGroupedByCategory` so it (a) iterates `getPublishedArticles()` instead of `articles`, and (b) pushes an article into **every** category in its `categories` array (multi-category fan-out), de-duplicating per group is unnecessary because a `Map` keyed by category already isolates lists:
  ```ts
  export function getArticlesGroupedByCategory(): Array<{
    category: AcademyCategory;
    label: string;
    sub: string;
    articles: AcademyArticle[];
  }> {
    const map = new Map<AcademyCategory, AcademyArticle[]>();
    for (const a of getPublishedArticles()) {
      const cats = a.categories.length > 0 ? a.categories : [a.category];
      for (const cat of cats) {
        const list = map.get(cat) ?? [];
        list.push(a);
        map.set(cat, list);
      }
    }
    return (Array.from(map.entries()) as Array<[AcademyCategory, AcademyArticle[]]>)
      .map(([category, list]) => ({
        category,
        label: CATEGORY_META[category].label,
        sub: CATEGORY_META[category].sub,
        articles: list,
      }))
      .sort((a, b) => CATEGORY_META[a.category].order - CATEGORY_META[b.category].order);
  }
  ```
- [ ] Change `getRelatedArticles` to source from published only and score by category overlap across the `categories` array:
  ```ts
  export function getRelatedArticles(slug: string, count = 3): AcademyArticle[] {
    const current = getArticleBySlug(slug);
    if (!current) return [];
    const currentCats = current.categories.length > 0 ? current.categories : [current.category];
    const scored = getPublishedArticles()
      .filter((a) => a.slug !== slug)
      .map((a) => {
        const aCats = a.categories.length > 0 ? a.categories : [a.category];
        const catOverlap = aCats.filter((c) => currentCats.includes(c)).length * 2;
        const tagOverlap = a.tags.filter((t) => current.tags.includes(t)).length;
        return { article: a, score: catOverlap + tagOverlap };
      })
      .sort((x, y) => y.score - x.score);
    return scored.slice(0, count).map((s) => s.article);
  }
  ```
- [ ] Add `getFeaturedArticles` below `getPublishedArticles`:
  ```ts
  export function getFeaturedArticles(limit = 3): AcademyArticle[] {
    return getPublishedArticles()
      .filter((a) => a.featured)
      .sort((a, b) => CATEGORY_META[a.category].order - CATEGORY_META[b.category].order)
      .slice(0, limit);
  }
  ```
- [ ] Verify types: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect errors ONLY in `src/data/academy.json` consumers about missing `categories`/`status` (resolved in Task 2). If errors appear in `academy.ts` itself, fix before continuing.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/lib/academy.ts && git commit -m "feat(invata): add multi-category + publish status to academy model"`

### Task 2: Migrate academy.json to the new shape + curate to Teo's named set

Add `categories` and `status` to all 12 existing articles, map each to Teo's named topic, and mark the competitive-secret article as `draft`. The 11 published articles cover Teo's full named list (Inițiere/categorii, Public vs privat, Pardoseli de plută, Bazele, Sportive vs Leisure, Categoriile principale, Ghiduri de decizie, Fișe tehnice & certificări, Linoleumul antifungic mit). No article is deleted — `capcana-poliuretanilor-colorati` is retained in the repo but hidden (decision: **draft flag**, not deletion, so the content survives for internal reference and Teo can reverse the decision).

**Files:**
- Modify `src/data/academy.json` (all 12 article objects).

**Interfaces:**
- Produces: data conforming to `AcademyArticle` (Task 1). Slug→categories mapping consumed implicitly by `getArticlesGroupedByCategory`.

**Mapping reference (apply exactly):**

| slug | `status` | `categories` |
| --- | --- | --- |
| `initiere-pardoseli-sportive` | published | `["fundamente"]` |
| `sportiv-vs-leisure` | published | `["fundamente","decizii"]` |
| `categoriile-principale` | published | `["fundamente"]` |
| `public-vs-privat` | published | `["decizii","fundamente"]` |
| `teren-basket-sau-parcare` | published | `["decizii"]` |
| `grosimile-reale` | published | `["tehnic"]` |
| `capcana-poliuretanilor-colorati` | **draft** | `["tehnic"]` |
| `cum-citesti-o-fisa-tehnica` | published | `["tehnic","decizii"]` |
| `pvc-lvt-linoleum` | published | `["tehnic","specializari"]` |
| `linoleumul-antifungic` | published | `["tehnic"]` |
| `pluta-pentru-locuri-de-joaca` | published | `["specializari","fundamente"]` |
| `constructii-sportive-la-cheie` | published | `["specializari"]` |

**Steps:**
- [ ] Open `src/data/academy.json`. For EACH of the 12 article objects, insert a `"categories"` array (per the mapping table above) immediately after the existing `"category"` line, and a `"status"` field immediately after the existing `"featured"` line.
- [ ] For `capcana-poliuretanilor-colorati` ONLY: set `"status": "draft"` and additionally set `"featured": false` (it must not surface as a recommended article). Leave its `sections` content untouched.
- [ ] Confirm valid JSON: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && node -e "const a=require('./src/data/academy.json'); console.log('articles:',a.length,'| published:',a.filter(x=>x.status==='published').length,'| drafts:',a.filter(x=>x.status==='draft').map(x=>x.slug));"` — expect `articles: 12 | published: 11 | drafts: [ 'capcana-poliuretanilor-colorati' ]`.
- [ ] Verify featured count: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && node -e "const a=require('./src/data/academy.json'); console.log('featured published:', a.filter(x=>x.featured&&x.status==='published').map(x=>x.slug));"` — expect `['initiere-pardoseli-sportive','categoriile-principale','public-vs-privat','pluta-pentru-locuri-de-joaca']` (4 featured, none being the draft).
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect ZERO errors now (data matches the interface).
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/data/academy.json && git commit -m "data(invata): tag multi-category, draft the 220-vs-250 article (pull from public)"`

### Task 3: Unit-test the academy query API

Lock in the behavioral contract: drafts never appear in published surfaces, multi-category fan-out works, featured is capped and excludes drafts.

**Files:**
- Create `src/lib/__tests__/academy.test.ts`.

**Interfaces:**
- Consumes: `getPublishedArticles`, `getAllArticles`, `getArticleBySlug`, `getArticlesGroupedByCategory`, `getFeaturedArticles`, `getRelatedArticles` from `../academy`.

**Steps:**
- [ ] Create `src/lib/__tests__/academy.test.ts` with:
  ```ts
  import { describe, it, expect } from "vitest";
  import {
    getAllArticles,
    getPublishedArticles,
    getArticleBySlug,
    getArticlesGroupedByCategory,
    getFeaturedArticles,
    getRelatedArticles,
  } from "../academy";

  const DRAFT_SLUG = "capcana-poliuretanilor-colorati";

  describe("academy query API", () => {
    it("keeps the draft article in getAllArticles but not in published", () => {
      expect(getAllArticles().some((a) => a.slug === DRAFT_SLUG)).toBe(true);
      expect(getPublishedArticles().some((a) => a.slug === DRAFT_SLUG)).toBe(false);
    });

    it("publishes exactly 11 of 12 articles", () => {
      expect(getAllArticles()).toHaveLength(12);
      expect(getPublishedArticles()).toHaveLength(11);
    });

    it("still resolves the draft article by slug (for its own page)", () => {
      expect(getArticleBySlug(DRAFT_SLUG)?.status).toBe("draft");
    });

    it("fans an article into every one of its categories", () => {
      const grouped = getArticlesGroupedByCategory();
      const fundamente = grouped.find((g) => g.category === "fundamente");
      const decizii = grouped.find((g) => g.category === "decizii");
      expect(fundamente?.articles.some((a) => a.slug === "public-vs-privat")).toBe(true);
      expect(decizii?.articles.some((a) => a.slug === "public-vs-privat")).toBe(true);
    });

    it("never groups the draft article", () => {
      const grouped = getArticlesGroupedByCategory();
      const allGrouped = grouped.flatMap((g) => g.articles.map((a) => a.slug));
      expect(allGrouped).not.toContain(DRAFT_SLUG);
    });

    it("returns featured published articles capped at the limit", () => {
      const featured = getFeaturedArticles(3);
      expect(featured).toHaveLength(3);
      expect(featured.every((a) => a.featured && a.status === "published")).toBe(true);
      expect(featured.some((a) => a.slug === DRAFT_SLUG)).toBe(false);
    });

    it("excludes the draft from related articles", () => {
      const related = getRelatedArticles("grosimile-reale", 5);
      expect(related.some((a) => a.slug === DRAFT_SLUG)).toBe(false);
    });
  });
  ```
- [ ] Run: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run test` — expect all tests in `academy.test.ts` and the existing `configurator-env.test.ts` to pass (green, 0 failures).
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit && npm run lint` — expect no errors, no warnings on new file.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/lib/__tests__/academy.test.ts && git commit -m "test(invata): cover publish filtering, multi-category fan-out, featured cap"`

### Task 4: Update the index page to use published/featured queries + SEO copy

The index currently reads `getAllArticles()` and filters `featured` inline — this would leak the draft. Swap to the new API and broaden the metadata to target the homepage keywords Teo named.

**Files:**
- Modify `src/app/invata/page.tsx` (imports line 4–8; `metadata` lines 12–24; body lines 26–45).

**Interfaces:**
- Consumes: `getPublishedArticles`, `getArticlesGroupedByCategory`, `getFeaturedArticles` from `@/lib/academy`.

**Steps:**
- [ ] Change the import block to: `import { getPublishedArticles, getArticlesGroupedByCategory, getFeaturedArticles } from "@/lib/academy";` (drop `getAllArticles`).
- [ ] In `InvataPage`, replace the first three lines of the body with:
  ```ts
  const all = getPublishedArticles();
  const featured = getFeaturedArticles(3);
  const grouped = getArticlesGroupedByCategory();
  ```
- [ ] In `blogJsonLd.blogPost`, ensure it maps over `all` (now published only) — no further change needed since `all` is reassigned.
- [ ] Replace the `metadata.description` with a keyword-broadened, professional string:
  ```ts
  description:
    "Ghiduri tehnice despre pardoseli sportive, covor PVC, linoleum, LVT și pardoseli de plută. Cum alegi corect, cum citești o fișă tehnică și ce nu spune marketingul — conținut elaborat de ATESS Project.",
  ```
- [ ] Replace `metadata.title` with: `title: "Învață — Ghiduri tehnice pardoseli, covor PVC și pardoseli de plută",`
- [ ] Replace the `metadata.openGraph.description` with:
  ```ts
  description:
    "Ghiduri tehnice pentru arhitecți, proiectanți și beneficiari. Pardoseli sportive, covor PVC, linoleum, pardoseli de plută — tot ce nu apare în fișele tehnice.",
  ```
- [ ] Add `keywords` to `metadata`: `keywords: ["pardoseli", "covor PVC", "linoleum", "pardoseli de plută", "LVT", "pardoseli sportive", "fișă tehnică"],`
- [ ] Browser review: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/invata`. Confirm: (a) exactly 11 article cards across the category sections, (b) the "220 vs 250" card is ABSENT, (c) the Recomandate row shows 3 featured cards, (d) page `<title>` in the browser tab reads the new title. Stop dev (Ctrl-C) when done.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit && npm run lint` — expect clean.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/invata/page.tsx && git commit -m "feat(invata): index uses published/featured queries, SEO copy pass"`

### Task 5: Article page — exclude drafts from static params, noindex drafts, breadcrumb JSON-LD

Drafts must not be statically generated as public pages, and if directly visited must be `noindex`. Add a `BreadcrumbList` JSON-LD and a keyword-aware fallback description.

**Files:**
- Modify `src/app/invata/[slug]/page.tsx` (`generateStaticParams` lines 20–22; `generateMetadata` lines 24–49; `articleJsonLd` lines 68–86).

**Interfaces:**
- Consumes: `getPublishedArticles`, `getArticleBySlug`, `getRelatedArticles`, `CATEGORY_META`, `LEVEL_LABEL` from `@/lib/academy`.

**Steps:**
- [ ] Change the import to add `getPublishedArticles` and keep `getArticleBySlug`, `getRelatedArticles`, `CATEGORY_META`, `LEVEL_LABEL`; drop `getAllArticles`.
- [ ] Change `generateStaticParams` to: `return getPublishedArticles().map((a) => ({ slug: a.slug }));`
- [ ] In `generateMetadata`, after resolving `article`, add a draft guard before the existing return:
  ```ts
  if (article.status === "draft") {
    return {
      title: `${article.title} | Învață`,
      description: article.dek,
      robots: { index: false, follow: false },
      alternates: { canonical: `/invata/${article.slug}` },
    };
  }
  ```
- [ ] In the published return of `generateMetadata`, change `description: article.dek,` to a keyword-enriched composite:
  ```ts
  description: `${article.dek} Ghid tehnic ATESS Project pentru ${article.audience.join(", ")}.`,
  ```
- [ ] In the article body, replace the single `articleJsonLd` `<script>` with a graph that also carries breadcrumbs. Add below `articleJsonLd`:
  ```ts
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Învață", item: `${SITE_URL}/invata` },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryMeta.label,
        item: `${SITE_URL}/invata`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_URL}/invata/${article.slug}`,
      },
    ],
  };
  ```
- [ ] Add a second JSON-LD `<script>` immediately after the existing one in the returned JSX:
  ```tsx
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
  />
  ```
- [ ] Browser review: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`. Visit `http://localhost:3000/invata/grosimile-reale` (published) — confirm it renders, View Source shows two `application/ld+json` blocks (BlogPosting + BreadcrumbList). Visit `http://localhost:3000/invata/capcana-poliuretanilor-colorati` (draft) — confirm it still renders the content (direct access allowed) but View Source shows `<meta name="robots" content="noindex,nofollow">`. Stop dev.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit && npm run lint` — expect clean.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add "src/app/invata/[slug]/page.tsx" && git commit -m "feat(invata): exclude drafts from SSG, noindex drafts, breadcrumb JSON-LD"`

### Task 6: Sitemap — include /invata index and every published article

`src/app/sitemap.ts` currently lists only `/` and `/proiecte`. Add `/invata` and one entry per published article so Google can crawl the SEO engine.

**Files:**
- Modify `src/app/sitemap.ts` (lines 1–23).

**Interfaces:**
- Consumes: `getPublishedArticles` from `@/lib/academy`.

**Steps:**
- [ ] Add import at top of `src/app/sitemap.ts`: `import { getPublishedArticles } from "@/lib/academy";`
- [ ] Inside `sitemap()`, before the `return`, build the article entries:
  ```ts
  const articleEntries: MetadataRoute.Sitemap = getPublishedArticles().map((a) => ({
    url: `${SITE_URL}/invata/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  ```
- [ ] Change the `return [ ... ]` so it includes the `/invata` index and spreads `articleEntries`, replacing the trailing comment:
  ```ts
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/invata`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/proiecte`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...articleEntries,
    // /servicii, /configurator, /despre, /contact added by their owning plans.
  ];
  ```
- [ ] Sanity-check the data source independent of Next: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && node -e "const a=require('./src/data/academy.json'); console.log('expected article sitemap entries:', a.filter(x=>x.status==='published').length);"` — expect `11`.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit && npm run lint` — expect clean.
- [ ] Browser review: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/sitemap.xml`. Confirm `/invata` plus 11 `/invata/<slug>` URLs are present and the draft slug is ABSENT. Stop dev.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/sitemap.ts && git commit -m "feat(seo): sitemap includes /invata index and all published articles"`

### Task 7: Tarkett-style dense technical copy on the index category intros

Teo wants the Tarkett-style technical descriptive copy that ranks. The category section headings on `/invata` currently show only the short `sub` line. Add a dense, keyword-rich intro paragraph per category, sourced from `CATEGORY_META`, in the professional register.

**Files:**
- Modify `src/lib/academy.ts` (`CATEGORY_META` block lines 31–55 — add an `intro` field).
- Modify `src/app/invata/page.tsx` (category section, around lines 119–139 — render the intro).

**Interfaces:**
- Produces: `CATEGORY_META[cat].intro: string` (new field; safe additive — other consumers ignore it).

**Steps:**
- [ ] In `src/lib/academy.ts`, widen the `CATEGORY_META` type to `{ label: string; sub: string; intro: string; order: number }` and add an `intro` to each of the four entries (real Romanian copy below, professional register, keyword-dense):
  ```ts
  fundamente: {
    label: "Bazele",
    sub: "Concepte fundamentale înainte de orice proiect",
    intro:
      "Înainte de a alege un sistem de pardoseală, contează înțelegerea materialelor de bază: poliuretanul, granula EPDM și SBR, modul de construire strat cu strat și destinația suprafeței. Articolele din această secțiune explică diferențele dintre pardoselile sportive, covorul PVC, linoleumul și pardoselile de plută, pe baza practicii reale de șantier.",
    order: 1,
  },
  decizii: {
    label: "Ghiduri de decizie",
    sub: "Cum alegi corect în funcție de context",
    intro:
      "Alegerea corectă a unei pardoseli depinde de context: trafic public sau privat, supraveghere, buget de întreținere și certificările cerute de proiect. Ghidurile de decizie compară opțiunile pentru terenuri sportive, locuri de joacă și spații interioare, astfel încât specificația tehnică să corespundă utilizării reale.",
    order: 2,
  },
  tehnic: {
    label: "Tehnic & mituri",
    sub: "Fișe tehnice, certificări și ce nu-ți spune marketingul",
    intro:
      "Fișa tehnică spune doar o parte din adevăr. Această secțiune analizează grosimile reale, certificările relevante și miturile de marketing din jurul covorului PVC, linoleumului și sistemelor poliuretanice — pentru ca decizia să se bazeze pe date verificabile, nu pe broșuri.",
    order: 3,
  },
  specializari: {
    label: "Specializări",
    sub: "Servicii și sisteme pe care le facem distinct",
    intro:
      "ATESS Project execută sisteme care necesită experiență dedicată: pardoseli de plută pentru locuri de joacă, construcții sportive la cheie și soluții interioare de tip covor PVC, LVT și linoleum. Articolele detaliază cum sunt construite aceste sisteme și unde aduc avantaje față de alternativele standard.",
    order: 4,
  },
  ```
- [ ] In `src/app/invata/page.tsx`, inside the `grouped.map((group) => ...)` header block, after the `<h2 ...>{group.sub}</h2>` line, add:
  ```tsx
  <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
    {CATEGORY_META[group.category].intro}
  </p>
  ```
- [ ] Add `CATEGORY_META` to the page's import from `@/lib/academy`.
- [ ] Browser review: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/invata`. Confirm each of the four category sections now shows a dense intro paragraph below the section subtitle, in formal Romanian (no `asta`/`păi`). Stop dev.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit && npm run lint` — expect clean.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/lib/academy.ts src/app/invata/page.tsx && git commit -m "feat(seo): Tarkett-style dense technical intro per academy category"`

### Task 8: Keep/cut/add review document (the §5 action item)

Encode Teo's explicit ask — "review every article, recommend keep/cut/add" — as a durable, structured doc the team reviews. Pure documentation; no app code.

**Files:**
- Create `docs/academy-keep-cut-add-review.md`.

**Interfaces:**
- None (documentation). Cross-references Teo's named list in `CHANGE-PLAN.md §5`.

**Steps:**
- [ ] Create `docs/academy-keep-cut-add-review.md` with this exact content:
  ```markdown
  # Învață — Keep / Cut / Add review

  Action item from Teo (CHANGE-PLAN.md §5): review every article, recommend keep / cut / add.
  Status legend — KEEP (publish as-is), REVISE (publish after edit), DRAFT (pulled from public),
  ADD (not yet written).

  ## Existing articles (12)

  | Slug | Teo's named topic | Decision | Note |
  | --- | --- | --- | --- |
  | initiere-pardoseli-sportive | Inițiere / Bazele | KEEP | Featured. Core entry point. |
  | sportiv-vs-leisure | Sportive vs Leisure | KEEP | Tagged fundamente + decizii. |
  | categoriile-principale | Categoriile principale | KEEP | Featured. |
  | public-vs-privat | Public vs privat | KEEP | Featured. High-intent decision guide. |
  | teren-basket-sau-parcare | Ghiduri de decizie | KEEP | Concrete worked example. |
  | grosimile-reale | Fișe tehnice ("grosimile reale") | KEEP | Directly matches Teo's phrasing. |
  | capcana-poliuretanilor-colorati | 220 vs 250 | DRAFT | Pulled from public — competitive secret. Retained for internal reference only. |
  | cum-citesti-o-fisa-tehnica | Fișe tehnice & certificări | KEEP | Pairs with grosimile-reale. |
  | pvc-lvt-linoleum | Categoriile principale (interior) | KEEP | Covers covor PVC / LVT / linoleum keywords. |
  | linoleumul-antifungic | Linoleumul "antifungic natural" (mit) | KEEP | Myth-busting angle Teo named. |
  | pluta-pentru-locuri-de-joaca | Pardoseli de plută | KEEP | Featured. "primul gazon cu plută" differentiator. |
  | constructii-sportive-la-cheie | Specializări | KEEP | Service-led, links to Servicii. |

  ## Coverage of Teo's named list

  - [x] Inițiere în pardoseli (categorii) — initiere-pardoseli-sportive + categoriile-principale
  - [x] Public vs privat — de ce contează — public-vs-privat
  - [x] Pardoseli de plută — pluta-pentru-locuri-de-joaca
  - [x] Bazele / inițiere — initiere-pardoseli-sportive
  - [x] Sportive vs Leisure — sportiv-vs-leisure
  - [x] Categoriile principale — categoriile-principale + pvc-lvt-linoleum
  - [x] Ghiduri de decizie — teren-basket-sau-parcare + cum-citesti-o-fisa-tehnica
  - [x] Fișe tehnice & certificări ("grosimile reale") — grosimile-reale + cum-citesti-o-fisa-tehnica
  - [x] Linoleumul "antifungic natural" (mit demontat) — linoleumul-antifungic

  ## Add later (backlog, awaiting Teo's drafts)

  - "Pardoseli de exterior — alei pietonale și piatră resin-bound" (SEO: pardoseli exterior).
  - "Mochetă / Modulyss by Balta — când are sens" (SEO: mochetă birou).
  - "Gazon sintetic cu plută" (ties to the 3D model in §2; SEO: gazon sintetic).

  Open question for Teo: confirm the 220-vs-250 article should remain DRAFT (hidden) rather than deleted.
  ```
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add docs/academy-keep-cut-add-review.md && git commit -m "docs(invata): keep/cut/add review of every article (§5 action item)"`

### Task 9: Final subsystem verification gate

One consolidated pass before handing off, without touching `npm run build`.

**Files:** none (verification only).

**Steps:**
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run test` — all academy + configurator tests green.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — zero errors.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — zero errors/warnings.
- [ ] Browser smoke: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`; verify `/invata` (11 cards, 3 featured, dense intros), one article page (two JSON-LD blocks), `/sitemap.xml` (11 article URLs, no draft). Stop dev.
- [ ] If all green and `git status` is clean, the subsystem is ready. No commit needed (all work already committed).
