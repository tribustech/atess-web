# Teo CMS — Git-backed editing for ATESS site

**Date:** 2026-06-23
**Status:** Approved, implementing in-place on `main`

## Goal

Let Teo (non-technical) edit site content himself through an intuitive
dashboard: write/publish **articles** (Învață), edit **services** text +
photos, and add **projects** (case studies) with their photos. Edits are rare.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Tool | **Sveltia CMS** (Decap successor) | Dashboard + forms UX, actively maintained |
| Storage model | **Git-backed, no database** | Rare edits; near-free; content stays versioned in repo |
| Editing UX | Dashboard with collection lists + forms | Most familiar CMS feel for non-technical editor |
| Images | **In the repo** (`public/images`) | No new infra; project photos served via Next/Image |
| Auth | GitHub OAuth via 2 Next API routes | On Vercel already; no third-party service |
| Editor account | **Shared `atess-editor` GitHub account** (collaborator) | One login to hand Teo |
| Deploy branch | **main** | CMS commits straight to production branch |
| Scope | Articole, Servicii, Proiecte (3 collections) | Galerie is dead code — dropped (see below) |

## Architecture

```
Teo → atess.ro/admin (Sveltia static page)
        │ logs in with shared atess-editor GitHub account
        ▼
   reads/writes src/data/{articles,services,projects}/*.json + public/images/
        │ every Save = a git commit on main
        ▼
   Vercel builds → live on atess.ro (~60s)
```

Added to the repo:
- `public/admin/index.html` — loads Sveltia (one script tag)
- `public/admin/config.yml` — defines the 3 collections + fields
- `/api/auth` + `/api/auth/callback` — GitHub OAuth relay (~40 LOC, secrets in Vercel env)
- Vercel deploy branch points the CMS at `main`

**Unchanged:** React components, `ArticleRenderer`, the article `sections` block
model, and the per-item JSON shapes. The CMS edits the same files we edit by
hand today — if it ever breaks, the site does not.

## Key finding: Galerie is dead code

`/proiecte` no longer renders the photo-wall gallery. `GalleryGrid`,
`GalleryItem`, `FilterChips` are rendered nowhere. `gallery.json` is used only
for SEO JSON-LD + the OG share image. The only user-visible photos come from
**Projects** (`heroImage` + `images`, shown by `ProjectGallery` on
`/proiecte/[slug]`).

→ **Galerie is NOT a CMS collection.** Teo's photos live on Project forms.
→ The `gallery:build` / sharp pipeline largely drops out of this work.
→ Dead-code removal (`GalleryGrid` et al.) is a separate optional cleanup.

## The one structural change

Today each type is a single JSON file holding an array. A dashboard that lists
items individually needs one file per item:

```
src/data/academy.json   → src/data/articles/<slug>.json
src/data/projects.json  → src/data/projects/<slug>.json
src/data/services.json  → src/data/services/<slug>.json
```

Per-item shape is **identical**; only the loaders change from "read one file"
to "read all files in the folder." Covered by existing tests.

## Collections & fields

- **Articole** (`articles/*.json`): title, dek, category, categories, audience,
  level, readingMin, tags, `featured`, `status` (draft/published), and the body
  as a **variable-type block list** (`p`, `h2`, `list`, `ordered`, `callout`,
  `quote`) matching `sections`. Slug auto from title.
- **Servicii** (`services/*.json`): label, shortBlurb, intro, `seoCopy`
  (heading/body blocks), applications, layerPhoto. **Hidden/locked:** `model3dId`,
  `relatedProjectCategory`, `relatedProjectTags`, slugs, `order`, `group`.
- **Proiecte** (`projects/*.json`): title, locationCity, locationJudet, year,
  category, surfaceM2, client, description, whatWeDid, heroImage, images,
  `featured`. Hidden: `systemSlug`, slug (auto).

## Guardrails

- Required fields incl. **image alt text** (matches `assertAllAltsFilled`).
- New articles default to `draft` → not indexed/shown until published.
- Every edit is a revertible commit on main; JSON remains hand-editable.
- Sveltia preview pane; live page ~60s after save.

## Implementation roadmap

1. **Data refactor** — split array files → per-item folders; update
   `lib/academy`, `lib/projects`, add services loader. Gate: tsc + eslint +
   vitest green, pages render identically. (TDD — existing tests drive it.)
2. **Admin page** — `public/admin/index.html` + `config.yml`.
3. **Auth relay** — GitHub OAuth App, `/api/auth*` routes, Vercel env vars,
   create `atess-editor` collaborator.
4. **Wire & verify** — point config at main, deploy, end-to-end edit test.
5. **Cleanup (separate PR)** — remove dead `GalleryGrid`/`GalleryItem`/
   `FilterChips`; decide gallery.json's SEO fate.
6. **Handoff** — one-page Romanian guide for Teo.
