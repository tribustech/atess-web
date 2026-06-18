# Configurator — §9 Validation Record

Status per Teo (F3 48:44): "Configuratorul este bine." This is a validation pass, not a rebuild.

## Confirmed already implemented

- [x] Per-sport icons — `StepSport.tsx` lines 17–79: `BasketballIcon` / `TennisIcon` / `SoccerIcon` (inline SVG, lines 17–51) + `Volleyball` / `Trophy` / `HelpCircle` (lucide-react, line 3). Every entry in `OPTIONS[]` (lines 60–79) has an `icon` field.
- [x] Preset "usual" dimensions — `StepDimensions.tsx` `presetsFor()` lines 14–93: basket `28 × 15` (line 28 & 40), volei `18 × 9`, tenis `24 × 11`, handbal `40 × 20`, fotbal 5/7/11, plus `loc-joaca` / `spatii-publice` / `interior` / `constructii-cheie` presets. Chips render as pill buttons with `aria-pressed`.
- [x] Recommendation cards "in your face" — `RecommendationHint.tsx`: fixed bottom card (z-30) with animated entrance, eyebrow "Recomandare", `rule.then.title`, `rule.then.message`, "Aplică recomandarea" (lines 74–88, only when `rule.then.rewriteAnswers` exists), "Citește mai mult" (lines 89–97, only when `rule.then.detail` exists), dismiss variant "Continuă cu alegerea inițială" / "Am înțeles" (lines 98–112). Full detail modal (z-50) with same affordances (lines 120–212).
- [x] Rules engine covers §9 examples — `configurator-rules.json`: `basket-kids-to-playground` (kids <12 + basket → EPDM playground, line 3) and `fara-fundatie` (no foundation → include pour, line 66) are both present with full `detail` copy.
- [x] Email flags applied rewrites — `configurator-lead.ts` lines 60–67 (text) and 95–108 (HTML diff): renders "Recomandare aplicată" section with strikethrough diff when `acceptedRule` + `originalAnswers` are present.

## Gaps closed by this plan (not yet implemented)

- [ ] Email does NOT flag informational recommendations the user *read but did not rewrite* (e.g. PVC medical `interior-spital`, plută `gradinita-privata-pluta`). Teo cannot see engagement. → **Task 2–4**: add `readRules[]` / `declinedRules[]` tracking to state + submit payload + email template.
- [ ] §9 "public nesupervizat → fără fundație" had no dedicated rule. The existing `public-basket-mixed-use` rule redirects to `multisport` (different intent). → **Task 5**: add `public-nesupervizat-fara-fundatie` rule to `configurator-rules.json`.
- [ ] `configurator-rules.json` has no documented edit/regenerate workflow; no README. → **Task 6**: create `src/data/configurator-rules.README.md`.
- [ ] Rules engine vitest (`__tests__/rules.test.ts`) covers happy paths only — no matcher edge cases, priority ordering, or boundary conditions (e.g. `totalM2Below`, `lengthBelow`). → **Task 7**: expand test coverage.

## Rules review protocol with Teo

See `src/data/configurator-rules.README.md` (to be created in Task 6) and the standing review task (Task 8).
