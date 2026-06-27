# Home showpiece — Interior/Exterior drag-divider split

**Date:** 2026-06-23
**Branch:** `feat/teo-redesign-2026-06`
**Context:** The 3D layered-floor block was moved off Home into Servicii. Teo flagged that the
post-hero slot still needs *something eye-catching* and said he'd propose an alternative
(F4 01:09–01:34). This is that alternative: a showpiece that doubles as a teaching device for
the new primary IA axis (Interior vs Exterior).

## Goal

A full-bleed section directly after the hero that splits into **Exterior** and **Interior**
halves with a draggable vertical divider (before/after-style reveal). It is the eye-catching
moment *and* it routes visitors into the two branches of `/servicii`.

## Constraints (from feedback)

- **Instant load** — no heavy loaders. Pure CSS clip + tiny pointer handler, no library. Hero
  keeps `priority`; split images are lazy.
- **Everything routes** — cross-linking is a hard requirement. Each half has a real `<Link>`.
- Interior vs Exterior is the new primary axis; sports are tagged within each.

## Mechanics

- New client component `src/components/home/InteriorExteriorSplit.tsx`, inserted into
  `src/app/page.tsx` as a `SnapSection` immediately after the hero (Producers shifts down).
- Two layered photo panels. Exterior = base layer; Interior layer on top, clipped by
  `clip-path: inset(0 0 0 var(--split))` driven by a CSS variable (0–100%).
- Dragging the handle updates `--split`. Handle is a vertical seam with `◀▶` affordance,
  `role="slider"`, `aria-valuenow`, arrow-key support, `aria-label`.
- Each half: eyebrow (Exterior/Interior), one-line promise, category tags, `Vezi →` button.
  - Exterior → EPDM/piste, locuri de joacă, piatră, alei. Promise: rezistă la UV, îngheț, trafic.
  - Interior → sport indoor, mochetă, PVC/linoleum, LVT. Promise: confort, acustică, finisaj.
- Routing targets: `/servicii#exterior`, `/servicii#interior`.

## Accessibility / fallback

- No-JS / reduced-motion: divider sits at 50%, both halves visible and clickable (degrades to
  a static split). Routing never depends on drag — CTAs are plain links.
- Mobile: pointer/touch drag; when a half is too narrow its cluster fades but both `Vezi →`
  CTAs remain reachable below the image.

## Files

- **new** `src/components/home/InteriorExteriorSplit.tsx`
- `src/app/page.tsx` — insert section after hero
- `src/app/servicii/page.tsx` — add `id="exterior"` / `id="interior"` + `scroll-mt`
- real project photos from the gallery (Poze):
  - Exterior: `/images/1505c0a0-d7e5-4532-ba42-f7bd950f290b.webp` (dusk red athletics track)
  - Interior: `/images/b48ce4d2-6dc5-4bd0-9849-35076f6d5680.webp` (glossy blue indoor hall)

## Verification

- `tsc` 0, `lint` 0 err.
- Visual check via headless Chrome at full size (per project convention).
- Keyboard: focus handle, arrow keys move divider; Tab reaches both CTAs.
