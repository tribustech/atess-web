# Servicii information architecture, category pages & nav mega-menu Implementation Plan

> Executed task-by-task. Each task has bite-sized checkbox steps (2–5 min each), explicit verification, and ends with a git commit. Do the tasks in order; do not skip the verification gates.

**Goal:** Replace the `Servicii` "Coming soon" placeholder with a full Interior/Exterior service taxonomy — an index page, per-category pages with technical SEO copy and a real layer-photo slot, a hover mega-menu in the Header with a per-category 3D slot, and hard cross-links to Proiecte and Home.

**Architecture:** A single typed services taxonomy data file (`src/data/services.json`) plus an accessor library (`src/lib/services.ts`) is the source of truth for both the mega-menu and the category pages. `src/app/servicii/page.tsx` becomes a real index that renders Interior/Exterior columns; `src/app/servicii/[category]/page.tsx` is a dynamic route generating one static page per category. The Header mega-menu consumes the same library and renders a parametrized 3D stub per category (the real 3D component is owned by the flooring-3d plan; we consume it by a documented prop contract and ship a local stub until it lands).

**Tech Stack:** Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react. App root: `/Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next`.

## Global Constraints

- Stack: Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react. App lives in `/Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next`.
- Romanian-only site. No i18n / no language toggle.
- Professional Romanian register in ALL user-facing copy: NO `asta`/`astea`/`păi`/`hai să`/conversational shop-talk. Formal, confident, concise.
- ASSET STRATEGY: scaffold everything NOW with placeholders (placeholder logo-on-white, placeholder/existing photos, a parametrized 3D stub, draft copy) so the whole site is reviewable end-to-end and Teo's real assets drop in later. Each placeholder is marked clearly in the plan.
- VERIFICATION (pragmatic gates, NOT strict TDD): logic/data/rules tasks get vitest + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint`; visual/3D/copy tasks get manual browser review (`cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`). Commit frequently. DO NOT run `npm run build` mid-session (dev and build share `.next/` and collide).
- Prior settled decisions: Conica removed site-wide (do not reintroduce); Home has no E2/E3/E4 mono section markers.

## File Structure

| File | Create/Modify | Responsibility |
| --- | --- | --- |
| `src/data/services.json` | Create | Source of truth: Interior/Exterior axes → categories → per-category content (title, intro, technical SEO copy, layer-photo slot, 3D slot id, related project category + related article slugs). |
| `src/lib/services.ts` | Create | Zod schema + typed accessors over `services.json` (`getAllCategories`, `getCategory`, `getAxes`, `getMegaMenuModel`). Validates data at import. |
| `src/lib/__tests__/services.test.ts` | Create | vitest coverage for the schema, accessors, and taxonomy invariants. |
| `src/components/servicii/ServicesMegaMenu.tsx` | Create | Mega-menu panel (Interior/Exterior columns, per-category 3D slot, links). Consumed by Header. |
| `src/components/servicii/CategoryMega3D.tsx` | Create | Thin wrapper that renders the parametrized 3D component for one category inside the mega-menu; ships a local stub until the flooring-3d plan delivers `FlooringModel`. |
| `src/components/servicii/ServiceCategoryCard.tsx` | Create | Card used on the Servicii index for each category (label, blurb, thumb, cross-links). |
| `src/components/servicii/CategoryLayerPhoto.tsx` | Create | On a category page, renders the real layer build PHOTO (placeholder image now), with caption. |
| `src/components/servicii/RelatedProjectsLink.tsx` | Create | Cross-link block from a category page to the matching Proiecte filter and back to Home. |
| `src/app/servicii/page.tsx` | Modify (replace whole file) | Servicii index: Interior vs Exterior columns of category cards + intro + cross-links. |
| `src/app/servicii/[category]/page.tsx` | Create | Dynamic per-category page: hero, intro, technical SEO copy, layer photo, related projects, back-to-Home. `generateStaticParams` + `generateMetadata`. |
| `src/components/shared/Header.tsx` | Modify (NAV + nav render, ~lines 10–17, 59–77) | Wire `Servicii` nav item to open `ServicesMegaMenu` on hover/focus; keep other items as plain links; mega-menu also reachable on mobile accordion. |

## Tasks

---

### Task 1: Services taxonomy data file

**Files:**
- Create `src/data/services.json`

**Interfaces:**
- Produces the raw JSON shape (validated/typed in Task 2). Each category object:
```jsonc
{
  "slug": "sport-outdoor",          // URL segment under /servicii/
  "axis": "exterior",               // "interior" | "exterior"
  "order": 1,
  "label": "Pardoseli sportive outdoor",
  "shortBlurb": "…",                // mega-menu + card one-liner
  "intro": "…",                     // page intro paragraph
  "seoCopy": [ { "heading": "…", "body": "…" } ],  // Tarkett-style technical sections
  "applications": ["…"],
  "isSport": true,                  // sport categories carry the indoor/outdoor split
  "model3dId": "sport-outdoor",     // key the 3D plan parametrizes on
  "layerPhoto": { "src": "/images/services/placeholder-layers.webp", "alt": "…", "caption": "…", "placeholder": true },
  "relatedProjectCategory": "piste-atletism",  // GalleryCategory slug for /proiecte filter
  "relatedArticleSlugs": []         // academy.json slugs
}
```

**Steps:**
- [ ] Create `src/data/services.json` as an array. Add the **Exterior** categories in this order: `sport-outdoor` (Pardoseli sportive outdoor, `isSport: true`, `relatedProjectCategory: "piste-atletism"`), `locuri-joaca` (Pardoseli pentru locuri de joacă, `isSport: false`, `relatedProjectCategory: "locuri-joaca"`), `pardoseli-piatra` (Pardoseli de piatră, resin/stone-bound, `isSport: false`, `relatedProjectCategory: "multisport"`), `alei-pietonale` (Alei pietonale, non-sport, `isSport: false`, `relatedProjectCategory: "multisport"`).
- [ ] Add the **Interior** categories: `sport-indoor` (Pardoseli sportive indoor, `isSport: true`, `relatedProjectCategory: "multisport"`), `mocheta` (Mochetă, `isSport: false`, `relatedProjectCategory: "interioare"`), `pvc-linoleum` (Covor PVC, linoleum și tapet PVC — ONE combined category, `isSport: false`, `relatedProjectCategory: "interioare"`), `lvt` (LVT, `isSport: false`, `relatedProjectCategory: "interioare"`).
- [ ] For `sport-outdoor` write `label: "Pardoseli sportive outdoor"`, `shortBlurb: "Piste de atletism, terenuri multisport și suprafețe EPDM omologate, construite pentru exterior."`, `intro: "Pardoselile sportive de exterior sunt expuse la UV, îngheț, ploaie și utilizare intensivă. Construim sisteme turnate, de la fundație până la stratul de uzură, dimensionate pentru climatul și traficul fiecărui proiect."` Set `model3dId: "sport-outdoor"`, `layerPhoto.src: "/images/services/placeholder-layers.webp"`, `layerPhoto.placeholder: true`, `layerPhoto.alt: "Secțiune prin straturile unui sistem sportiv de exterior"`, `layerPhoto.caption: "Imagine demonstrativă a structurii pe straturi (înlocuită cu fotografia reală)."`, `relatedArticleSlugs: []`.
- [ ] Fill `seoCopy` for `sport-outdoor` with two sections (Tarkett-style technical copy): `{ "heading": "Structura pe straturi", "body": "Sistemul standard se construiește de jos în sus: bază de beton sau asfalt, amorsă de aderență, strat amortizor SBR, straturi de poliuretan și suprafață de uzură EPDM. Fiecare strat are o grosime calculată în funcție de disciplina sportivă și clasa de absorbție a impactului." }` and `{ "heading": "Montaj și întreținere", "body": "Aplicarea respectă fișa tehnică originală a producătorului: pregătirea suportului, controlul umidității și al temperaturii, dozarea corectă a componentelor. Întreținerea periodică — curățare și verificarea drenajului — prelungește durata de viață a suprafeței." }`.
- [ ] For `locuri-joaca`: `shortBlurb: "Suprafețe turnate antitraumatice pentru locuri de joacă, inclusiv plută naturală."`, `intro: "Locurile de joacă au cerințe proprii de siguranță: înălțimea critică de cădere și absorbția impactului se calculează pentru fiecare echipament. Aplicăm sisteme EPDM și, în premieră în România, pardoseli din plută naturală."` `seoCopy` two sections: `{ "heading": "Siguranță și HIC", "body": "Grosimea stratului antitraumatic se dimensionează după înălțimea critică de cădere (HIC) a fiecărui echipament. Verificăm conformitatea cu standardele de siguranță înainte de turnare." }`, `{ "heading": "Plută vs. EPDM", "body": "Pluta naturală nu se încinge la soare, permite drenajul apei și nu conține solvenți. Reprezintă un nivel superior față de EPDM-ul clasic, justificat în proiecte premium." }`. `applications: ["Grădinițe și creșe", "Parcuri publice", "Spații de joacă rezidențiale"]`.
- [ ] For `pardoseli-piatra`: `shortBlurb: "Covoare de piatră pe liant rășinos pentru alei, terase și zone pietonale decorative."`, `intro: "Pardoselile de piatră combină agregate naturale cu un liant rășinos transparent, rezultând o suprafață drenantă, decorativă și rezistentă pentru exterior."` `seoCopy`: `{ "heading": "Compoziție", "body": "Agregatele de marmură sau pietriș sunt amestecate cu un liant poliuretanic sau epoxidic și aplicate pe o bază pregătită corespunzător. Rezultă o suprafață continuă, fără rosturi." }`, `{ "heading": "Aplicații", "body": "Recomandată pentru alei, terase, zone din jurul piscinelor și amenajări peisagistice unde se dorește un aspect natural și un drenaj bun." }`. `applications: ["Alei și terase", "Zone de piscină", "Amenajări peisagistice"]`.
- [ ] For `alei-pietonale`: `shortBlurb: "Suprafețe continue pentru circulații pietonale, fără destinație sportivă."`, `intro: "Aleile pietonale cer suprafețe durabile, antiderapante și ușor de întreținut. Propunem sisteme turnate adaptate traficului pietonal și condițiilor de exterior."` `seoCopy`: `{ "heading": "Criterii de alegere", "body": "Selecția sistemului ține cont de trafic, expunerea la intemperii și aspectul dorit. Suprafața finală trebuie să fie antiderapantă și rezistentă la uzură." }`. `applications: ["Circulații în parcuri", "Trotuare amenajate", "Spații instituționale"]`.
- [ ] For `sport-indoor`: `shortBlurb: "Pardoseli sportive de interior pentru săli, baze și spații multifuncționale."`, `intro: "Pardoselile sportive de interior sunt alese după disciplină, intensitatea utilizării și cerințele de elasticitate. Lucrăm atât sisteme turnate, cât și soluții PVC sportiv omologate."` `seoCopy`: `{ "heading": "Tipuri de sisteme", "body": "Pentru interior se folosesc sisteme poliuretanice turnate sau pardoseli PVC sportive, fiecare cu clase proprii de absorbție a impactului și de alunecare controlată." }`, `{ "heading": "Omologare și marcaje", "body": "Suprafețele competiționale respectă cerințele federațiilor sportive. Marcajele se planifică din proiectare, pentru a evita suprapunerile." }`. `applications: ["Săli de sport școlare", "Baze sportive private", "Spații multifuncționale"]`.
- [ ] For `mocheta`: `shortBlurb: "Mochetă în plăci și din rolă pentru birouri și spații comerciale."`, `intro: "Mocheta oferă confort acustic și termic pentru birouri și spații comerciale. Lucrăm cu portofolii de producători recunoscuți, în plăci modulare sau din rolă."` `seoCopy`: `{ "heading": "Plăci vs. rolă", "body": "Plăcile modulare permit înlocuirea punctuală și gestionarea cablajului, în timp ce mocheta din rolă oferă o suprafață continuă. Alegerea depinde de utilizare și de bugetul de întreținere." }`. `applications: ["Birouri corporate", "Spații comerciale", "Hoteluri"]`.
- [ ] For `pvc-linoleum` (ONE combined category — same manufacturer/portfolio): `label: "Covor PVC, linoleum și tapet PVC"`, `shortBlurb: "Covor PVC, linoleum natural și tapet PVC — un singur portofoliu de producător."`, `intro: "Covorul PVC, linoleumul și tapetul PVC provin din același portofoliu de producător și acoperă spațiile medicale, educaționale și comerciale. Fiecare mediu cere o clasă de trafic și un tip de finisaj diferit."` `seoCopy`: `{ "heading": "Ce diferențiază un PVC bun", "body": "Un covor PVC de calitate are mai mult poliuretan și mai puțină cretă, fiind mai ușor pe metru pătrat și mai rezistent în timp. Diferența se observă după câțiva ani de utilizare." }`, `{ "heading": "Linoleumul natural", "body": "Linoleumul natural are proprietăți antifungice, însă întreținerea cu produse clorinate anulează acest avantaj. Recomandăm un protocol de curățare adecvat." }`. `applications: ["Unități medicale", "Spații educaționale", "Spații comerciale"]`.
- [ ] For `lvt`: `shortBlurb: "Luxury Vinyl Tile cu aspect de lemn sau piatră, rezistent la trafic și umezeală."`, `intro: "LVT-ul reproduce aspectul lemnului sau al pietrei, dar rezistă la umezeală și trafic intens. Este potrivit pentru spații rezidențiale premium și comerciale."` `seoCopy`: `{ "heading": "Avantaje", "body": "LVT-urile bune arată identic cu parchetul, dar tolerează umezeala și traficul intens. Montajul poate fi prin lipire sau prin sistem click." }`. `applications: ["Spații rezidențiale premium", "Showroom-uri", "Birouri"]`.
- [ ] Set `model3dId` for each category equal to its slug, and `relatedArticleSlugs: []` for every category for now (to be filled when the academy plan lands).
- [ ] **Placeholder marked:** every `layerPhoto.src` is `/images/services/placeholder-layers.webp` with `placeholder: true` — Teo's real per-category layer photos drop in later. Do NOT create the image yet; Task 5 adds the placeholder file.
- [ ] Verify the file is valid JSON: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && node -e "JSON.parse(require('fs').readFileSync('src/data/services.json','utf8')); console.log('OK')"` — expect `OK`.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/data/services.json && git commit -m "Add Servicii taxonomy data (Interior/Exterior categories)"`

---

### Task 2: Services accessor library + Zod schema

**Files:**
- Create `src/lib/services.ts`

**Interfaces (Produces — neighboring plans import these names):**
```ts
export type ServiceAxis = "interior" | "exterior";
export interface ServiceSeoSection { heading: string; body: string; }
export interface ServiceLayerPhoto { src: string; alt: string; caption: string; placeholder: boolean; }
export interface ServiceCategory {
  slug: string;
  axis: ServiceAxis;
  order: number;
  label: string;
  shortBlurb: string;
  intro: string;
  seoCopy: ServiceSeoSection[];
  applications: string[];
  isSport: boolean;
  model3dId: string;
  layerPhoto: ServiceLayerPhoto;
  relatedProjectCategory: string;   // GalleryCategory slug
  relatedArticleSlugs: string[];
}
export function getAllCategories(): ServiceCategory[];           // sorted by axis then order
export function getCategory(slug: string): ServiceCategory | undefined;
export function getCategoriesByAxis(axis: ServiceAxis): ServiceCategory[];
export function getMegaMenuModelId(slug: string): string | undefined;
export const AXIS_LABEL: Record<ServiceAxis, string>;           // { interior: "Interior", exterior: "Exterior" }
```

**Steps:**
- [ ] Create `src/lib/services.ts`. Import `servicesRaw from "@/data/services.json"` and `import { z } from "zod"`.
- [ ] Define `const layerPhotoSchema = z.object({ src: z.string(), alt: z.string(), caption: z.string(), placeholder: z.boolean() });`
- [ ] Define `const categorySchema = z.object({ slug: z.string(), axis: z.enum(["interior","exterior"]), order: z.number(), label: z.string(), shortBlurb: z.string(), intro: z.string(), seoCopy: z.array(z.object({ heading: z.string(), body: z.string() })), applications: z.array(z.string()), isSport: z.boolean(), model3dId: z.string(), layerPhoto: layerPhotoSchema, relatedProjectCategory: z.string(), relatedArticleSlugs: z.array(z.string()) });`
- [ ] `const categories = z.array(categorySchema).parse(servicesRaw);` so invalid data throws at import (build/test time).
- [ ] Export the TS interfaces above (use `z.infer` or hand-write to match — hand-write `ServiceCategory` so neighboring plans get a stable named type).
- [ ] Implement `getAllCategories()` returning `[...categories].sort((a,b) => a.axis === b.axis ? a.order - b.order : a.axis.localeCompare(b.axis))`.
- [ ] Implement `getCategory(slug)`, `getCategoriesByAxis(axis)` (filtered + order-sorted), `getMegaMenuModelId(slug)` (returns `getCategory(slug)?.model3dId`).
- [ ] Export `export const AXIS_LABEL: Record<ServiceAxis, string> = { interior: "Interior", exterior: "Exterior" };`
- [ ] Create `src/lib/__tests__/services.test.ts`. Test: (a) `getAllCategories()` length is 8; (b) every slug is unique; (c) `getCategoriesByAxis("exterior")` returns the 4 exterior slugs and `"interior"` returns 4; (d) `getCategory("pvc-linoleum")?.label` equals `"Covor PVC, linoleum și tapet PVC"`; (e) every `relatedProjectCategory` is one of the known GalleryCategory slugs `["piste-atletism","multisport","locuri-joaca","educational","interioare"]`; (f) `getMegaMenuModelId("sport-outdoor")` equals `"sport-outdoor"`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx vitest run src/lib/__tests__/services.test.ts` — expect all tests pass.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no errors.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/lib/services.ts src/lib/__tests__/services.test.ts && git commit -m "Add services accessor library with Zod validation and tests"`

---

### Task 3: Category 3D mega-menu slot (parametrized stub)

**Files:**
- Create `src/components/servicii/CategoryMega3D.tsx`

**Interfaces:**
- Consumes (CROSS-PLAN DEPENDENCY — owned by the flooring-3d plan): a parametrized component the 3D plan must export. The prop contract THIS plan requires:
```ts
// expected from the flooring-3d plan, e.g. "@/components/home/FlooringSystem"
export interface FlooringModelProps {
  modelId: string;          // matches ServiceCategory.model3dId
  variant?: "mega" | "page";// "mega" = small autoplay loop in menu; "page" not used here
  autoRotate?: boolean;     // default true in mega
  className?: string;
  interactive?: boolean;    // default false in mega (no orbit controls)
}
export function FlooringModel(props: FlooringModelProps): JSX.Element;
```
- Produces:
```ts
export interface CategoryMega3DProps { modelId: string; className?: string; }
export function CategoryMega3D(props: CategoryMega3DProps): JSX.Element;
```

**Steps:**
- [ ] Create `src/components/servicii/CategoryMega3D.tsx` with `"use client";` at the top.
- [ ] Add a top-of-file comment: `// PLACEHOLDER 3D: renders a static gradient tile until the flooring-3d plan ships FlooringModel({ modelId, variant: "mega" }). Swap the inner div for <FlooringModel modelId={modelId} variant="mega" autoRotate /> when available.`
- [ ] Implement `CategoryMega3D({ modelId, className })` returning a small square slot: a `div` with `className={cn("relative aspect-square w-full overflow-hidden rounded-md bg-gradient-to-br from-neutral-800 to-neutral-950", className)}` containing a centered muted label `<span className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-widest text-text-muted">{modelId}</span>` and a small `lucide-react` `Box` icon top-left as a "3D" affordance.
- [ ] Import `cn` from `@/lib/utils/cn`.
- [ ] **Placeholder marked:** this is a deliberate stub. The real per-category 3D is provided by the flooring-3d plan via `FlooringModel`; do not build geometry here.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no errors.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/servicii/CategoryMega3D.tsx && git commit -m "Add CategoryMega3D stub with documented FlooringModel prop contract"`

---

### Task 4: ServicesMegaMenu component

**Files:**
- Create `src/components/servicii/ServicesMegaMenu.tsx`

**Interfaces:**
```ts
export interface ServicesMegaMenuProps {
  onNavigate?: () => void;   // called when a link is clicked (Header closes menu / mobile)
}
export function ServicesMegaMenu(props: ServicesMegaMenuProps): JSX.Element;
```

**Steps:**
- [ ] Create `src/components/servicii/ServicesMegaMenu.tsx` with `"use client";`.
- [ ] Import `Link` from `next/link`, `getCategoriesByAxis`, `AXIS_LABEL` from `@/lib/services`, `CategoryMega3D` from `./CategoryMega3D`, `cn` from `@/lib/utils/cn`.
- [ ] Render a two-column grid (Exterior left, Interior right on `lg`, stacked on small). For each axis call `getCategoriesByAxis(axis)`.
- [ ] Column header: `<p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-primary">{AXIS_LABEL[axis]}</p>`.
- [ ] Each category is a `Link href={`/servicii/${cat.slug}`} onClick={onNavigate}` containing `<CategoryMega3D modelId={cat.model3dId} className="w-16 shrink-0" />`, the `cat.label` (`text-sm font-medium text-text-primary`), and `cat.shortBlurb` (`text-xs text-text-muted line-clamp-2`). Hover state: `hover:bg-white/5 rounded-md`.
- [ ] Add a footer row inside the panel with two cross-links (hard requirement): `<Link href="/servicii" onClick={onNavigate}>Toate serviciile</Link>` and `<Link href="/proiecte" onClick={onNavigate}>Vezi proiecte</Link>`, styled `text-xs uppercase tracking-wider text-text-muted hover:text-text-primary`.
- [ ] Wrap the panel in a container `className="w-[min(90vw,880px)] rounded-lg border border-border bg-bg-base/95 p-6 shadow-2xl backdrop-blur-md"`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` and `npm run lint` — expect no errors.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/servicii/ServicesMegaMenu.tsx && git commit -m "Add ServicesMegaMenu panel (Interior/Exterior columns, 3D slots, cross-links)"`

---

### Task 5: Placeholder layer photo asset

**Files:**
- Create `public/images/services/placeholder-layers.webp` (copied from an existing repo image)

**Interfaces:** none (asset only).

**Steps:**
- [ ] Create the directory and copy an existing webp as the placeholder so every category page has a real, visible image now: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && mkdir -p public/images/services && cp public/images/multisport-hero.webp public/images/services/placeholder-layers.webp`. If `multisport-hero.webp` is absent, pick any existing `public/images/*.webp` (run `ls public/images/*.webp | head -1`).
- [ ] **Placeholder marked:** this single file stands in for every category's real layer-build photo. When Teo sends per-category layer photos, add `public/images/services/<slug>-layers.webp` and update each category's `layerPhoto.src` in `services.json`.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add public/images/services/placeholder-layers.webp && git commit -m "Add placeholder layer-build photo for Servicii categories"`

---

### Task 6: Category layer photo + related-projects cross-link components

**Files:**
- Create `src/components/servicii/CategoryLayerPhoto.tsx`
- Create `src/components/servicii/RelatedProjectsLink.tsx`

**Interfaces:**
```ts
export interface CategoryLayerPhotoProps { photo: ServiceLayerPhoto; }     // from @/lib/services
export function CategoryLayerPhoto(props: CategoryLayerPhotoProps): JSX.Element;

export interface RelatedProjectsLinkProps { projectCategory: string; categoryLabel: string; }
export function RelatedProjectsLink(props: RelatedProjectsLinkProps): JSX.Element;
```

**Steps:**
- [ ] Create `src/components/servicii/CategoryLayerPhoto.tsx` (server component, no `"use client"`). Import `Image` from `next/image` and `ServiceLayerPhoto` type from `@/lib/services`.
- [ ] Render a `figure` with `<Image src={photo.src} alt={photo.alt} width={1200} height={800} className="w-full rounded-lg object-cover" />` and a `<figcaption className="mt-2 text-xs text-text-muted">{photo.caption}</figcaption>`.
- [ ] If `photo.placeholder` is true, add a small badge `<span className="...">Imagine demonstrativă</span>` over the image so reviewers see it is a placeholder.
- [ ] Create `src/components/servicii/RelatedProjectsLink.tsx` (server component). Import `Link` and lucide `ArrowUpRight`, `ArrowLeft`.
- [ ] Render TWO hard cross-links (requirement): one to Proiecte filtered by category `<Link href={`/proiecte?categorie=${projectCategory}`}>Vezi proiecte din categoria {categoryLabel} <ArrowUpRight/></Link>` and one back to Home `<Link href="/">Înapoi la pagina principală <ArrowLeft/></Link>`.
- [ ] Note in a code comment that `/proiecte?categorie=<slug>` requires the Proiecte plan to read the `categorie` query param into its FilterChips; this is a documented cross-plan dependency (see crossPlanDeps). If the param is unsupported, the link still lands on `/proiecte`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` and `npm run lint` — expect no errors.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/servicii/CategoryLayerPhoto.tsx src/components/servicii/RelatedProjectsLink.tsx && git commit -m "Add CategoryLayerPhoto and RelatedProjectsLink cross-link components"`

---

### Task 7: Servicii index page

**Files:**
- Create `src/components/servicii/ServiceCategoryCard.tsx`
- Modify `src/app/servicii/page.tsx` (replace the whole 13-line ComingSoon file)

**Interfaces:**
```ts
export interface ServiceCategoryCardProps { category: ServiceCategory; }
export function ServiceCategoryCard(props: ServiceCategoryCardProps): JSX.Element;
```

**Steps:**
- [ ] Create `src/components/servicii/ServiceCategoryCard.tsx` (server component). Import `Link`, `Image`, `ServiceCategory` from `@/lib/services`.
- [ ] Render a `Link href={`/servicii/${category.slug}`}` card: thumb `<Image src={category.layerPhoto.src} alt="" width={480} height={320} className="aspect-[3/2] w-full rounded-md object-cover" />`, label `<h3 className="mt-3 text-lg font-medium text-text-primary">{category.label}</h3>`, blurb `<p className="mt-1 text-sm text-text-muted">{category.shortBlurb}</p>`, and a small `Sportiv` tag when `category.isSport` is true.
- [ ] Replace the entire contents of `src/app/servicii/page.tsx`. Remove the `ComingSoon` import. Import `getCategoriesByAxis`, `AXIS_LABEL` from `@/lib/services`, `ServiceCategoryCard`, and `Link`.
- [ ] Set metadata: `export const metadata: Metadata = { title: "Servicii — pardoseli profesionale interioare și exterioare", description: "Pardoseli sportive, locuri de joacă, PVC, linoleum, LVT și mochetă. Servicii complete de la proiectare la execuție.", alternates: { canonical: "/servicii" } };` — remove the `robots: { index: false }` line so the page is indexable.
- [ ] Page body: a header (`<h1 className="text-display-lg">Servicii</h1>` + intro paragraph `Construim și aplicăm pardoseli profesionale pentru interior și exterior — de la suprafețe sportive omologate la soluții decorative și comerciale. Fiecare proiect este tratat ca un serviciu complet: consultanță, proiectare, execuție și garanție.`).
- [ ] Render two sections, one per axis. For each axis: a heading `<h2>{AXIS_LABEL[axis]}</h2>` and a responsive grid of `ServiceCategoryCard` from `getCategoriesByAxis(axis)`.
- [ ] Add a closing cross-link row (hard requirement): `<Link href="/proiecte">Vezi proiectele realizate</Link>` and `<Link href="/configurator">Configurează-ți proiectul</Link>`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` and `npm run lint` — expect no errors.
- [ ] Manual browser review: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/servicii`. Confirm: two columns Exterior (4 cards) and Interior (4 cards); the PVC card reads "Covor PVC, linoleum și tapet PVC"; sport cards show the "Sportiv" tag; cross-links at the bottom navigate. Stop the dev server before continuing.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/servicii/ServiceCategoryCard.tsx src/app/servicii/page.tsx && git commit -m "Build Servicii index page (Interior/Exterior category grids)"`

---

### Task 8: Per-category dynamic page

**Files:**
- Create `src/app/servicii/[category]/page.tsx`

**Interfaces:**
```ts
export async function generateStaticParams(): Promise<{ category: string }[]>;
export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata>;
export default async function ServiceCategoryPage(props: { params: Promise<{ category: string }> }): Promise<JSX.Element>;
```

**Steps:**
- [ ] Create `src/app/servicii/[category]/page.tsx`. Import `Metadata`, `notFound` from `next/navigation`, `getAllCategories`, `getCategory` from `@/lib/services`, `CategoryLayerPhoto`, `RelatedProjectsLink`.
- [ ] `generateStaticParams`: `return getAllCategories().map((c) => ({ category: c.slug }));`
- [ ] `generateMetadata`: await params, `const cat = getCategory(category)`; if absent return `{ title: "Serviciu negăsit", robots: { index: false, follow: false } }`; else return `{ title: `${cat.label} | Servicii`, description: cat.shortBlurb, alternates: { canonical: `/servicii/${cat.slug}` }, openGraph: { title: cat.label, description: cat.shortBlurb, url: `/servicii/${cat.slug}`, type: "website" } }`.
- [ ] Default export: await params, `const cat = getCategory(category); if (!cat) notFound();`.
- [ ] Render hero (`<h1>{cat.label}</h1>` + `<p>{cat.intro}</p>`), then `<CategoryLayerPhoto photo={cat.layerPhoto} />` (the real layer PHOTO on the page, NOT the 3D — requirement §1).
- [ ] Render `cat.seoCopy.map(...)` as `<section><h2>{s.heading}</h2><p>{s.body}</p></section>` (the Tarkett-style technical SEO copy).
- [ ] Render `cat.applications` as a labelled list (`<h2>Aplicații</h2>` + `<ul>`).
- [ ] Render `<RelatedProjectsLink projectCategory={cat.relatedProjectCategory} categoryLabel={cat.label} />` (cross-links to Proiecte and Home — hard requirement).
- [ ] Add JSON-LD `Service` schema block (`@type: "Service"`, `name: cat.label`, `provider: { @type: "Organization", name: "ATESS Project" }`, `areaServed: "România"`) via a `<script type="application/ld+json">` like the despre/invata pages do.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` and `npm run lint` — expect no errors.
- [ ] Manual browser review: `npm run dev`, visit `http://localhost:3000/servicii/pvc-linoleum`, `/servicii/sport-outdoor`, `/servicii/locuri-joaca`. Confirm: intro, layer PHOTO with "Imagine demonstrativă" badge, two technical SEO sections, applications list, related-projects + back-to-Home links. Visit `/servicii/inexistent` and confirm 404. Stop the dev server.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add "src/app/servicii/[category]/page.tsx" && git commit -m "Add per-category Servicii pages with technical SEO copy and cross-links"`

---

### Task 9: Wire the mega-menu into the Header

**Files:**
- Modify `src/components/shared/Header.tsx` (NAV array lines 10–17; desktop nav render lines 59–77; mobile nav lines 88–109)

**Interfaces:** Consumes `ServicesMegaMenu` from `@/components/servicii/ServicesMegaMenu`.

**Steps:**
- [ ] Read `src/components/shared/Header.tsx` (already a client component). Import `ServicesMegaMenu` and add local state `const [megaOpen, setMegaOpen] = useState(false);`.
- [ ] In the desktop `nav` (lines 59–77), special-case the `Servicii` item: wrap it in a `div` with `onMouseEnter={() => setMegaOpen(true)}` and `onMouseLeave={() => setMegaOpen(false)}` (and `onFocus`/`onBlur` on the link for keyboard access). Keep the existing link styling and `isActive` logic; render all other NAV items unchanged.
- [ ] Below the trigger, conditionally render the panel when `megaOpen`: an absolutely-positioned wrapper `<div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">` containing `<ServicesMegaMenu onNavigate={() => setMegaOpen(false)} />`. Keep `onMouseEnter`/`onMouseLeave` on this wrapper so moving into the panel does not close it. Wrap with Framer Motion `AnimatePresence` + a short fade/translate for polish (the project already uses framer-motion).
- [ ] Close the mega-menu on route change: add `useEffect(() => setMegaOpen(false), [pathname]);` (pathname already read at line 20).
- [ ] In the mobile menu (lines 88–109), under the `Servicii` row, render an inline accordion listing all categories grouped by axis as plain `Link`s (`/servicii/${slug}`), each calling `setMobileOpen(false)` on click. Use `getCategoriesByAxis` from `@/lib/services` for the list. No 3D on mobile.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` and `npm run lint` — expect no errors.
- [ ] Manual browser review: `npm run dev`, on any page hover `Servicii` in the header — the mega-menu opens with Interior/Exterior columns and 3D placeholder slots; clicking a category navigates and the menu closes; moving the mouse into the panel does not close it; on a narrow viewport the mobile menu shows the category accordion. Stop the dev server.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/shared/Header.tsx && git commit -m "Wire Servicii hover mega-menu into Header (desktop + mobile accordion)"`

---

### Task 10: Sitemap + final integration sweep

**Files:**
- Modify `src/app/sitemap.ts` (add Servicii routes)

**Interfaces:** Consumes `getAllCategories` from `@/lib/services`.

**Steps:**
- [ ] Read `src/app/sitemap.ts`. Import `getAllCategories` from `@/lib/services` and append `/servicii` plus every `/servicii/${c.slug}` to the returned URL list (mirroring how existing routes are listed).
- [ ] Confirm the Servicii index `metadata` no longer carries `robots: { index: false }` (set in Task 7) so the new pages are indexable.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx vitest run` — expect the full suite (including `services.test.ts`) green.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no errors.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] Manual browser review: `npm run dev`, walk Home → hover Servicii → open `pvc-linoleum` → click "Vezi proiecte din categoria…" → use "Înapoi la pagina principală". Confirm every hop routes. Stop the dev server.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/sitemap.ts && git commit -m "Add Servicii routes to sitemap and finalize IA integration"`

---

## Notes for the executor

- Do NOT run `npm run build` at any point during the session (dev and build collide on `.next/`). The pragmatic gates are `npx vitest run`, `npx tsc --noEmit`, and `npm run lint`.
- The 3D in the mega-menu is intentionally a stub (`CategoryMega3D`). When the flooring-3d plan ships `FlooringModel`, swap the inner div in `CategoryMega3D.tsx` for `<FlooringModel modelId={modelId} variant="mega" autoRotate />` — no other file needs to change.
- Conica must not appear anywhere in copy or data. Home E2/E3/E4 mono markers are gone — do not reintroduce mono section markers on the new pages either (use plain headings).
