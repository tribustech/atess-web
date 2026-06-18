# Despre: principii/direcții rework, quotes, founder story + Utilaje & Echipă showcase Implementation Plan

> Executed task-by-task. Each task is a self-contained unit ending in a commit. Work through the `- [ ]` steps in order; do not skip the verification step at the end of each task. Tasks are sized for 2-5 minutes each. This plan assumes zero prior knowledge of the codebase.

**Goal:** Rework the `/despre` page so it keeps a single founder-story block, curates the quotes, keeps "3 principii" (with principle #2 replaced by a professional draft), renames "4 direcții" → "Direcțiile noastre" with each card linking into Servicii/Proiecte, and adds a new Utilaje & Echipă showcase grid with clearly-marked placeholder images.

**Architecture:** `/despre` is a server component (`src/app/despre/page.tsx`) that composes presentational section components from `src/components/despre/*`. Section copy lives inline in each component as module-level `const` arrays — there is no CMS, all edits are code edits. This plan edits three existing components (`PrinciplesGrid`, `PillarsGrid`→ direction cards, `ManifestoQuote`/`MissionBlock` quote curation), adds one new `EquipmentShowcase` component plus a small typed data module + Zod schema for its grid items, and re-orders the page composition.

**Tech Stack:** Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react, vitest 4 (jsdom).

## Global Constraints

- Stack: Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react. App lives in `/Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next`.
- Romanian-only site. No i18n / no language toggle.
- Professional Romanian register in ALL user-facing copy: NO asta/astea/păi/hai să/conversational shop-talk. Formal, confident, concise.
- ASSET STRATEGY: scaffold everything NOW with placeholders (placeholder logo-on-white, placeholder/existing photos, a parametrized 3D stub, draft copy) so the whole site is reviewable end-to-end and Teo's real assets drop in later. Mark each placeholder clearly in the plan.
- VERIFICATION (pragmatic gates, NOT strict TDD): logic/data/rules tasks get vitest + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint`; visual/3D/copy tasks get manual browser review (`cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`). Commit frequently. DO NOT run `npm run build` mid-session (dev and build share `.next/` and collide).
- Prior settled decisions: Conica removed site-wide (do not reintroduce); Home has no E2/E3/E4 mono section markers.

## File Structure

| File | Create/Modify | Responsibility |
| --- | --- | --- |
| `src/app/despre/page.tsx` | Modify | Page composition + metadata. Re-orders sections, drops the redundant founder block, mounts `<EquipmentShowcase />`. |
| `src/components/despre/HeroAbout.tsx` | Modify (copy only) | Founder-story block #1 — survives as the personal story (kept). Minor headline retained. |
| `src/components/despre/ManifestoQuote.tsx` | Modify | The single curated pull-quote. Replaced with the approved "Ne-am asumat rolul de specialiști…" quote. |
| `src/components/despre/MissionBlock.tsx` | Modify | Founder story prose ("cine sunt, de unde am apărut") — the ONE surviving personal narrative. Re-titled. |
| `src/components/despre/PrinciplesGrid.tsx` | Modify | "Trei principii" — principle #2 replaced with professional draft, marked for Teo approval. |
| `src/components/despre/PillarsGrid.tsx` | Modify | Renamed "Patru direcții" → "Direcțiile noastre"; each card links to its Servicii/Proiecte route. |
| `src/components/despre/EquipmentShowcase.tsx` | Create | NEW — Utilaje & Echipă grid (machine cut-outs, Dubă, team photo) from placeholder assets. |
| `src/data/equipment.ts` | Create | Typed `EQUIPMENT_ITEMS` array + `EquipmentItem` type consumed by `EquipmentShowcase`. |
| `src/data/equipment.schema.ts` | Create | Zod schema validating equipment items (kind, image path, alt, placeholder flag). |
| `src/data/__tests__/equipment.test.ts` | Create | vitest: validates the equipment data against the schema and rule invariants. |
| `src/components/despre/__tests__/direction-links.test.ts` | Create | vitest: asserts every direction card has a non-empty internal `href`. |
| `public/images/placeholders/equipment-machine-1.svg` … `-6.svg` | Create | PLACEHOLDER machine cut-out images (logo-on-white SVG). |
| `public/images/placeholders/equipment-duba.svg` | Create | PLACEHOLDER van (Dubă) image. |
| `public/images/placeholders/equipment-team.svg` | Create | PLACEHOLDER team photo. |

## Tasks

### Task 1: Curate the pull-quote (ManifestoQuote → approved quote)

The current `ManifestoQuote` shows "Nu am citit fișe tehnice…" attributed to Teo. The spec (§8) names the quote to KEEP. Swap the quote text to the approved one and keep the same visual treatment.

**Files:**
- Modify `src/components/despre/ManifestoQuote.tsx` (lines 11-18, the `<blockquote>` + attribution)

**Interfaces:**
- Consumes: none. Produces: `export function ManifestoQuote(): JSX.Element` (unchanged signature).

- [ ] In `src/components/despre/ManifestoQuote.tsx`, replace the `<blockquote>` body (lines 11-15) text with the approved quote:
  ```tsx
        <blockquote className="mt-2 font-serif text-2xl italic leading-snug text-text-primary md:text-3xl lg:text-4xl">
          Ne-am asumat rolul de specialiști. Venim cu experiența din spate, nu
          cu broșuri. Dacă proiectul nu are sens așa cum este scris, îl
          schimbăm. Aceasta este meseria noastră, nu doar să turnăm cauciuc.
        </blockquote>
  ```
- [ ] Keep the attribution line (`— Teo Neagu`) unchanged at lines 16-18.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/despre`, confirm the pull-quote now reads "Ne-am asumat rolul de specialiști…" with the large serif opening quotation mark and "— Teo Neagu" beneath it.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/ManifestoQuote.tsx && git commit -m "despre: curate pull-quote to approved specialist quote"`

### Task 2: Re-frame MissionBlock as the surviving founder story

`MissionBlock` currently carries mission prose that duplicates the curated quote's "turnăm cauciuc" line. Per §8 the ONE surviving personal narrative ("cine sunt, de unde am apărut") lives here. Re-title it and rewrite the second paragraph so it does not collide with the Task 1 quote, while keeping the professional register.

**Files:**
- Modify `src/components/despre/MissionBlock.tsx` (lines 6-23: eyebrow, heading, two paragraphs)

**Interfaces:**
- Consumes: none. Produces: `export function MissionBlock(): JSX.Element` (unchanged signature).

- [ ] In `src/components/despre/MissionBlock.tsx`, change the eyebrow (line 6-8) from `Misiunea` to `Povestea fondatorului`:
  ```tsx
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
            Povestea fondatorului
          </p>
  ```
- [ ] Change the heading (line 9) from `De ce facem asta.` to `De unde am pornit.`:
  ```tsx
          <h2 className="mt-4 text-display-lg">De unde am pornit.</h2>
  ```
- [ ] Replace the first paragraph (lines 13-18) with the founder-origin draft:
  ```tsx
          <p>
            Am pornit de pe șantier, nu din spatele unui catalog. Primele
            proiecte le-am învățat turnând, greșind și corectând — la rece, în
            condiții reale, cu beneficiari care aveau nevoie de o suprafață care
            rezistă, nu de o promisiune. Din acel teren a crescut ATESS Project.
          </p>
  ```
- [ ] Replace the second paragraph (lines 19-23) — keep it a founder narrative, NOT the specialist quote (that now lives in `ManifestoQuote`):
  ```tsx
          <p>
            Astăzi am structurat experiența într-o echipă și într-un set de
            sisteme pe care le cunoaștem la nivel chimic. Aceeași disciplină de
            la prima turnare ne ghidează fiecare proiect: dacă o soluție nu
            rezistă în timp, nu o propunem.
          </p>
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] In the running dev server open `http://localhost:3000/despre`; confirm the block eyebrow reads "Povestea fondatorului", heading "De unde am pornit.", and the prose reads as a founder origin story with no "turnăm cauciuc" duplication of the pull-quote.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/MissionBlock.tsx && git commit -m "despre: reframe MissionBlock as the surviving founder story"`

### Task 3: Replace principle #2 in PrinciplesGrid (mark for Teo approval)

Per §8, keep the "3 principii" but replace principle #2 ("200g în plus, mereu") with a professionally drafted alternative. Keep principles #1 and #3. Add a clearly-marked approval comment above the data array.

**Files:**
- Modify `src/components/despre/PrinciplesGrid.tsx` (lines 1-17: the `PRINCIPLES` array; index `02` object at lines 7-11)

**Interfaces:**
- Consumes: none. Produces: `export function PrinciplesGrid(): JSX.Element` (unchanged signature). Internal `PRINCIPLES` shape stays `{ index: string; title: string; body: string }[]`.

- [ ] In `src/components/despre/PrinciplesGrid.tsx`, add an approval-marker comment immediately before `const PRINCIPLES = [` (line 1):
  ```tsx
  // DRAFT — principiul #2 rescris de dev, în așteptarea aprobării Teo/Ioana.
  // Înlocuiește vechiul „200g în plus, mereu". Textul final vine prin cod.
  ```
- [ ] Replace the index `02` object (lines 7-11) with the professional draft:
  ```tsx
    {
      index: "02",
      title: "Specificația corectă, nu cea minimă",
      body: "Fișa tehnică indică un minim de proiectare; noi dimensionăm sistemul pentru utilizarea reală. Acolo unde proiectul cere mai mult, propunem mai mult — pentru ca suprafața să nu ajungă în mentenanță sau garanție după primul sezon.",
    },
  ```
- [ ] Leave principles `01` ("Învățat pe șantier") and `03` ("Schimbăm soluția") unchanged.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors for this file.
- [ ] In the dev server open `http://localhost:3000/despre`; confirm the middle card now reads "Specificația corectă, nu cea minimă" and the section header still says "Trei principii." with three cards total.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/PrinciplesGrid.tsx && git commit -m "despre: replace principle #2 with professional draft (pending Teo approval)"`

### Task 4: Rename "Patru direcții" → "Direcțiile noastre" and per-card routing

Per §8, rename the section (more than four are coming) and make each card link to a specific Servicii/Proiecte route instead of all pointing to `/servicii`. The route targets use category slugs from `src/data/systems.json` (`piste-atletism`, `multisport`, `educational`, `constructii-cheie`) under the `/servicii/[category]` route that the Servicii subsystem plan owns. See cross-plan dependency note at the end.

**Files:**
- Modify `src/components/despre/PillarsGrid.tsx` (lines 4-21: `PILLARS` array → add `href`; lines 30-32 header copy; lines 44-48 per-card `href`)

**Interfaces:**
- Consumes: none. Produces: `export function PillarsGrid(): JSX.Element` (unchanged signature). Internal `PILLARS` shape becomes `{ title: string; body: string; href: string }[]` — the new `href` field is the per-card route.

- [ ] In `src/components/despre/PillarsGrid.tsx`, replace the `PILLARS` array (lines 4-21) with four entries that each carry an `href`:
  ```tsx
  const PILLARS = [
    {
      title: "Pardoseli sportive",
      body: "Terenuri multisport, săli de sport, baze CNI. Opt sisteme Stockmeier, fiecare cu rolul lui.",
      href: "/servicii/multisport",
    },
    {
      title: "Piste de atletism omologate",
      body: "Cu certificare World Athletics. Doar trei firme din România le pot pune — suntem una dintre ele.",
      href: "/servicii/piste-atletism",
    },
    {
      title: "Educație & locuri de joacă",
      body: "Grădinițe, școli, parcuri. Inclusiv pardoseli din plută — singurul aplicator certificat din țară.",
      href: "/servicii/educational",
    },
    {
      title: "Construcții la cheie",
      body: "De la concept la predare: proiectare, avize, autorizații, turnări, finisaj. Un singur interlocutor pentru tot.",
      href: "/servicii/constructii-cheie",
    },
  ];
  ```
- [ ] Change the section eyebrow + heading (lines 30-32) from `Ce facem` / `Patru direcții.` to:
  ```tsx
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
              Experiența noastră
            </p>
            <h2 className="mt-4 text-display-lg">Direcțiile noastre.</h2>
  ```
- [ ] Add a sentence under the heading so the "more than four" intent reads clearly. Insert immediately after the `</h2>` closing tag (inside the `max-w-2xl` div):
  ```tsx
            <p className="mt-5 text-lg text-text-muted">
              Patru dintre direcțiile pe care le acoperim astăzi. Lista crește pe
              măsură ce extindem serviciile.
            </p>
  ```
- [ ] In the card `<Link>` (line 45-48), change `href="/servicii"` to `href={p.href}` so each card routes to its own page:
  ```tsx
              <Link
                key={p.title}
                href={p.href}
                className="group flex items-start gap-6 border border-border bg-bg-base p-8 transition-all hover:-translate-y-1 hover:border-accent-primary"
              >
  ```
- [ ] Leave the header "Vezi toate serviciile" link to `/servicii` (the umbrella) unchanged.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] In the dev server open `http://localhost:3000/despre`; confirm the section reads "Direcțiile noastre." with the "lista crește" subline, and hovering each card shows its distinct destination in the browser status bar (e.g. `/servicii/piste-atletism`). Note: until the Servicii plan ships the `[category]` route these links may 404 — that is expected and tracked as a cross-plan dependency.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/PillarsGrid.tsx && git commit -m "despre: rename directions section and route each card to its servicii page"`

### Task 5: Direction-links data invariant test

Lock the §8 hard requirement ("each card must link") with a unit test that imports the card data and asserts every entry has a non-empty internal `href`. Because `PILLARS` is currently module-private, export it for testability.

**Files:**
- Modify `src/components/despre/PillarsGrid.tsx` (line 4: `const PILLARS` → `export const PILLARS`)
- Create `src/components/despre/__tests__/direction-links.test.ts`

**Interfaces:**
- Produces: `export const PILLARS: { title: string; body: string; href: string }[]` from `src/components/despre/PillarsGrid.tsx` — consumable by the Servicii plan to verify route coverage.

- [ ] In `src/components/despre/PillarsGrid.tsx`, change `const PILLARS = [` to `export const PILLARS = [`.
- [ ] Create `src/components/despre/__tests__/direction-links.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { PILLARS } from "../PillarsGrid";

  describe("Despre direction cards", () => {
    it("exposes at least four directions", () => {
      expect(PILLARS.length).toBeGreaterThanOrEqual(4);
    });

    it("every card links to an internal route", () => {
      for (const p of PILLARS) {
        expect(p.href, `${p.title} missing href`).toBeTruthy();
        expect(p.href.startsWith("/"), `${p.title} href must be internal`).toBe(
          true
        );
      }
    });

    it("routes the two flagship directions to their servicii pages", () => {
      const bySport = PILLARS.find((p) => p.title === "Pardoseli sportive");
      const byTrack = PILLARS.find(
        (p) => p.title === "Piste de atletism omologate"
      );
      expect(bySport?.href).toBe("/servicii/multisport");
      expect(byTrack?.href).toBe("/servicii/piste-atletism");
    });
  });
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm test -- direction-links` — expect 3 passing tests, exit 0.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/PillarsGrid.tsx src/components/despre/__tests__/direction-links.test.ts && git commit -m "despre: lock direction-card routing with unit test"`

### Task 6: Create placeholder equipment/team SVG assets

The Utilaje & Echipă showcase (§7) needs machine cut-outs, the van (Dubă), and a team photo. Teo owes the real photos. Scaffold with clearly-marked placeholder SVGs (logo-on-white style: a neutral card with a label) so the grid is reviewable now.

**Files:**
- Create `public/images/placeholders/equipment-machine-1.svg` through `-6.svg`
- Create `public/images/placeholders/equipment-duba.svg`
- Create `public/images/placeholders/equipment-team.svg`

**Interfaces:**
- Produces: eight static asset paths under `/images/placeholders/` referenced by `src/data/equipment.ts` (Task 7).

- [ ] Create the directory and the six machine placeholders with a script. Run:
  ```bash
  cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && mkdir -p public/images/placeholders && for i in 1 2 3 4 5 6; do printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Placeholder utilaj %s"><rect width="800" height="600" fill="#f4f4f5"/><rect x="1" y="1" width="798" height="598" fill="none" stroke="#d4d4d8" stroke-dasharray="8 6"/><text x="400" y="290" font-family="monospace" font-size="26" fill="#71717a" text-anchor="middle">UTILAJ %s</text><text x="400" y="330" font-family="monospace" font-size="16" fill="#a1a1aa" text-anchor="middle">PLACEHOLDER — foto reală de la Teo</text></svg>' "$i" "$i" > "public/images/placeholders/equipment-machine-$i.svg"; done
  ```
- [ ] Create the Dubă placeholder. Run:
  ```bash
  cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="Placeholder dubă"><rect width="1200" height="600" fill="#f4f4f5"/><rect x="1" y="1" width="1198" height="598" fill="none" stroke="#d4d4d8" stroke-dasharray="8 6"/><text x="600" y="290" font-family="monospace" font-size="30" fill="#71717a" text-anchor="middle">DUBĂ ATESS</text><text x="600" y="335" font-family="monospace" font-size="16" fill="#a1a1aa" text-anchor="middle">PLACEHOLDER — foto reală de la Teo</text></svg>' > public/images/placeholders/equipment-duba.svg
  ```
- [ ] Create the team placeholder. Run:
  ```bash
  cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && printf '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="Placeholder echipă"><rect width="1200" height="800" fill="#f4f4f5"/><rect x="1" y="1" width="1198" height="798" fill="none" stroke="#d4d4d8" stroke-dasharray="8 6"/><text x="600" y="390" font-family="monospace" font-size="32" fill="#71717a" text-anchor="middle">ECHIPA ATESS</text><text x="600" y="435" font-family="monospace" font-size="16" fill="#a1a1aa" text-anchor="middle">PLACEHOLDER — foto reală de la Teo</text></svg>' > public/images/placeholders/equipment-team.svg
  ```
- [ ] Verify all eight files exist: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && ls public/images/placeholders/` — expect `equipment-duba.svg`, `equipment-machine-1.svg` … `equipment-machine-6.svg`, `equipment-team.svg`.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add public/images/placeholders && git commit -m "despre: add placeholder utilaje/duba/echipa SVG assets"`

### Task 7: Equipment data module + Zod schema

Provide a typed, validated data source for the showcase grid. The schema marks every item as a placeholder so the eventual asset swap is auditable.

**Files:**
- Create `src/data/equipment.schema.ts`
- Create `src/data/equipment.ts`

**Interfaces:**
- Produces from `src/data/equipment.schema.ts`: `export const equipmentItemSchema: z.ZodType<EquipmentItem>`, `export const equipmentItemsSchema`, `export type EquipmentItem = { id: string; kind: "machine" | "van" | "team"; src: string; alt: string; isPlaceholder: boolean; span?: "wide" | "tall" }`.
- Produces from `src/data/equipment.ts`: `export const EQUIPMENT_ITEMS: EquipmentItem[]` (validated at module load).

- [ ] Create `src/data/equipment.schema.ts`:
  ```ts
  import { z } from "zod";

  export const equipmentItemSchema = z.object({
    id: z.string().min(1),
    kind: z.enum(["machine", "van", "team"]),
    src: z.string().startsWith("/images/"),
    alt: z.string().min(8),
    isPlaceholder: z.boolean(),
    span: z.enum(["wide", "tall"]).optional(),
  });

  export const equipmentItemsSchema = z.array(equipmentItemSchema).min(1);

  export type EquipmentItem = z.infer<typeof equipmentItemSchema>;
  ```
- [ ] Create `src/data/equipment.ts`:
  ```ts
  import { equipmentItemsSchema, type EquipmentItem } from "./equipment.schema";

  // PLACEHOLDER assets — toate imaginile sunt provizorii până trimite Teo
  // foto reale (utilaje decupate, dubă, echipă). Schimbă `src` și pune
  // `isPlaceholder: false` la fiecare item odată ce sosește fotografia.
  const items: EquipmentItem[] = [
    {
      id: "machine-1",
      kind: "machine",
      src: "/images/placeholders/equipment-machine-1.svg",
      alt: "Utilaj de aplicare a pardoselilor poliuretanice",
      isPlaceholder: true,
    },
    {
      id: "machine-2",
      kind: "machine",
      src: "/images/placeholders/equipment-machine-2.svg",
      alt: "Malaxor pentru amestec de rășină și agregat",
      isPlaceholder: true,
    },
    {
      id: "machine-3",
      kind: "machine",
      src: "/images/placeholders/equipment-machine-3.svg",
      alt: "Mașină de șlefuit suprafețe de beton",
      isPlaceholder: true,
    },
    {
      id: "machine-4",
      kind: "machine",
      src: "/images/placeholders/equipment-machine-4.svg",
      alt: "Pompă pentru turnarea sistemelor sport",
      isPlaceholder: true,
    },
    {
      id: "machine-5",
      kind: "machine",
      src: "/images/placeholders/equipment-machine-5.svg",
      alt: "Echipament de pulverizare pentru strat EPDM",
      isPlaceholder: true,
    },
    {
      id: "machine-6",
      kind: "machine",
      src: "/images/placeholders/equipment-machine-6.svg",
      alt: "Utilaj de compactare pentru substrat",
      isPlaceholder: true,
    },
    {
      id: "duba",
      kind: "van",
      src: "/images/placeholders/equipment-duba.svg",
      alt: "Duba de transport echipamente ATESS",
      isPlaceholder: true,
      span: "wide",
    },
    {
      id: "team",
      kind: "team",
      src: "/images/placeholders/equipment-team.svg",
      alt: "Echipa ATESS pe șantier",
      isPlaceholder: true,
      span: "tall",
    },
  ];

  export const EQUIPMENT_ITEMS: EquipmentItem[] = equipmentItemsSchema.parse(items);
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/data/equipment.schema.ts src/data/equipment.ts && git commit -m "despre: add validated equipment data module + zod schema"`

### Task 8: Equipment data unit test

Validate the data invariants: schema passes, every placeholder `src` resolves to a real file on disk, and the showcase contains exactly one van and one team item.

**Files:**
- Create `src/data/__tests__/equipment.test.ts`

**Interfaces:**
- Consumes: `EQUIPMENT_ITEMS` from `src/data/equipment.ts`, `equipmentItemsSchema` from `src/data/equipment.schema.ts`.

- [ ] Create `src/data/__tests__/equipment.test.ts`:
  ```ts
  import { describe, it, expect } from "vitest";
  import { existsSync } from "node:fs";
  import { resolve } from "node:path";
  import { EQUIPMENT_ITEMS } from "../equipment";
  import { equipmentItemsSchema } from "../equipment.schema";

  describe("EQUIPMENT_ITEMS", () => {
    it("satisfies the schema", () => {
      expect(() => equipmentItemsSchema.parse(EQUIPMENT_ITEMS)).not.toThrow();
    });

    it("has exactly one van and one team item", () => {
      expect(EQUIPMENT_ITEMS.filter((i) => i.kind === "van")).toHaveLength(1);
      expect(EQUIPMENT_ITEMS.filter((i) => i.kind === "team")).toHaveLength(1);
    });

    it("has at least four machine items", () => {
      expect(
        EQUIPMENT_ITEMS.filter((i) => i.kind === "machine").length
      ).toBeGreaterThanOrEqual(4);
    });

    it("every image src points to an existing file in public/", () => {
      for (const item of EQUIPMENT_ITEMS) {
        const path = resolve(__dirname, "../../../public", item.src.slice(1));
        expect(existsSync(path), `${item.id}: ${item.src} missing`).toBe(true);
      }
    });
  });
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm test -- equipment` — expect 4 passing tests, exit 0.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/data/__tests__/equipment.test.ts && git commit -m "despre: test equipment data invariants and asset existence"`

### Task 9: EquipmentShowcase component

Render the Utilaje & Echipă grid. Follow the existing despre visual language: `max-w-7xl`, mono eyebrow, `text-display-lg` heading, bordered cards. Use `next/image` for the placeholder SVGs (they are static; `unoptimized` is fine for SVG). Mark the placeholder nature with a small caption on each tile.

**Files:**
- Create `src/components/despre/EquipmentShowcase.tsx`

**Interfaces:**
- Consumes: `EQUIPMENT_ITEMS` from `src/data/equipment.ts`.
- Produces: `export function EquipmentShowcase(): JSX.Element`.

- [ ] Create `src/components/despre/EquipmentShowcase.tsx`:
  ```tsx
  import Image from "next/image";
  import { EQUIPMENT_ITEMS } from "@/data/equipment";

  function spanClass(span?: "wide" | "tall") {
    if (span === "wide") return "sm:col-span-2";
    if (span === "tall") return "sm:row-span-2";
    return "";
  }

  export function EquipmentShowcase() {
    return (
      <section className="border-y border-border bg-bg-elevated">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <header className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-primary">
              Utilaje &amp; echipă
            </p>
            <h2 className="mt-4 text-display-lg">Gama completă, oamenii reali.</h2>
            <p className="mt-5 text-lg text-text-muted">
              Aplicăm cu utilaje proprii, nu închiriate la zi. De la malaxoare și
              pompe până la duba de șantier și echipa care le ține în mână —
              capacitatea de execuție stă la noi.
            </p>
          </header>

          <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 sm:grid-cols-3 md:auto-rows-[240px]">
            {EQUIPMENT_ITEMS.map((item) => (
              <figure
                key={item.id}
                className={`group relative overflow-hidden border border-border bg-bg-base ${spanClass(
                  item.span
                )}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  draggable={false}
                />
                {item.isPlaceholder ? (
                  <figcaption className="absolute left-2 top-2 z-10 bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
                    Placeholder
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      </section>
    );
  }
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors for this file.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/EquipmentShowcase.tsx && git commit -m "despre: add EquipmentShowcase grid component"`

### Task 10: Mount EquipmentShowcase + finalize page order

Wire the new section into `/despre` and confirm the page composition reflects the §7+§8 intent: founder story kept, one curated quote, principles, directions with links, then the new showcase. Keep `PartnerPanel` (Stockmeier only — Conica stays removed per global constraint).

**Files:**
- Modify `src/app/despre/page.tsx` (lines 2-10 imports; lines 57-67 the `<main>` composition)

**Interfaces:**
- Consumes: `EquipmentShowcase` from `src/components/despre/EquipmentShowcase`.

- [ ] In `src/app/despre/page.tsx`, add the import after the `BeyondProject` import (line 8):
  ```tsx
  import { EquipmentShowcase } from "@/components/despre/EquipmentShowcase";
  ```
- [ ] Replace the `<main>` block (lines 57-67) with the finalized order — insert `<EquipmentShowcase />` after `<PillarsGrid />` (directions) and before `<PartnerPanel />`:
  ```tsx
        <main>
          <HeroAbout />
          <MissionBlock />
          <ManifestoQuote />
          <PrinciplesGrid />
          <PillarsGrid />
          <EquipmentShowcase />
          <PartnerPanel />
          <BeyondProject />
          <StatsRow />
          <AboutCta />
        </main>
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] In the dev server open `http://localhost:3000/despre` and scroll top-to-bottom; confirm order: Hero → "De unde am pornit" founder story → "Ne-am asumat rolul de specialiști" quote → "Trei principii" (middle card = "Specificația corectă…") → "Direcțiile noastre" (cards route to /servicii/...) → "Utilaje & echipă" grid with 6 machine tiles + wide Dubă + tall Echipă, each showing the "Placeholder" badge → Stockmeier panel → "Învățăm industria" → stats → CTA.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/despre/page.tsx && git commit -m "despre: mount EquipmentShowcase and finalize section order"`

### Task 11: Full-suite verification gate

Confirm nothing in the despre rework regressed the existing test suite or types.

**Files:** none (verification only).

- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm test` — expect all suites green including the two new ones (`direction-links`, `equipment`).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (exit 0).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect clean.
- [ ] Do NOT run `npm run build` (dev/build share `.next/`). Final production build is a separate end-of-session step.
- [ ] If all green and any working-tree changes remain: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add -A && git commit -m "despre: verification pass — suite, types, lint green"` (skip if nothing to commit).

## Cross-Plan Dependencies

- **Servicii routes (`/servicii/[category]`):** Task 4 links direction cards to `/servicii/multisport`, `/servicii/piste-atletism`, `/servicii/educational`, `/servicii/constructii-cheie`. These category slugs come from `src/data/systems.json` but the actual route pages are owned by the Servicii subsystem plan (§1/§IA). Until that plan ships the category route, these links 404. The slug list must stay in sync with that plan's route segment naming.
- **`PILLARS` export:** Task 5 exports `PILLARS` from `PillarsGrid.tsx`; the Servicii plan can import it to assert route coverage (every direction href resolves to a real category page).

## Notes for the executor

- All placeholder assets are clearly marked: SVG files carry "PLACEHOLDER — foto reală de la Teo" text, every `EquipmentItem` has `isPlaceholder: true`, and each tile renders a "Placeholder" badge. When Teo's real photos arrive, replace the file under `/images/placeholders/`, update `src` + set `isPlaceholder: false` in `src/data/equipment.ts`, and the badge disappears automatically.
- Copy is professional-register draft. The principle #2 rewrite and all founder-story prose are marked/scaffolded for Teo/Ioana's final pass, which comes back through code per §8 (no CMS).
