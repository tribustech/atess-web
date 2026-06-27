# Global brand de-personalization, copy pass & quick fixes Implementation Plan

> Executed task-by-task. Each task is a small unit of work with checkbox `- [ ]` steps (2–5 min each), explicit file paths, the exact Romanian copy to write, a verification gate, and a closing commit. Do the tasks in order. Do **not** batch commits — one commit per task.

**Goal:** De-personalize the site from a "Teo personality cult" into a credible company ("ATESS Project"), broaden the top-level positioning from "pardoseli sportive" to "pardoseli profesionale", and fix the Contact WhatsApp routing bug.

**Architecture:** This is a copy/content + metadata pass plus one logic bugfix — no new routes, no new data shapes. User-facing strings and SEO metadata are edited in place across the Home components, shared Header/Footer, Contact components, the `/invata` author bylines, and per-page `metadata` exports. The one piece of real logic is the WhatsApp link helper `waLink()` in `src/lib/site-contact.ts`, which gets a vitest unit test guaranteeing it always resolves to a `wa.me` URL and never to an internal route like `/invata`.

**Tech Stack:** Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react, Vitest.

## Global Constraints

- Stack: Next.js 15.5 (App Router, Turbopack), React 19.1, TypeScript 5, Tailwind CSS 4, Framer Motion 12, GSAP, Lenis, three / @react-three/fiber / drei, Zod, lucide-react. App lives in `/Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next`.
- Romanian-only site. No i18n / no language toggle.
- Professional Romanian register in ALL user-facing copy: NO `asta`/`astea`/`păi`/`hai să`/conversational shop-talk. Formal, confident, concise.
- ASSET STRATEGY: scaffold everything NOW with placeholders (placeholder logo-on-white, placeholder/existing photos, a parametrized 3D stub, draft copy) so the whole site is reviewable end-to-end and Teo's real assets drop in later. Mark each placeholder clearly in the plan.
- VERIFICATION (pragmatic gates, NOT strict TDD): logic/data/rules tasks get vitest + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` + `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint`; visual/3D/copy tasks get manual browser review (`cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`). Commit frequently. DO NOT run `npm run build` mid-session (dev and build share `.next/` and collide).
- Prior settled decisions: Conica removed site-wide (do not reintroduce); Home has no E2/E3/E4 mono section markers.

## File Structure

| File | Responsibility in this plan |
| --- | --- |
| `src/lib/site-contact.ts` | MODIFY — neutralize the WhatsApp default message (drop "sportivă" so it reads "pardoseală profesională"); the source of truth `waLink()` helper is verified by a new test. |
| `src/lib/site-contact.test.ts` | CREATE — vitest unit test that locks `waLink()` to a `wa.me` URL and proves it never returns an internal path like `/invata` (the Contact WhatsApp bug guard). |
| `src/components/contact/ContactChannels.tsx` | MODIFY — confirm the WhatsApp channel `href` uses `waLink()` and opens in a new tab; de-personalize the phone `meta` ("răspunde Teo" → "răspunde echipa"). |
| `src/app/layout.tsx` | MODIFY — root `metadata`: headline/positioning "Pardoseli sportive profesionale" → "Pardoseli profesionale", keywords broadened. |
| `src/app/page.tsx` | MODIFY — Home `metadata` title/description de-sportive-d; remove `TeoSection` import + render (founder block lives only on Despre). |
| `src/components/home/HeroSection.tsx` | MODIFY — eyebrow + sub-headline de-personalized and broadened. |
| `src/components/home/FinalCtaSection.tsx` | MODIFY — "Vorbeste cu Teo" CTA → "Contactează echipa"; de-personalize body copy. |
| `src/components/home/TeoSection.tsx` | DELETE — the homepage founder block is removed (the single allowed founder block stays on Despre, owned by the despre plan). |
| `src/components/shared/Footer.tsx` | MODIFY — tagline "Pardoseli sportive profesionale" → "Pardoseli profesionale". |
| `src/components/despre/AboutCta.tsx` | MODIFY — body line "recomandare validată de Teo." → "recomandare validată de echipa noastră." (CTA copy only — does NOT touch the founder-story block). |
| `src/app/invata/page.tsx` | MODIFY — byline "scris de Teo Neagu" / "Elaborate de Teo Neagu" → company-authored phrasing; metadata "sportivă/sportive" softened. |
| `src/app/invata/[slug]/page.tsx` | MODIFY — article author byline "Teo Neagu" → "Echipa ATESS"; keep `Person`→`Organization` author in JSON-LD. |
| `src/app/opengraph-image.tsx` | MODIFY — OG label "Pardoseli sportive profesionale" → "Pardoseli profesionale". |
| `src/app/manifest.ts` | MODIFY — PWA description "Pardoseli sportive profesionale" → "Pardoseli profesionale". |

**Out of scope (owned by the despre-team plan — DO NOT EDIT here):** `src/app/despre/page.tsx` (metadata + `personLd`), `src/components/despre/HeroAbout.tsx`, `ManifestoQuote.tsx`, `MissionBlock.tsx`, `PrinciplesGrid.tsx`, `PillarsGrid.tsx`, `PartnerPanel.tsx`. These hold the single allowed founder-story block; leave them intact.

## Tasks

### Task 1: Lock down the WhatsApp link helper (Contact bug guard)

The Contact page WhatsApp button reportedly routed to `/invata`. The current `waLink()` in `src/lib/site-contact.ts` returns a `wa.me` URL, but there is no test guaranteeing it. Add a regression test and neutralize the personalized default WA message.

**Files:**
- Modify: `src/lib/site-contact.ts` (line 15–16, the `WA_DEFAULT_MESSAGE` constant)
- Create: `src/lib/site-contact.test.ts`

**Interfaces:**
- Consumes: `waLink(message?: string): string` and `WA_DEFAULT_MESSAGE: string` (existing exports of `src/lib/site-contact.ts`).
- Produces: no new exports. The test asserts the contract `waLink()` → starts with `"https://wa.me/40700000000"` and never contains `"/invata"`.

- [ ] In `src/lib/site-contact.ts`, replace the `WA_DEFAULT_MESSAGE` value `"Bună! Sunt interesat(ă) de o pardoseală sportivă ATESS. Putem discuta?"` with `"Bună ziua! Sunt interesat(ă) de o pardoseală profesională ATESS. Putem discuta?"`.
- [ ] Create `src/lib/site-contact.test.ts` with:
  ```ts
  import { describe, expect, it } from "vitest";
  import { SITE_CONTACT, WA_DEFAULT_MESSAGE, waLink } from "./site-contact";

  describe("waLink", () => {
    it("returns a wa.me URL for the configured number", () => {
      const url = waLink();
      expect(url.startsWith(`https://wa.me/${SITE_CONTACT.phone.waNumber}`)).toBe(true);
    });

    it("never routes to an internal page (Contact WhatsApp bug guard)", () => {
      const url = waLink();
      expect(url).not.toContain("/invata");
      expect(url.startsWith("https://wa.me/")).toBe(true);
    });

    it("encodes a custom message into the text query param", () => {
      const url = waLink("Salut, am o întrebare");
      expect(url).toContain(`?text=${encodeURIComponent("Salut, am o întrebare")}`);
    });

    it("uses the professional default message", () => {
      expect(WA_DEFAULT_MESSAGE).toContain("pardoseală profesională");
      expect(WA_DEFAULT_MESSAGE).not.toContain("sportivă");
    });
  });
  ```
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx vitest run src/lib/site-contact.test.ts` — expect `4 passed`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output (clean exit).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/lib/site-contact.ts src/lib/site-contact.test.ts && git commit -m "test(contact): guard waLink against internal-route regression; neutralize WA message"`

### Task 2: Fix & verify the Contact WhatsApp channel routing + de-personalize meta

`src/components/contact/ContactChannels.tsx` renders the channel cards as `<motion.a href={c.href}>`. Confirm the WhatsApp card's `href` is `waLink()` (the `wa.me` URL from Task 1), not an internal path, and de-personalize the phone card's meta line.

**Files:**
- Modify: `src/components/contact/ContactChannels.tsx` (the `CHANNELS` array, lines 17–45; specifically the `phone` `meta` on line 23 and the `whatsapp` `href` on line 31)

**Interfaces:**
- Consumes: `waLink()` and `SITE_CONTACT` from `@/lib/site-contact`.
- Produces: no exported type changes. The `whatsapp` channel object MUST keep `href: waLink()` and the anchor MUST keep `target="_blank"` + `rel="noopener noreferrer"` (already present on lines 92–93).

- [ ] In `src/components/contact/ContactChannels.tsx`, confirm the `whatsapp` channel object (line 28–35) has `href: waLink(),`. If it currently reads anything else (e.g. `href: "/invata"` or `href: waLink`), set it to exactly `href: waLink(),`.
- [ ] Confirm the rendered anchor keeps `target={c.key === "whatsapp" ? "_blank" : undefined}` and `rel={c.key === "whatsapp" ? "noopener noreferrer" : undefined}` (lines 92–93) — leave as-is.
- [ ] Change the `phone` channel `meta` from `"Apasă să suni · răspunde Teo"` to `"Apasă să suni · răspunde echipa ATESS"`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/contact`, and in the browser hover the WhatsApp card and read the status-bar URL — it MUST be `https://wa.me/40700000000?text=...`, NOT `/invata`. Click it and confirm it opens WhatsApp (web/app), not the Învață page. Confirm the phone card now reads "răspunde echipa ATESS".
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/contact/ContactChannels.tsx && git commit -m "fix(contact): ensure WhatsApp card opens wa.me link; de-personalize phone meta"`

### Task 3: Remove the homepage founder block (TeoSection)

The homepage currently renders a `TeoSection` ("Teo Neagu" portrait + "Consultant principal" + personal quote). Per the strategic shift, the single allowed founder block lives only on Despre. Remove it from Home.

**Files:**
- Modify: `src/app/page.tsx` (line 3 import, lines 62–64 render)
- Delete: `src/components/home/TeoSection.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: Home page no longer imports or renders `TeoSection`. No component in this plan should import `TeoSection` after this task.

- [ ] In `src/app/page.tsx`, delete the import line `import { TeoSection } from "@/components/home/TeoSection";` (line 3).
- [ ] In `src/app/page.tsx`, delete the block (lines 62–64):
  ```tsx
        <SnapSection id="teo" className="bg-bg-base">
          <TeoSection />
        </SnapSection>
  ```
- [ ] Delete the file `src/components/home/TeoSection.tsx` (`cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git rm src/components/home/TeoSection.tsx`).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && grep -rn "TeoSection" src/` — expect no matches.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/`, scroll through Home and confirm the "Teo Neagu / Consultant principal" section is gone and the page flows Hero → Flooring 3D → Clients → Final CTA with no gap.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add -A && git commit -m "feat(home): remove founder block from homepage (founder story lives on Despre)"`

### Task 4: Replace the "Vorbeste cu Teo" CTA and de-personalize Final CTA copy

`src/components/home/FinalCtaSection.tsx` has the exact "Vorbeste cu Teo" button Teo called out, plus body copy crediting "Teo" personally.

**Files:**
- Modify: `src/components/home/FinalCtaSection.tsx` (line 16 body copy, line 33 button label)

**Interfaces:**
- Consumes: nothing new.
- Produces: the button still links to `/contact` (unchanged `href`); only the visible label and body copy change.

- [ ] In `src/components/home/FinalCtaSection.tsx`, change the body paragraph (line 14–17) from `In 2 minute afli sistemele potrivite, pasii de executie si recomandarile pe care Teo le valideaza cu tine.` to `În 2 minute afli sistemele potrivite, pașii de execuție și recomandările validate de echipa ATESS.`
- [ ] In the same file, change the ghost button label (line 33) from `Vorbeste cu Teo` to `Contactează echipa`.
- [ ] Confirm the surrounding `<Link href="/contact" ...>` (line 27) is unchanged — the CTA still routes to Contact.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && grep -rni "vorbe.te cu teo" src/` — expect no matches.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/`, scroll to the bottom CTA, confirm the secondary button reads "Contactează echipa", routes to `/contact`, and the body copy reads "...validate de echipa ATESS."
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/home/FinalCtaSection.tsx && git commit -m "feat(home): replace 'Vorbeste cu Teo' CTA with 'Contactează echipa'"`

### Task 5: Broaden & de-personalize the Hero copy

`src/components/home/HeroSection.tsx` has the eyebrow "Pardoseli sportive profesionale" and a sub-headline that names Teo ("consultanță directă cu Teo Neagu").

**Files:**
- Modify: `src/components/home/HeroSection.tsx` (eyebrow line 100; sub-headline lines 112–115)

**Interfaces:**
- Consumes: nothing new.
- Produces: visible copy only; the rotating media, partners block, and CTAs are unchanged.

- [ ] In `src/components/home/HeroSection.tsx`, change the eyebrow text (line 100) from `Pardoseli sportive profesionale` to `Pardoseli profesionale`.
- [ ] Change the sub-headline paragraph (lines 113–114) from `Sisteme Stockmeier executate cu rigoare de șantier, detaliu tehnic și consultanță directă cu Teo Neagu.` to `Sisteme Stockmeier executate cu rigoare de șantier, precizie tehnică și suport direct din partea echipei ATESS.`
- [ ] Keep the H1 ("Suprafețe / construite / să reziste.") and both CTA buttons unchanged.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/`, confirm the eyebrow reads "Pardoseli profesionale" and the sub-headline names the team, not Teo. No "consultanță" wording remains.
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/home/HeroSection.tsx && git commit -m "feat(home): broaden hero to 'pardoseli profesionale'; de-personalize sub-headline"`

### Task 6: De-personalize the Footer tagline

`src/components/shared/Footer.tsx` tagline says "Pardoseli sportive profesionale." Broaden it.

**Files:**
- Modify: `src/components/shared/Footer.tsx` (lines 15–18)

**Interfaces:**
- Consumes: `SITE_CONTACT` from `@/lib/site-contact` (unchanged).
- Produces: visible footer copy only.

- [ ] In `src/components/shared/Footer.tsx`, change the tagline (lines 15–18) from `Pardoseli sportive profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren.` to `Pardoseli profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren.`
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open any page, scroll to the footer, confirm tagline reads "Pardoseli profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren."
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/shared/Footer.tsx && git commit -m "feat(footer): broaden tagline to 'pardoseli profesionale'"`

### Task 7: De-personalize the Despre AboutCta copy (CTA only)

`src/components/despre/AboutCta.tsx` is the bottom CTA on Despre — it is NOT the founder-story block, so it is in scope. It credits "Teo" personally.

**Files:**
- Modify: `src/components/despre/AboutCta.tsx` (line 14 body copy)

**Interfaces:**
- Consumes: `Button` from `@/components/shared/Button` (unchanged).
- Produces: visible CTA copy only. Do NOT touch `HeroAbout.tsx`, `ManifestoQuote.tsx`, or any founder-story component.

- [ ] In `src/components/despre/AboutCta.tsx`, change the body paragraph (lines 12–15) from `Configurează proiectul în 2 minute sau scrie-ne direct. Revenim cu o recomandare validată de Teo.` to `Configurează proiectul în 2 minute sau scrie-ne direct. Revenim cu o recomandare validată de echipa ATESS.`
- [ ] Keep the heading "Hai să facem ceva care rezistă." and both buttons unchanged (out of this task's scope; the heading register is the despre plan's call).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/despre`, scroll to the bottom CTA, confirm the body reads "...validată de echipa ATESS."
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/components/despre/AboutCta.tsx && git commit -m "feat(despre): de-personalize bottom CTA copy (Teo → echipa ATESS)"`

### Task 8: De-personalize the Învață author bylines

`/invata` lists Teo personally as the author. Demote to the company while keeping JSON-LD valid (switch the article author from `Person` to `Organization`). The single founder identity stays on Despre.

**Files:**
- Modify: `src/app/invata/page.tsx` (metadata description line 15; body byline lines 71–72)
- Modify: `src/app/invata/[slug]/page.tsx` (JSON-LD author block lines 75–78; visible author byline line 135)

**Interfaces:**
- Consumes: `getAllArticles`, `getArticlesGroupedByCategory` from `@/lib/academy` (unchanged), article data from `src/data/academy.json` (unchanged).
- Produces: article JSON-LD `author` becomes `{ "@type": "Organization", name: "ATESS Project", url: SITE_URL }`; visible byline reads "Echipa ATESS".

- [ ] In `src/app/invata/page.tsx`, change the metadata `description` (lines 14–15) from `Cum alegi corect pardoseala sportivă, cum citești o fișă tehnică, ce nu-ți spune marketingul. Conținut tehnic gratuit, scris de Teo Neagu, aplicator certificat cu 10+ ani pe șantier.` to `Cum alegi corect pardoseala, cum citești o fișă tehnică, ce nu-ți spune marketingul. Conținut tehnic gratuit, elaborat de echipa ATESS, aplicator certificat cu 10+ ani pe șantier.`
- [ ] In `src/app/invata/page.tsx`, change the body intro byline (lines 70–73) from `Elaborate de Teo Neagu — peste 10 ani de experiență pe șantier, aplicator certificat Stockmeier — pe baza practicii reale, nu a materialelor de marketing.` to `Elaborate de echipa ATESS — peste 10 ani de experiență pe șantier, aplicator certificat Stockmeier — pe baza practicii reale, nu a materialelor de marketing.`
- [ ] In `src/app/invata/[slug]/page.tsx`, change the JSON-LD `author` block (lines 74–78) from:
  ```ts
      author: {
        "@type": "Person",
        name: "Teo Neagu",
        url: `${SITE_URL}/despre`,
      },
  ```
  to:
  ```ts
      author: {
        "@type": "Organization",
        name: "ATESS Project",
        url: SITE_URL,
      },
  ```
- [ ] In `src/app/invata/[slug]/page.tsx`, change the visible author byline (line 135) from `<p className="mt-1 text-text-primary">Teo Neagu</p>` to `<p className="mt-1 text-text-primary">Echipa ATESS</p>`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/invata` and one article (e.g. the first card), confirm the "Autor" field reads "Echipa ATESS" and the intro byline reads "Elaborate de echipa ATESS".
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/invata/page.tsx "src/app/invata/[slug]/page.tsx" && git commit -m "feat(invata): de-personalize author bylines (Teo → Echipa ATESS), broaden meta"`

### Task 9: Broaden the root + Home SEO metadata (de-sportive-d)

The root layout and Home page metadata center "Pardoseli sportive profesionale". Broaden the headline-level title while keeping sport flooring in keywords (it is still the core, just not the headline).

**Files:**
- Modify: `src/app/layout.tsx` (`metadata`: `title.default` line 41, `description` line 45, `keywords` lines 47–54, `openGraph.title` line 62, `twitter.description` line 76)
- Modify: `src/app/page.tsx` (`metadata.title` line 12, `metadata.description` lines 13–14)

**Interfaces:**
- Consumes: nothing new.
- Produces: `<title>` defaults to `"ATESS Project — Pardoseli profesionale"`; meta description leads with "Pardoseli profesionale".

- [ ] In `src/app/layout.tsx`, change `title.default` (line 41) from `"ATESS Project — Pardoseli sportive profesionale"` to `"ATESS Project — Pardoseli profesionale"`.
- [ ] Change the root `description` (lines 44–45) from `"Pardoseli sportive profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren."` to `"Pardoseli profesionale: sportive, interior și exterior. Aplicator certificat Stockmeier. 10+ ani pe teren."`
- [ ] Change `keywords` (lines 47–54) from:
  ```ts
    keywords: [
      "pardoseli sportive",
      "Stockmeier",
      "tartan",
      "piste atletism",
      "multisport",
      "România",
    ],
  ```
  to:
  ```ts
    keywords: [
      "pardoseli profesionale",
      "pardoseli sportive",
      "pardoseli interior",
      "pardoseli exterior",
      "Stockmeier",
      "tartan",
      "piste atletism",
      "multisport",
      "România",
    ],
  ```
- [ ] Change `openGraph.title` (line 62) from `"ATESS Project — Pardoseli sportive profesionale"` to `"ATESS Project — Pardoseli profesionale"`.
- [ ] Change `twitter.description` (line 76) from `"Pardoseli sportive profesionale"` to `"Pardoseli profesionale"`.
- [ ] In `src/app/page.tsx`, change `metadata.title` (line 12) from `"ATESS Project — Pardoseli sportive profesionale"` to `"ATESS Project — Pardoseli profesionale"`.
- [ ] Change Home `metadata.description` (lines 13–14) from `"Pardoseli sportive profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren."` to `"Pardoseli profesionale: sportive, interior și exterior. Aplicator certificat Stockmeier. 10+ ani pe teren."`
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/`, View Source / check the browser tab title — expect "ATESS Project — Pardoseli profesionale"; confirm `<meta name="description">` leads with "Pardoseli profesionale".
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/layout.tsx src/app/page.tsx && git commit -m "feat(seo): broaden root + home metadata to 'pardoseli profesionale'"`

### Task 10: Broaden OG image + PWA manifest copy

The OpenGraph image and the PWA manifest both hard-code "Pardoseli sportive profesionale".

**Files:**
- Modify: `src/app/opengraph-image.tsx` (`alt` line 4, rendered label line 54)
- Modify: `src/app/manifest.ts` (`description` line 7)

**Interfaces:**
- Consumes: nothing new.
- Produces: OG image `alt` and rendered label, plus manifest `description`, read "Pardoseli profesionale".

- [ ] In `src/app/opengraph-image.tsx`, change `alt` (line 4) from `"ATESS Project — Pardoseli sportive profesionale"` to `"ATESS Project — Pardoseli profesionale"`.
- [ ] In the same file, change the rendered label (line 54) from `Pardoseli sportive profesionale` to `Pardoseli profesionale`.
- [ ] In `src/app/manifest.ts`, change `description` (line 7) from `"Pardoseli sportive profesionale"` to `"Pardoseli profesionale"`.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run dev`, open `http://localhost:3000/opengraph-image` and confirm the rendered image reads "Pardoseli profesionale"; open `http://localhost:3000/manifest.webmanifest` and confirm `description` is "Pardoseli profesionale".
- [ ] `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add src/app/opengraph-image.tsx src/app/manifest.ts && git commit -m "feat(seo): broaden OG image + manifest copy to 'pardoseli profesionale'"`

### Task 11: Final sweep — confirm no stray "Vorbește cu Teo" / consultanță / homepage Teo references

A grep gate to confirm the de-personalization is complete in this plan's scope. Remaining "Teo Neagu" references must only be the allowed founder block on Despre (`HeroAbout`, `personLd`, despre metadata — owned by the despre plan) plus `ManifestoQuote` / `MissionBlock` (despre plan). Nothing in Home, Footer, Contact, or Invata should name Teo personally.

**Files:** none modified (verification-only, unless a stray is found).

**Interfaces:** none.

- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && grep -rni "vorbe.te cu teo\|consultan" src/` — expect no matches (the only prior `consultanță`/`Consultant principal` hits were in HeroSection and the now-deleted TeoSection).
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && grep -rn "Teo" src/components/home src/components/contact src/components/shared` — expect no matches.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && grep -rn "Teo" src/app/invata` — expect no matches.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && grep -rni "pardoseli sportive profesionale" src/` — expect no matches (only "pardoseli profesionale" remains at headline level; deeper body/category copy may still say "pardoseli sportive" — that is intentional and fine).
- [ ] If any unexpected stray is found that belongs to this plan's scope (Home / Footer / Contact / Invata / root metadata), fix it inline using the same replacement convention (person → "echipa ATESS", "sportive profesionale" headline → "profesionale"), then re-run the greps.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx vitest run` — expect all tests passing.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npx tsc --noEmit` — expect no output.
- [ ] Run `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && npm run lint` — expect no errors.
- [ ] If any fix was applied: `cd /Users/andrewradulescu/Documents/Projects/TeoNeagu/atess-web-next && git add -A && git commit -m "chore: final de-personalization sweep"`. If nothing changed, skip the commit.
